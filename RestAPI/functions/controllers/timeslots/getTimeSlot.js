const { dataConnect } = require("../../config/firebase.js");

const getAvailableTimeSlots = async (req, res) => {
  try {
    const { slotDate } = req.query;

    if (!slotDate) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Slot date is required",
      });
    }

    const GET_AVAILABLE_TIME_SLOTS_QUERY = `
        query GetAvailableTimeSlots($slotDate: Date!) @auth(level: USER) {
          timeSlots(where: { slotDate: { eq: $slotDate }, available: { eq: true } }, orderBy: { startTime: ASC }) {
            id
            slotDate
            startTime
            endTime
            maxCapacity
            currentBookings
            staff {
              id
              fullname
            }
            notes
          }
        }
      `;

    const variables = { slotDate };

    console.log("Executing GraphQL query:", GET_AVAILABLE_TIME_SLOTS_QUERY, "with variables:", variables);

    const response = await dataConnect.executeGraphql(GET_AVAILABLE_TIME_SLOTS_QUERY, { variables });

    const timeSlots = response.data?.timeSlots || [];

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Available time slots retrieved successfully",
      data: timeSlots,
    });
  } catch (error) {
    console.error("Error retrieving available time slots:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve available time slots",
      error: error.message,
    });
  }
}


const getTimeSlotById = async (req, res) => {
  try {
    const { timeSlotId } = req.params;

    if (!timeSlotId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Time Slot ID is required",
      });
    }

    const GET_TIME_SLOT_BY_ID_QUERY = `
        query GetTimeSlotById($timeSlotId: String!) @auth(level: USER) {
          timeSlot(key: { id: $timeSlotId }) {
            id
            slotDate
            startTime
            endTime
            maxCapacity
            currentBookings
            available
            staff {
              id
              fullname
            }
            notes
            createdAt
            updatedAt
          }
        }
      `;

    const variables = { timeSlotId };

    console.log("Executing GraphQL query:", GET_TIME_SLOT_BY_ID_QUERY, "with variables:", variables);

    const response = await dataConnect.executeGraphql(GET_TIME_SLOT_BY_ID_QUERY, { variables });

    const timeSlot = response.data?.timeSlot;

    if (!timeSlot) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Time slot not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Time slot retrieved successfully",
      data: timeSlot,
    });
  } catch (error) {
    console.error("Error retrieving time slot:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve time slot",
      error: error.message,
    });
  }
}

const getTimeSlotsByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    if (!staffId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Staff ID is required",
      });
    }

    const GET_TIME_SLOTS_BY_STAFF_QUERY = `
        query GetTimeSlotsByStaff($staffId: String!) @auth(level: USER) {
          timeSlots(where: { staffId: { eq: $staffId } }, orderBy: [{ slotDate: ASC }, { startTime: ASC }]) {
            id
            slotDate
            startTime
            endTime
            maxCapacity
            currentBookings
            available
            notes
          }
        }
      `;

    const variables = { staffId };

    console.log("Executing GraphQL query:", GET_TIME_SLOTS_BY_STAFF_QUERY, "with variables:", variables);

    const response = await dataConnect.executeGraphql(GET_TIME_SLOTS_BY_STAFF_QUERY, { variables });

    const timeSlots = response.data?.timeSlots || [];

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Time slots by staff retrieved successfully",
      data: timeSlots,
    });
  } catch (error) {
    console.error("Error retrieving time slots by staff:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve time slots by staff",
      error: error.message,
    });
  }
}

const getTimeSlotsInRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Start date is required",
      });
    }


    if (!endDate) {

      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "End date is required",
      });
    }

    const GET_TIME_SLOTS_IN_RANGE_QUERY = `
        query GetTimeSlotsInRange($startDate: Date!, $endDate: Date!) @auth(level: USER) {
          timeSlots(where: { slotDate: { ge: $startDate, le: $endDate } }, orderBy: [{ slotDate: ASC }, { startTime: ASC }]) {
            id
            slotDate
            startTime
            endTime
            maxCapacity
            currentBookings
            available
            staff {
              fullname
            }
          }
        }
      `;

    const variables = { startDate, endDate };

    console.log("Executing GraphQL query:", GET_TIME_SLOTS_IN_RANGE_QUERY, "with variables:", variables);

    const response = await dataConnect.executeGraphql(GET_TIME_SLOTS_IN_RANGE_QUERY, { variables });

    const timeSlots = response.data?.timeSlots || [];

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Time slots in range retrieved successfully",
      data: timeSlots,
    });
  } catch (error) {
    console.error("Error retrieving time slots in range:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve time slots in range",
      error: error.message,
    });
  }
}


module.exports = {
  getAvailableTimeSlots,
  getTimeSlotById,
  getTimeSlotsByStaff,
  getTimeSlotsInRange
};