const { dataConnect } = require("../../config/firebase.js");
const { checkBookingExists } = require("../bookings/bookingUtils.js");
const {deleteBookingHistoryByBookingId} = require("../bookingHistory/deleteBookingHistory.js");
const {deleteInformationByBookingId} = require("../information/deleteInformation.js");
const {deleteParticipantsByBookingId} = require("../participants/deleteParticipants.js");

const deleteBookingById = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required"
      });
    }

    if (!await checkBookingExists(bookingId)) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    const DELETE_BOOKING_MUTATION = `
      mutation DeleteBooking($id: String!) @auth(level: USER) {
        booking_delete(id: $id)
      }
    `;

    const variables = {
      id: bookingId
    };

    console.log("Deleting related records first...");
    const responseBookingHistoryDel = await deleteBookingHistoryByBookingId(bookingId);
    const responseParticipantsDel = await deleteParticipantsByBookingId(bookingId);
    const responseInformationDel = await deleteInformationByBookingId(bookingId);

    console.log("Deleting booking with ID:", bookingId);
    const responseBookingDel = await dataConnect.executeGraphql(DELETE_BOOKING_MUTATION, {
      variables: variables
    });

    const responseBookingDelData = responseBookingDel.data.booking_delete;
    if (!responseBookingDelData) {
      throw new Error("Failed to delete booking");
    }

    const responseData = {
        booking: responseBookingDelData,
        bookingHistory: responseBookingHistoryDel,
        information: responseInformationDel,
        participants: responseParticipantsDel
    };
    console.log("Booking deleted successfully:", responseData);
    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      data: responseData
    });

  } catch (error) {
    console.error("Error deleting booking:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  deleteBookingById
};