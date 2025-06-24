const { dataConnect } = require("../../config/firebase.js");
const { checkBookingExists } = require("./bookingUtils.js");
const { v4: uuidv4 } = require('uuid');

// ================== UTILITY FUNCTIONS ==================

const checkParticipantExists = async (participantId) => {
  try {
    const CHECK_PARTICIPANT_EXISTS_QUERY = `
      query GetParticipantById($participantId: String!) @auth(level: USER) {
        participant(key: { id: $participantId }) {
          id
          bookingId
          name
          age
          identification
          gender
          relationship
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      participantId: participantId 
    };
    
    const response = await dataConnect.executeGraphql(CHECK_PARTICIPANT_EXISTS_QUERY, { 
      variables: variables 
    });
    
    const responseData = response.data.participant;
    if (!responseData) {
      console.log(`Participant with ID ${participantId} does not exist`);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error checking participant existence:", error);
    throw error;
  }
};

const validateParticipantData = (participantData) => {
  const { name, age, gender, bookingId } = participantData;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { isValid: false, message: "Name is required and must be a non-empty string" };
  }
  
  if (!age || typeof age !== 'number' || age < 0 || age > 150) {
    return { isValid: false, message: "Age is required and must be a number between 0 and 150" };
  }
  
  if (!gender || typeof gender !== 'string' || !['male', 'female', 'other'].includes(gender.toLowerCase())) {
    return { isValid: false, message: "Gender is required and must be 'male', 'female', or 'other'" };
  }
  
  if (!bookingId || typeof bookingId !== 'string' || bookingId.trim().length === 0) {
    return { isValid: false, message: "BookingId is required and must be a non-empty string" };
  }
  
  return { isValid: true };
};

const getParticipantsByBookingId = async (bookingId) => {
  try {
    const GET_PARTICIPANTS_BY_BOOKING_QUERY = `
      query GetParticipantsByBooking($bookingId: String!) @auth(level: USER) {
        participants(where: { bookingId: { eq: $bookingId } }) {
          id
          bookingId
          name
          age
          identification
          gender
          relationship
          createdAt
          updatedAt
          booking {
            id
            service {
              title
            }
          }
        }
      }
    `;

    const variables = { bookingId };
    
    const response = await dataConnect.executeGraphql(GET_PARTICIPANTS_BY_BOOKING_QUERY, { 
      variables 
    });
    
    return response.data.participants || [];
  } catch (error) {
    console.error("Error getting participants by booking ID:", error);
    throw error;
  }
};

// ================== API ENDPOINTS ==================

const addParticipant = async (req, res) => {
  try {
    const {
      bookingId,
      name,
      age,
      identification,
      gender,
      relationship
    } = req.body;

    // Validate required fields
    const validation = validateParticipantData({ name, age, gender, bookingId });
    if (!validation.isValid) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: validation.message,
      });
    }

    // Check if booking exists
    if (!(await checkBookingExists(bookingId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Booking not found",
      });
    }

    const participantId = uuidv4();

    // Check if participant already exists
    if (await checkParticipantExists(participantId)) {
      return res.status(409).json({
        statusCode: 409,
        status: "error",
        message: "Participant with this ID already exists",
      });
    }

    const CREATE_PARTICIPANT_MUTATION = `
      mutation CreateParticipant($id: String!, $bookingId: String!, $name: String!, $age: Int!, $identification: String, $gender: String!, $relationship: String) @auth(level: USER) {
        participant_insert(data: {
          id: $id, 
          bookingId: $bookingId, 
          name: $name, 
          age: $age, 
          identification: $identification, 
          gender: $gender, 
          relationship: $relationship
        })
      }
    `;

    const variables = {
      id: participantId,
      bookingId,
      name,
      age,
      identification: identification || null,
      gender,
      relationship: relationship || null
    };

    const response = await dataConnect.executeGraphql(CREATE_PARTICIPANT_MUTATION, {
      variables,
    });

    return res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Participant added successfully",
      data: {
        participantId,
        ...variables
      },
    });

  } catch (error) {
    console.error("Error adding participant:", error);
    
    if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
      return res.status(409).json({
        statusCode: 409,
        status: "error",
        message: "Participant with this ID already exists",
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

    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to add participant",
      error: error.message,
    });
  }
};

const getParticipantsByBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "bookingId is required",
      });
    }

    const participants = await getParticipantsByBookingId(bookingId);

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Participants retrieved successfully",
      data: participants,
      count: participants.length,
    });

  } catch (error) {
    console.error("Error getting participants:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get participants",
      error: error.message,
    });
  }
};

const getOneParticipant = async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "participantId is required",
      });
    }

    const GET_PARTICIPANT_QUERY = `
      query GetParticipant($participantId: String!) @auth(level: USER) {
        participant(key: { id: $participantId }) {
          id
          bookingId
          name
          age
          identification
          gender
          relationship
          createdAt
          updatedAt
          booking {
            id
            service {
              title
              description
            }
            user {
              fullname
              email
            }
          }
        }
      }
    `;

    const variables = { participantId };

    const response = await dataConnect.executeGraphql(GET_PARTICIPANT_QUERY, {
      variables,
    });

    const participant = response.data.participant;

    if (!participant) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Participant not found",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Participant retrieved successfully",
      data: participant,
    });

  } catch (error) {
    console.error("Error getting participant:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get participant",
      error: error.message,
    });
  }
};

const getAllParticipants = async (req, res) => {
  try {
    const GET_ALL_PARTICIPANTS_QUERY = `
      query GetAllParticipants @auth(level: USER) {
        participants {
          id
          bookingId
          name
          age
          identification
          gender
          relationship
          createdAt
          updatedAt
          booking {
            id
            service {
              title
            }
            user {
              fullname
              email
            }
          }
        }
      }
    `;

    const response = await dataConnect.executeGraphql(GET_ALL_PARTICIPANTS_QUERY);
    const participants = response.data.participants || [];

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "All participants retrieved successfully",
      data: participants,
      count: participants.length,
    });

  } catch (error) {
    console.error("Error getting all participants:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get all participants",
      error: error.message,
    });
  }
};

const updateParticipant = async (req, res) => {
  try {
    const {
      participantId,
      name,
      age,
      identification,
      gender,
      relationship
    } = req.body;

    if (!participantId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "participantId is required",
      });
    }

    // Check if participant exists
    if (!(await checkParticipantExists(participantId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Participant not found",
      });
    }

    // Validate fields if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Name must be a non-empty string",
      });
    }

    if (age !== undefined && (typeof age !== 'number' || age < 0 || age > 150)) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Age must be a number between 0 and 150",
      });
    }

    if (gender !== undefined && (!['male', 'female', 'other'].includes(gender.toLowerCase()))) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Gender must be 'male', 'female', or 'other'",
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (age !== undefined) updateData.age = age;
    if (identification !== undefined) updateData.identification = identification;
    if (gender !== undefined) updateData.gender = gender;
    if (relationship !== undefined) updateData.relationship = relationship;

    // Always update the updatedAt timestamp
    updateData.updatedAt = new Date().toISOString();

    if (Object.keys(updateData).length === 1) { // Only updatedAt
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "At least one field must be provided for update",
      });
    }

    const UPDATE_PARTICIPANT_MUTATION = `
      mutation UpdateParticipant($participantId: String!, $data: Participant_Data!) @auth(level: USER) {
        participant_update(key: { id: $participantId }, data: $data)
      }
    `;

    const variables = {
      participantId,
      data: updateData
    };

    const response = await dataConnect.executeGraphql(UPDATE_PARTICIPANT_MUTATION, {
      variables,
    });

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Participant updated successfully",
      data: {
        participantId,
        updatedFields: updateData
      },
    });

  } catch (error) {
    console.error("Error updating participant:", error);
    
    if (error.codePrefix === 'data-connect' && error.errorInfo) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Database operation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to update participant",
      error: error.message,
    });
  }
};

const deleteParticipant = async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "participantId is required",
      });
    }

    // Check if participant exists
    if (!(await checkParticipantExists(participantId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Participant not found",
      });
    }

    // Check if participant has associated samples before deletion
    const CHECK_PARTICIPANT_SAMPLES_QUERY = `
      query CheckParticipantSamples($participantId: String!) @auth(level: USER) {
        samples(where: { participantId: { eq: $participantId } }) {
          id
        }
      }
    `;

    const checkResponse = await dataConnect.executeGraphql(CHECK_PARTICIPANT_SAMPLES_QUERY, {
      variables: { participantId }
    });

    const associatedSamples = checkResponse.data.samples || [];
    
    if (associatedSamples.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Cannot delete participant. There are associated samples that must be removed first.",
        associatedSamples: associatedSamples.length
      });
    }

    const DELETE_PARTICIPANT_MUTATION = `
      mutation DeleteParticipant($participantId: String!) @auth(level: USER) {
        participant_delete(key: { id: $participantId })
      }
    `;

    const variables = { participantId };

    const response = await dataConnect.executeGraphql(DELETE_PARTICIPANT_MUTATION, {
      variables,
    });

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Participant deleted successfully",
      data: {
        participantId,
        deletedAt: new Date().toISOString()
      },
    });

  } catch (error) {
    console.error("Error deleting participant:", error);
    
    if (error.codePrefix === 'data-connect' && error.errorInfo) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Database operation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to delete participant",
      error: error.message,
    });
  }
};

module.exports = {
  // Utility functions
  checkParticipantExists,
  validateParticipantData,
  getParticipantsByBookingId,
  
  // API endpoints
  addParticipant,
  getParticipantsByBooking,
  getOneParticipant,
  getAllParticipants,
  updateParticipant,
  deleteParticipant,
}; 