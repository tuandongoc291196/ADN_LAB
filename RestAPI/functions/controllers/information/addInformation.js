const { dataConnect } = require("../../config/firebase.js");

const addInformation = async(bookingId, name, identification, address, phone, email) => {
    try {
        if (!bookingId) {
            throw new Error("bookingId is required");
        }

        if (!name) {
            throw new Error("name is required");
        }

        if (!identification) {
            throw new Error("identification is required");
        }

        if (!address) {
            throw new Error("address is required");
        }

        if (!phone) {
            throw new Error("phone is required");
        }

        const CREATE_INFORMATION_MUTATION = `
            mutation CreateInformation($id: String!, $bookingId: String!, $name: String!, $identification: String!, $address: String!, $phone: String!, $email: String) @auth(level: USER) {
                information_insert(data: {id: $id, bookingId: $bookingId, name: $name, identification: $identification, address: $address, phone: $phone, email: $email})
            }
        `;

        const variables = {
            id: `${bookingId}_INFORMATION_${Date.now()}`,
            bookingId,
            name,
            identification,
            address,
            phone,
            email: email || null
        }
        console.log("Adding information with variables:", variables);
        const response = await dataConnect.executeGraphql(CREATE_INFORMATION_MUTATION, {
            variables: variables
        });

        const responseData = response.data.information_insert;
        if (!responseData) {
            throw new Error("Failed to add information");
        }
        console.log("Information added successfully:", responseData);
        return responseData;    
    } catch (error) {
        console.error("Error in addInformation:", error);
        throw new Error("Failed to add information due to an internal error");
    } 
}

module.exports = { 
    addInformation 
};