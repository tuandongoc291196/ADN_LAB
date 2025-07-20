const {dataConnect} = require("../../config/firebase.js");
const {checkBookingExists} = require("../bookings/bookingUtils.js");
const {checkServiceExists} = require("../services/serviceUtils.js");

const getBookingFeedback = async (req, res) => {
    try {
        const {bookingId} = req.body;

        if (!bookingId) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                error: "bookingId is required"
            });
        }

        if (!(await checkBookingExists(bookingId))) {
            return res.status(404).json({
                statusCode: 400,
                success: false,
                error: "Booking not found"
            });
        }

        const variables = {bookingId};
        const GET_BOOKING_FEEDBACK_QUERY = `
            query GetBookingFeedback($bookingId: String!) @auth(level: USER) {
                feedbacks(where: {bookingId: {eq: $bookingId}}) {
                    id
                    rating
                    comment
                    createdAt
                    booking {
                      user {
                        id
                        fullname
                      }
                      staff {
                        id
                        user {
                          fullname
                        }
                      }
                      service {
                        title
                        category {
                            id
                            name
                        }
                      }
                    }
                }
            }
        `;

        console.log("Getting feedback for booking ID:", bookingId);
        const response = await dataConnect.executeGraphql(GET_BOOKING_FEEDBACK_QUERY, {
            variables: variables,
        });
        const responseData = response.data.feedbacks || [];

        return res.status(200).json({
            success: true,
            data: responseData,
            message: "Feedback retrieved successfully"
        });
    } catch (error) {
        console.error("Error in getBookingFeedback:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to retrieve feedback"
        });
    }
}

const getAllFeedback = async (req, res) => {
    try {
        const GET_ALL_FEEDBACK_QUERY = `
            query GetAllFeedback @auth(level: USER) {
                feedbacks(orderBy: {createdAt: DESC}) {
                    id
                    booking {
                        user {
                            fullname
                        }
                    }
                    rating
                    comment
                    createdAt
                }
            }
        `;

        console.log("Getting all feedback");
        const response = await dataConnect.executeGraphql(GET_ALL_FEEDBACK_QUERY);
        const responseData = response.data.feedbacks || [];

        return res.status(200).json({
            success: true,
            data: responseData,
            message: "All feedback retrieved successfully"
        });
    } catch (error) {
        console.error("Error in getAllFeedback:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to retrieve all feedback"
        });
    }
}

const getServiceFeedback = async (req, res) => {
    try {
        const {serviceId} = req.body;

        if (!serviceId) {
            return res.status(400).json({
                success: false,
                error: "serviceId is required"
            });
        }

        if (!(await checkServiceExists(serviceId))) {
            return res.status(404).json({
                statusCode: 400,
                success: false,
                error: "Service not found"
            });
        }

        const variables = {serviceId};
        const GET_SERVICE_FEEDBACK_QUERY = `
            query GetServiceFeedback($serviceId: String!) @auth(level: USER) {
                feedbacks(where: {booking: {serviceId: {eq: $serviceId}}}, orderBy: {createdAt: DESC}) {
                    id
                    rating
                    comment
                    createdAt
                    booking {
                        user {
                            id
                            fullname
                        }
                        staff {
                            id
                            user {
                                fullname
                            }
                        }
                        service {
                            title
                            category {
                                id
                                name
                            }
                        }
                    }
                }
            }
        `;

        console.log("Getting feedback for service ID:", serviceId);
        const response = await dataConnect.executeGraphql(GET_SERVICE_FEEDBACK_QUERY, {
            variables: variables,
        });
        const responseData = response.data.feedbacks || [];

        return res.status(200).json({
            success: true,
            data: responseData,
            message: "Service feedback retrieved successfully"
        });
    } catch (error) {
        console.error("Error in getServiceFeedback:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to retrieve service feedback"
        });
    }
}

module.exports = {
    getAllFeedback,
    getBookingFeedback,
    getServiceFeedback
};