const { dataConnect } = require("../../config/firebase.js");
const {addTimeSlot} = require("../timeSlots/addTimeSlot.js");
const {checkServiceExists} = require("../services/serviceUtils.js");
const {getActiveStaffWithLowestSlotCount} = require("../users/userUtils.js");
const {checkUserExists} = require("../users/userUtils.js");
const {updateStaffSlotCount} = require("../users/updateUser.js");
const {checkMethodExists} = require("../methods/methodUtils.js");
const {checkBookingExists} = require("./bookingUtils.js");
const {addBookingHistory} = require("../bookingHistory/addBookingHistory.js");
const {addParticipant} = require("../participants/addParticipant.js");

const addBooking = async (req, res) => {
  try {
    const {
        userId,
        slotDate,
        startTime,
        endTime,
        methodId,
        serviceId,
        totalAmount,
        participants,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "userId is required",
      });
    }

    if (!slotDate) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "slotDate is required",
      });
    }

    if (!startTime) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "startTime is required",
      });
    }

    if (!endTime) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "endTime is required",
      });
    }

    if (!methodId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "methodId is required",
      });
    }

    if (!serviceId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "serviceId is required",
      });
    }

    if (totalAmount === undefined || totalAmount === null) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "totalAmount is required",
      });
    }

    if (typeof totalAmount !== 'number' || totalAmount < 0) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "totalAmount must be a non-negative number",
      });
    }

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "participants array is required and must not be empty",
      });
    }

    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      
      if (!participant.name) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: `Participant at index ${i} is missing required field: name`,
        });
      }
      
      if (!participant.age || isNaN(participant.age) || participant.age < 0) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: `Participant at index ${i} has invalid age`,
        });
      }
      
      if (!participant.gender) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: `Participant at index ${i} is missing required field: gender`,
        });
      }
    }
    
    const CREATE_BOOKING_MUTATION = `
      mutation CreateBooking($id: String!, $userId: String!, $staffId: String!, $timeSlotId: String, $serviceId: String!, $methodId: String!, $totalAmount: Float!, $expiresAt: Timestamp!) @auth(level: USER) {
        booking_insert(data: {id: $id, userId: $userId, staffId: $staffId, timeSlotId: $timeSlotId, serviceId: $serviceId, methodId: $methodId, totalAmount: $totalAmount, expiresAt: $expiresAt})
      }
    `;

    const staffId = await getActiveStaffWithLowestSlotCount("1");
    const timeSlotId = `${slotDate}_${startTime}_${endTime}`;

    const bookingVariables = {
      id : `${userId}_${timeSlotId}`,
      userId,
      staffId: staffId,
      timeSlotId: timeSlotId,
      serviceId,
      methodId,
      totalAmount,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };

    if (await checkBookingExists(bookingVariables.id)) {
      return res.status(409).json({
        statusCode: 409,
        status: "error",
        message: "Booking with this ID already exists",
      });
    }

    if (!(await checkUserExists(userId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "User not found",
      });
    }

    if (!(await checkServiceExists(serviceId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Service not found",
      });
    }

    if (!(await checkMethodExists(methodId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Method not found",
      });
    }
    
    const updateTimeSlotResponse = await addTimeSlot(slotDate, startTime, endTime);

    const response = await dataConnect.executeGraphql(CREATE_BOOKING_MUTATION, {
      variables: bookingVariables,
    });

    const responseData = response.data;

    const updateStaffResponse = await updateStaffSlotCount(staffId, "increase");
    const createBooking = await addBookingHistory(bookingVariables.id, "created", "Booking saved successfully");
    const pendingBooking = await addBookingHistory(bookingVariables.id, "pending", "Booking is pending confirmation");

    const participantResults = [];
    for (const participant of participants) {
      try {
        const participantResult = await addParticipant(
          bookingVariables.id,
          participant.name,
          participant.age,
          participant.identification,
          participant.gender,
          participant.relationship
        );
        participantResults.push(participantResult);
      } catch (participantError) {
        console.error("Error adding participant:", participantError);
      }
    }

    console.log({
      updateStaffResponse,
      updateTimeSlotResponse,
      responseData, 
      createBooking,
      pendingBooking,
      participantResults
    })

    return res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Booking created successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    
    if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
      return res.status(409).json({
        statusCode: 409,
        status: "error",
        message: "Booking with this ID already exists",
        error: error.message,
      });
    }

    if (error.codePrefix === 'data-connect' && error.errorInfo) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Database operation failed",
        error: error.message,
      });
    }

    if (error.message && error.message.includes('validation')) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Validation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

module.exports = {
  addBooking
};