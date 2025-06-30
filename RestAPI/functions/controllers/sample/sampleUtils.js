const { dataConnect } = require("../../config/firebase.js");

const checkSampleExists = async (sampleId) => {
    try {
        if (!sampleId) {
            throw new Error("sampleId is required");
        }

        const CHECK_SAMPLE = `
            query GetSampleById($sampleId: String!) @auth(level: USER) {
                sample(key: {id: $sampleId}) {
                    id
                    booking {
                    id
                    user {
                        fullname
                        email
                    }
                    service {
                        title
                        description
                        category {
                        name
                        }
                    }
                    method {
                        name
                    }
                    }
                    staff {
                    user {
                        fullname
                    }
                    }
                    participant {
                    name
                    age
                    gender
                    identification
                    relationship
                    }
                    collectionDate
                    sampleQuality
                    sampleConcentration
                    notes
                    createdAt
                    updatedAt
                }
            }
        `;

        const variables = { 
            sampleId: sampleId 
        };

        const response = await dataConnect.executeGraphql(CHECK_SAMPLE, { 
            variables: variables
        });

        const responseData = response.data.sample;
        if (!responseData) {
            return false
        } else return true;
    } catch (error) {
        console.error("Error checking sample existence:", error);
        throw new Error(`Failed to check sample existence: ${error.message}`);
    }
}

module.exports = {
    checkSampleExists
};