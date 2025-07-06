const { dataConnect } = require("../../config/firebase.js");

const checkBlogExists = async (blogId) => {
  try {
    if (!blogId) {
      throw new Error("blogId is required");
    }

    const GET_BLOG_BY_ID_QUERY = `
      query GetBlogById($blogId: String!) @auth(level: USER) {
        blog(key: {id: $blogId}) {
          id
          user {
            id
            fullname
            avatar
            role {
              name
            }
          }
          title
          content
          imageUrl
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      blogId: blogId
    };
    console.log("Executing GraphQL query:", GET_BLOG_BY_ID_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_BLOG_BY_ID_QUERY, { 
      variables: variables 
    });
    
    response.data = response.data.blog;
    if (!response.data) {
      console.log(`Blog with ID ${blogId} does not exist`);
      return false;
    } else return true;
  } catch (error) {
    console.error("Error checking blog existence:", error);
    throw error;
  }
};

module.exports = {
  checkBlogExists,
};