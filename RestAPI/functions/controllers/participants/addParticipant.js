const { dataConnect } = require("../../config/firebase.js");

const addParticipant = async(bookingId, name, age, identification, gender, relationship) => {
    try {
        if (!bookingId) {
            throw new Error("bookingId is required");
        }

        if (!name) {
            throw new Error("name is required");
        }

        if (!age || isNaN(age) || age < 0) {
            throw new Error("age is required");
        }

        if (!gender) {
            throw new Error("gender is required");
        }

        const CREATE_PARTICIPANT_MUTATION = `
            mutation CreateParticipant($id: String!, $bookingId: String!, $name: String!, $age: Int!, $identification: String, $gender: String!, $relationship: String) @auth(level: USER) {
                participant_insert(data: {id: $id, bookingId: $bookingId, name: $name, age: $age, identification: $identification, gender: $gender, relationship: $relationship})
            }
        `;

        const variables = {
            id: `${bookingId}_${Date.now()}`,
            bookingId,
            name,
            age: parseInt(age, 10),
            identification: identification || null,
            gender,
            relationship: relationship || null
        }
        console.log("Adding participant with variables:", variables);
        const response = await dataConnect.executeGraphql(CREATE_PARTICIPANT_MUTATION, {
            variables: variables
        });

        const responseData = response.data.participant_insert;
        if (!responseData) {
            throw new Error("Failed to add participant");
        }
        console.log("Participant added successfully:", responseData);
        return responseData;    
    } catch (error) {
        console.error("Error in addParticipant:", error);
        throw new Error("Failed to add participant due to an internal error");
    } 
}

module.exports = { 
    addParticipant 
};