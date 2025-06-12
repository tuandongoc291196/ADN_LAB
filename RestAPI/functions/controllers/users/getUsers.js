const { dataConnect } = require("../../config/firebase.js");

const getAllUsers = async (req, res) => {
  try {
    const variables = {
      "limit": 20,
      "offset": 0,
    };

    // GraphQL query as a single-line string
    const GET_USERS_QUERY = "query GetUsers($limit: Int, $offset: Int) @auth(level: USER) { users(limit: $limit, offset: $offset, orderBy: { createdAt: DESC }) { id fullname email accountStatus role { id name } createdAt lastLogin } }";
    console.log("Executing GraphQL query:", GET_USERS_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_USERS_QUERY, {
      variables: variables,
    });

    const users = response.data?.users || [];

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Users retrieved successfully",
      data: users,
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

module.exports = {
  getAllUsers,
};