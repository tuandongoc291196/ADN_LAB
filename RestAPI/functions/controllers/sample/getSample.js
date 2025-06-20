const { dataConnect } = require("../../config/firebase.js");

const getSampleById = async (req, res) => {
    try {
      const { sampleId } = req.params;
      
      if (!sampleId) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Sample ID is required"
        });
      }
      
      const GET_SAMPLE_BY_ID_QUERY = `
        query GetSampleById($sampleId: String!) @auth(level: USER) {
          sample(key: {id: $sampleId}) {
            id
            booking {
              id
              user {
                fullname
                email
              }
            }
            service {
              title
              category
              description
            }
            staff {
              fullname
            }
            collectionDate
            status
            notes
          }
        }
      `;
      
      const variables = { sampleId };
      const response = await dataConnect.executeGraphql(GET_SAMPLE_BY_ID_QUERY, { variables });
      
      const sample = response.data?.sample;
      
      if (!sample) {
        return res.status(404).json({
          statusCode: 404,
          status: "error",
          message: "Sample not found"
        });
      }
      
      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Sample retrieved successfully",
        data: sample
      });
    } catch (error) {
      console.error("Error fetching sample:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve sample",
        error: error.message
      });
    }
  }
  
  const getSamplesByStatus = async (req, res) => {
    try {
      const { status } = req.query;
      
      if (!status) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Status is required"
        });
      }
      
      const GET_SAMPLES_BY_STATUS_QUERY = `
        query GetSamplesByStatus($status: String!) @auth(level: USER) {
          samples(where: {status: {eq: $status}}) {
            id
            booking {
              id
              user {
                fullname
              }
            }
            service {
              title
              category
            }
            staff {
              fullname
            }
            collectionDate
            status
            notes
          }
        }
      `;
      
      const variables = { status };
      const response = await dataConnect.executeGraphql(GET_SAMPLES_BY_STATUS_QUERY, { variables });
      
      const samples = response.data?.samples || [];
      
      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Samples retrieved successfully",
        data: samples
      });
    } catch (error) {
      console.error("Error fetching samples by status:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve samples",
        error: error.message
      });
    }
  }
  
  const getBookingSamples = async (req, res) => {
    try {
      const { bookingId } = req.params;
      
      if (!bookingId) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Booking ID is required"
        });
      }
      
      const GET_BOOKING_SAMPLES_QUERY = `
        query GetBookingSamples($bookingId: String!) @auth(level: USER) {
          samples(where: {bookingId: {eq: $bookingId}}) {
            id
            service {
              title
              category
            }
            staff {
              fullname
            }
            collectionDate
            status
            notes
          }
        }
      `;
      
      const variables = { bookingId };
      const response = await dataConnect.executeGraphql(GET_BOOKING_SAMPLES_QUERY, { variables });
      
      const samples = response.data?.samples || [];
      
      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Booking samples retrieved successfully",
        data: samples
      });
    } catch (error) {
      console.error("Error fetching booking samples:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve booking samples",
        error: error.message
      });
    }
  }
  
  const getStaffSamples = async (req, res) => {
    try {
      const { staffId } = req.params;
      
      if (!staffId) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Staff ID is required"
        });
      }
      
      const GET_STAFF_SAMPLES_QUERY = `
        query GetStaffSamples($staffId: String!) @auth(level: USER) {
          samples(where: {staffId: {eq: $staffId}}) {
            id
            booking {
              user {
                fullname
              }
            }
            service {
              title
              category
            }
            collectionDate
            status
            notes
          }
        }
      `;
      
      const variables = { staffId };
      const response = await dataConnect.executeGraphql(GET_STAFF_SAMPLES_QUERY, { variables });
      
      const samples = response.data?.samples || [];
      
      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Staff samples retrieved successfully",
        data: samples
      });
    } catch (error) {
      console.error("Error fetching staff samples:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve staff samples",
        error: error.message
      });
    }
  }

module.exports = {
  getSampleById,
  getSamplesByStatus,
  getBookingSamples,
  getStaffSamples
};