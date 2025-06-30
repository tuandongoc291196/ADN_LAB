const { dataConnect } = require("../../config/firebase.js");
const {getParticipantsByBookingId} = require("../participants/getParticipants.js");
const {getOneBookingById} = require("../bookings/getBookings.js");

const addSample = async (bookingId) => {
  try {
    if (!bookingId) {
      throw new Error("bookingId is required");
    }

    const participants = await getParticipantsByBookingId(bookingId);
    
    if (!participants || participants.length === 0) {
      throw new Error("No participants found for this booking");
    }

    const booking = await getOneBookingById(bookingId);
    const staffId = booking.staffId;

    const ADD_SAMPLE = `
      mutation CreateSample($id: String!, $bookingId: String!, $staffId: String, $participantId: String, $collectionDate: Date, $sampleQuality: String!, $sampleConcentration: Float, $notes: String) @auth(level: USER) {
        sample_insert(data: {id: $id, bookingId: $bookingId, staffId: $staffId, participantId: $participantId, collectionDate: $collectionDate, sampleQuality: $sampleQuality, sampleConcentration: $sampleConcentration, notes: $notes})
      }
    `;

    const createdSamples = [];
    
    for (const participant of participants) {
      const sampleId = participant.id + "_SAMPLE";
      const variables = { 
        id: sampleId,
        bookingId: bookingId, 
        participantId: participant.id,
        staffId: staffId,
        sampleQuality: "",
        collectionDate: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }),
        sampleConcentration: 0
      };
      
      const response = await dataConnect.executeGraphql(ADD_SAMPLE, { 
        variables: variables
      });
      
      const responseData = response.data.sample_insert;
      
      if (!responseData) {
        throw new Error(`Sample creation failed for participant ${participant.id}`);
      }
      
      createdSamples.push({
        id: sampleId,
        participantId: participant.id,
        bookingId: bookingId,
        success: true
      });
    }
    
    return createdSamples;
  } catch (error) {
    console.error("Error adding samples:", error);
    throw new Error("Failed to add samples due to an internal error");
  }
}

module.exports = {
  addSample
}; 