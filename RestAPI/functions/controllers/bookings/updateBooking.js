const { dataConnect } = require("../../config/firebase.js");
const {getActiveStaffWithLowestSlotCountExcluding} = require("../users/userUtils.js");
const { checkBookingExists, checkUserBookingExists, checkStaffBookingExists } = require("./bookingUtils.js");
const { addTimeSlot } = require("../timeSlots/addTimeSlot.js");
const { isTimeFormatValid } = require("../timeSlots/timeSlotUtils.js");
const { addBookingHistory } = require("../bookingHistory/addBookingHistory.js");
const { getOneBookingById } = require("./getBookings.js");
const { updateStaffSlotCount } = require("../users/updateUser.js");
const { updateTimeSlot } = require("../timeSlots/updateTimeSlot.js");

const updateBookingTime = async (req, res) => {
    try {
        const {bookingId, slotDate, startTime, endTime} = req.body;

        if(!bookingId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "bookingId is required"
            });
        }

        if (!slotDate) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "slotDate is required"
            });
        }

        if (!startTime) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "startTime is required"
            });
        }

        if (!endTime) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "endTime is required"
            });
        }

        if (!isTimeFormatValid(startTime, endTime)) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Invalid time format. Time must be in HH:MM format (00:00 - 23:59) and endTime must be later than startTime",
            });
        }

        if (!await checkBookingExists(bookingId)) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Booking not found"
            });
        }

        const existingBooking = await getOneBookingById(bookingId);
        const latestStatus = existingBooking.bookingHistories_on_booking[0].status;
        
        if (latestStatus !== "BOOKED" && latestStatus !== "PENDING_PAYMENT") {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Booking cannot be updated. Current status: " + latestStatus + ". Only bookings with BOOKED or PENDING_PAYMENT status can be updated."
            });
        }

        const updateTimeSlotResponse = await addTimeSlot(slotDate, startTime, endTime);
        const newTimeSlotId = `${slotDate}_${startTime}_${endTime}`;
        const userId = existingBooking.userId;
        const oldStaffId = existingBooking.staffId;
        const oldTimeSlotId = existingBooking.timeSlotId;
        let staffId = oldStaffId;

        if (await checkUserBookingExists(userId, newTimeSlotId)) {
            return res.status(409).json({
                statusCode: 409,
                status: "error",
                message: "User already has a booking for this time slot",
            });
        }

        if (await checkStaffBookingExists(oldStaffId, newTimeSlotId)) {
            console.log("Staff already has a booking for this time slot, finding another staff member");
            staffId = await getActiveStaffWithLowestSlotCountExcluding("1", oldStaffId);
        } else {
            console.log("Staff does not have a booking for this time slot, using existing staff");
        }

        const UPDATE_BOOKING_MUTATION = `
            mutation UpdateBooking($bookingId: String!, $timeSlotId: String!, $staffId: String!) @auth(level: USER) {
                booking_update(id: $bookingId, data: {timeSlotId: $timeSlotId, staffId: $staffId, updatedAt_expr: "request.time"})
            }
        `;

        const variables = {
            bookingId,
            timeSlotId: newTimeSlotId,
            staffId: staffId
        };

        const updateResponse = await dataConnect.executeGraphql(UPDATE_BOOKING_MUTATION, {
            variables: variables,
        });

        const updateBookingHistory = await addBookingHistory(bookingId, "UPDATED", "Booking time updated successfully");
        const updateOldTimeSlotResponse = await updateTimeSlot(oldTimeSlotId, "decrease");
        
        let updateOldStaffResponse = null;
        let updateNewStaffResponse = null;
        
        if (oldStaffId !== staffId) {
            updateOldStaffResponse = await updateStaffSlotCount(oldStaffId, "decrease");
            updateNewStaffResponse = await updateStaffSlotCount(staffId, "increase");
        }

        console.log({
            updateTimeSlotResponse,
            updateResponse: updateResponse.data,
            updateBookingHistory,
            updateOldTimeSlotResponse,
            updateOldStaffResponse,
            updateNewStaffResponse,
            oldStaffId,
            newStaffId: staffId,
            oldTimeSlotId,
            newTimeSlotId,
            staffReassigned: oldStaffId !== staffId
        });

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Booking time updated successfully",
            data: updateResponse.data,
        });


    } catch (error) {
        console.error("Error updating booking time:", error);
        
        if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
            return res.status(409).json({
                statusCode: 409,
                status: "error",
                message: "Booking with this time slot already exists",
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
            message: "Failed to update booking time",
            error: error.message,
        });
    }
}

module.exports = {
    updateBookingTime
};

