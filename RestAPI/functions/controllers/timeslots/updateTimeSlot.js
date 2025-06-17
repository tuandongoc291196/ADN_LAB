const { dataConnect } = require("../../config/firebase.js");

class UpdateTimeSlots {
  async updateTimeSlot(req, res) {
    try {
      const { timeSlotId, slotDate, startTime, endTime, maxCapacity, staffId, notes, available } = req.body;

      // Validate input
      if (!timeSlotId) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Time Slot ID is required",
        });
      }

      const UPDATE_TIME_SLOT_MUTATION = `
        mutation UpdateTimeSlot($timeSlotId: String!, $slotDate: Date, $startTime: String, $endTime: String, $maxCapacity: Int, $staffId: String, $notes: String, $available: Boolean) @auth(level: USER) {
          timeSlot_update(key: { id: $timeSlotId }, data: { slotDate: $slotDate, startTime: $startTime, endTime: $endTime, maxCapacity: $maxCapacity, staffId: $staffId, notes: $notes, available: $available, updatedAt_expr: "request.time" }) {
            id
            slotDate
            startTime
            endTime
            maxCapacity
            currentBookings
            available
            staffId
            notes
            updatedAt
          }
        }
      `;

      const variables = {
        timeSlotId,
        slotDate: slotDate || null,
        startTime: startTime || null,
        endTime: endTime || null,
        maxCapacity: maxCapacity || null,
        staffId: staffId || null,
        notes: notes || null,
        available: available !== undefined ? available : null,
      };

      console.log("Executing GraphQL mutation:", UPDATE_TIME_SLOT_MUTATION, "with variables:", variables);

      const response = await dataConnect.executeGraphql(UPDATE_TIME_SLOT_MUTATION, {
        variables,
      });

      const timeSlot = response.data?.timeSlot_update;

      if (!timeSlot) {
        throw new Error("Failed to update time slot");
      }

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Time slot updated successfully",
        data: timeSlot,
      });
    } catch (error) {
      console.error("Error updating time slot:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to update time slot",
        error: error.message,
      });
    }
  }

  async updateTimeSlotBookings(req, res) {
    try {
      const { timeSlotId, currentBookings } = req.body;

      // Validate input
      if (!timeSlotId || currentBookings === undefined) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Time Slot ID and current bookings are required",
        });
      }

      const UPDATE_TIME_SLOT_BOOKINGS_MUTATION = `
        mutation UpdateTimeSlotBookings($timeSlotId: String!, $currentBookings: Int!) @auth(level: USER) {
          timeSlot_update(key: { id: $timeSlotId }, data: { currentBookings: $currentBookings, updatedAt_expr: "request.time" }) {
            id
            slotDate
            startTime
            endTime
            maxCapacity
            currentBookings
            available
            staffId
            notes
            updatedAt
          }
        }
      `;

      const variables = {
        timeSlotId,
        currentBookings,
      };

      console.log("Executing GraphQL mutation:", UPDATE_TIME_SLOT_BOOKINGS_MUTATION, "with variables:", variables);

      const response = await dataConnect.executeGraphql(UPDATE_TIME_SLOT_BOOKINGS_MUTATION, {
        variables,
      });

      const timeSlot = response.data?.timeSlot_update;

      if (!timeSlot) {
        throw new Error("Failed to update time slot bookings");
      }

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Time slot bookings updated successfully",
        data: timeSlot,
      });
    } catch (error) {
      console.error("Error updating time slot bookings:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to update time slot bookings",
        error: error.message,
      });
    }
  }
}

module.exports = UpdateTimeSlots;