const { dataConnect } = require("../../config/firebase.js");

class GetKit {
    async getKitById(req, res) {
      try {
        const { kitId } = req.params;
        
        if (!kitId) {
          return res.status(400).json({
            statusCode: 400,
            status: "error",
            message: "Kit ID is required"
          });
        }
        
        const GET_KIT_BY_ID_QUERY = `
          query GetKitById($kitId: String!) @auth(level: USER) {
            kit(key: {id: $kitId}) {
              id
              status
              amount
              createdAt
            }
          }
        `;
        
        const variables = { kitId };
        const response = await dataConnect.executeGraphql(GET_KIT_BY_ID_QUERY, { variables });
        
        const kit = response.data?.kit;
        
        if (!kit) {
          return res.status(404).json({
            statusCode: 404,
            status: "error",
            message: "Kit not found"
          });
        }
        
        res.status(200).json({
          statusCode: 200,
          status: "success",
          message: "Kit retrieved successfully",
          data: kit
        });
      } catch (error) {
        console.error("Error fetching kit:", error);
        res.status(500).json({
          statusCode: 500,
          status: "error",
          message: "Failed to retrieve kit",
          error: error.message
        });
      }
    }
    
    async getAvailableKits(req, res) {
      try {
        const GET_AVAILABLE_KITS_QUERY = `
          query GetAvailableKits @auth(level: USER) {
            kits(where: {status: {eq: "available"}}) {
              id
              amount
              createdAt
            }
          }
        `;
        
        const response = await dataConnect.executeGraphql(GET_AVAILABLE_KITS_QUERY);
        
        const kits = response.data?.kits || [];
        
        res.status(200).json({
          statusCode: 200,
          status: "success",
          message: "Available kits retrieved successfully",
          data: kits
        });
      } catch (error) {
        console.error("Error fetching available kits:", error);
        res.status(500).json({
          statusCode: 500,
          status: "error",
          message: "Failed to retrieve available kits",
          error: error.message
        });
      }
    }
    
    async getAllKits(req, res) {
      try {
        const GET_KITS_QUERY = `
          query GetKits @auth(level: USER) {
            kits(orderBy: {createdAt: DESC}) {
              id
              status
              amount
              createdAt
            }
          }
        `;
        
        const response = await dataConnect.executeGraphql(GET_KITS_QUERY);
        
        const kits = response.data?.kits || [];
        
        res.status(200).json({
          statusCode: 200,
          status: "success",
          message: "Kits retrieved successfully",
          data: kits
        });
      } catch (error) {
        console.error("Error fetching kits:", error);
        res.status(500).json({
          statusCode: 500,
          status: "error",
          message: "Failed to retrieve kits",
          error: error.message
        });
      }
    }
  }
  
  module.exports = GetKit;