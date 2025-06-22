const { dataConnect } = require("../../config/firebase.js");
const {randomAlphanumericWithLength} = require("../utils/utilities.js");

const {addTimeSlot} = require("../timeSlots/addTimeSlot.js");

const {checkServiceExists} = require("../services/getServicesAndMethods.js");

const {getStaffWithLowestSlotCount} = require("../users/getUsers.js");
const {checkUserExists} = require("../users/getUsers.js");
const {updateStaffSlotCount} = require("../users/updateUser.js");

const {checkBookingExists} = require("./getBookings.js");
const addBooking = async (req, res) => {
  try {
    const {
        userId,
        slotDate,
        startTime,
        endTime,
        collectionMethod,
        price,
        serviceId,
        quantity,
        notes,
        totalAmount
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

    if (!collectionMethod) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "collectionMethod is required",
      });
    }

    if (price === undefined || price === null) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "price is required",
      });
    }

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "quantity is required",
      });
    }

    if (totalAmount === undefined || totalAmount === null) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "totalAmount is required",
      });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "price must be a non-negative number",
      });
    }

    if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "quantity must be a positive integer",
      });
    }

    if (typeof totalAmount !== 'number' || totalAmount < 0) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "totalAmount must be a non-negative number",
      });
    }

    const id = randomAlphanumericWithLength(10);
    const checkedBooking = await checkBookingExists(id);
    if (checkedBooking) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Booking with this ID already exists",
        error: "Booking with the provided ID already exists",
      });
    }

    const CREATE_BOOKING_MUTATION = `
      mutation CreateBooking($id: String!, $userId: String!, $staffId: String, $timeSlotId: String, $serviceId: String!, $collectionMethod: String!, $price: Float!, $quantity: Int!, $notes: String, $totalAmount: Float!) @auth(level: USER) {
        booking_insert(data: {id: $id, userId: $userId, staffId: $staffId, timeSlotId: $timeSlotId, serviceId: $serviceId, collectionMethod: $collectionMethod, price: $price, quantity: $quantity, notes: $notes, totalAmount: $totalAmount, status: "pending"})
      }
    `;

    const staffId = await getStaffWithLowestSlotCount();

    const bookingVariables = {
      id : id,
      userId,
      staffId: staffId,
      timeSlotId: `${slotDate}_${startTime}_${endTime}`,
      serviceId,
      collectionMethod,
      price,
      quantity,
      notes,
      totalAmount
    };

    const existingUser = await checkUserExists(bookingVariables.userId);
    if (!existingUser) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "User not found",
      });
    }

    const existingStaff = await checkUserExists(bookingVariables.staffId);
    if (!existingStaff) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Staff not found",
      });
    }

    const existingService = await checkServiceExists(bookingVariables.serviceId);
    if (!existingService) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Service not found",
      });
    }

    const updateTimeSlotResponse = await addTimeSlot(slotDate, startTime, endTime);

    const response = await dataConnect.executeGraphql(CREATE_BOOKING_MUTATION, {
      variables: bookingVariables,
    });

    const responseData = response.data;

    const updateStaffResponse = await updateStaffSlotCount(staffId, "increase");

    return res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Booking created successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    
    // Handle duplicate key constraint violation
    if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
      return res.status(409).json({
        statusCode: 409,
        status: "error",
        message: "Booking with this ID already exists",
        error: error.message,
      });
    }

    // Handle data-connect specific errors
    if (error.codePrefix === 'data-connect' && error.errorInfo) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Database operation failed",
        error: error.message,
      });
    }

    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Validation failed",
        error: error.message,
      });
    }

    // Generic server error
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