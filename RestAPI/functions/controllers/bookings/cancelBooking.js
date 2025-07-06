const {checkBookingExists} = require("./bookingUtils.js");
const {getOneBookingById} = require("./getBookings.js");
const {addBookingHistory} = require("../bookingHistory/addBookingHistory.js");
const {refundPaymentByBookingId} = require("../payments/refundPayment.js");
const {checkStaffExists} = require("../users/userUtils.js");
const { updateStaffSlotCount } = require("../users/updateUser.js");
const { updateTimeSlot } = require("../timeSlots/updateTimeSlot.js");

const cancelBookingByUser = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const currentTime = new Date().toISOString();

        if (!bookingId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "bookingId is required",
                data: null
            });
        }

        if (!await checkBookingExists(bookingId)) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Booking not found",
                data: null
            });
        }

        const booking = await getOneBookingById(bookingId);
        const latestStatus = booking.bookingHistories_on_booking[0].status;
        if (latestStatus === "CANCELLED" || latestStatus === "EXPIRED" || latestStatus === "COMPLETED") {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Booking has already been cancelled or completed, cannot cancel again",
                data: null
            });
        } else if (latestStatus === "PENDING" || latestStatus === "PENDING_PAYMENT") {
            await addBookingHistory(bookingId, "CANCELLED", "User cancelled the booking");
            return res.status(200).json({
                statusCode: 200,
                status: "success",
                message: "Booking cancelled successfully",
                data: { bookingId: bookingId }
            });
        } else if (latestStatus === "BOOKED") {
            const timeSlotId = booking.timeSlotId;
            const [slotDate, startTime, endTime] = timeSlotId.split('_');
            
            const appointmentDateTime = new Date(`${slotDate}T${startTime}`);
            const currentDateTime = new Date(currentTime);
            const timeDifference = appointmentDateTime.getTime() - currentDateTime.getTime();
            const hoursUntilAppointment = timeDifference / (1000 * 60 * 60);
            
            if (hoursUntilAppointment < 24) {
                return res.status(400).json({
                    statusCode: 400,
                    status: "error",
                    message: "Cannot cancel booking within 24 hours of appointment time. Please update your booking or contact support for assistance.",
                    data: null
                });
            } else {
                const bookingCreatedAt = new Date(booking.createdAt);
                const timeSinceBooking = currentDateTime.getTime() - bookingCreatedAt.getTime();
                const hoursSinceBooking = timeSinceBooking / (1000 * 60 * 60);
                
                if (hoursSinceBooking > 24) {
                    const refundAmount = booking.totalAmount * 0.5;
                    await updateStaffSlotCount(booking.staffId, "decrease");
                    await updateTimeSlot(booking.timeSlotId, "decrease");
                    await refundPaymentByBookingId(bookingId, refundAmount);
                    await addBookingHistory(bookingId, "CANCELLED", "User cancelled the booking - eligible for 50% refund");
                    return res.status(200).json({
                        statusCode: 200,
                        status: "success",
                        message: "Booking cancelled successfully. 50% refund will be processed within 3-5 business days.",
                        data: {
                            bookingId: bookingId,
                            refundAmount: refundAmount,
                            refundPercentage: 50
                        }
                    });
                } else {
                    const refundAmount = booking.totalAmount;
                    await updateStaffSlotCount(booking.staffId, "decrease");
                    await updateTimeSlot(booking.timeSlotId, "decrease");
                    await refundPaymentByBookingId(bookingId, refundAmount);
                    await addBookingHistory(bookingId, "CANCELLED", "User cancelled the booking - eligible for full refund");
                    return res.status(200).json({
                        statusCode: 200,
                        status: "success",
                        message: "Booking cancelled successfully. Full refund will be processed within 3-5 business days.",
                        data: {
                            bookingId: bookingId,
                            refundAmount: refundAmount,
                            refundPercentage: 100
                        }
                    });
                }
            }
        } else {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Booking is not in a valid state for cancellation. Current status: " + latestStatus,
                data: null
            });
        }
    } catch (error) {
        console.error("Error in cancelBooking:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Failed to cancel booking due to an internal error",
            data: { error: error.message }
        });
    }
};

const cancelBookingByManager = async (req, res) => {
    try {
        const { userId, bookingId } = req.body;

        if (!userId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "userId is required",
                data: null
            });
        }

        if (!bookingId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "bookingId is required",
                data: null
            });
        }

        if (!await checkStaffExists(userId, "2")) {
            return res.status(403).json({
                statusCode: 403,
                status: "error",
                message: "Access denied. Only managers can perform this action",
                data: null
            });
        }

        if (!await checkBookingExists(bookingId)) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Booking not found",
                data: null
            });
        }

        const booking = await getOneBookingById(bookingId);
        const latestStatus = booking.bookingHistories_on_booking[0].status;
        
        if (latestStatus === "CANCELLED" || latestStatus === "EXPIRED" || latestStatus === "COMPLETED") {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Booking has already been cancelled or completed, cannot cancel again",
                data: null
            });
        }

        if (latestStatus === "PENDING" || latestStatus === "PENDING_PAYMENT") {
            await addBookingHistory(bookingId, "CANCELLED", "Manager cancelled the booking");
            return res.status(200).json({
                statusCode: 200,
                status: "success",
                message: "Booking cancelled successfully by manager",
                data: { bookingId: bookingId }
            });
        } else if (latestStatus === "BOOKED") {
            const refundAmount = booking.totalAmount;
            await updateStaffSlotCount(booking.staffId, "decrease");
            await updateTimeSlot(booking.timeSlotId, "decrease");
            await refundPaymentByBookingId(bookingId, refundAmount);
            await addBookingHistory(bookingId, "CANCELLED", "Manager cancelled the booking - full refund processed");
            return res.status(200).json({
                statusCode: 200,
                status: "success",
                message: "Booking cancelled successfully by manager. Full refund processed.",
                data: {
                    bookingId: bookingId,
                    refundAmount: refundAmount,
                    refundPercentage: 100
                }
            });
        } else {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Booking is not in a valid state for cancellation. Current status: " + latestStatus,
                data: null
            });
        }
    } catch (error) {
        console.error("Error in cancelBookingByManager:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Failed to cancel booking due to an internal error",
            data: { error: error.message }
        });
    }
};

module.exports = {
    cancelBookingByUser,
    cancelBookingByManager
};