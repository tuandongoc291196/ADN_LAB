const { dataConnect } = require("../../config/firebase.js");

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieves a list of all users with pagination support (requires authentication)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of users to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of users to skip for pagination
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const getAllUsers = async (req, res) => {
  try {
    const variables = {
      "limit": 20,
      "offset": 0
    };
    
    const GET_USERS_QUERY = "query GetUsers($limit: Int, $offset: Int) @auth(level: USER) { users(limit: $limit, offset: $offset, orderBy: { createdAt: DESC }) { id fullname email accountStatus role { id name } createdAt lastLogin } }";
    console.log("Executing GraphQL query:", GET_USERS_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_USERS_QUERY, {
      variables: variables,
    });

    const responseData = response.data || [];

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Users retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Get a specific user
 *     description: Retrieves detailed information about a specific user by ID (requires authentication)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *           example:
 *             userId: "user_12345"
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/UsersResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - User ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const getOneUser = async (req, res) => {
  try {
    const {userId} = req.body;

    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "userId is required",
      });
    }

    const variables = {
      userId: userId,
    };
    
    const GET_ONE_USER = "query GetUserById($userId: String!) @auth(level: USER) { user(key: {id: $userId}) { id fullname gender avatar email accountStatus authProvider phone shippingAddress roleId role { id name description } dailySlotCount maxDailySlots createdAt lastLogin } }";
    console.log("Executing GraphQL query:", GET_ONE_USER);
    const response = await dataConnect.executeGraphql(GET_ONE_USER, {
        variables: variables,});

    const responseData = response.data || [];

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve user",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
};
