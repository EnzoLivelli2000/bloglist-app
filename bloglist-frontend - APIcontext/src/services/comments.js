import axios from "axios";
const baseUrl = "/api/blogs";

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async (newObject, id) => {

    if (!id) throw new Error("Blog ID is required to create a comment.");
    
    console.log("token: ", token) 
    console.log("newObject: ", newObject) 
    console.log("id: ", id) 
    const config = {
        headers: { Authorization: token },
      }

    
    try {
        const response = await axios.post(`${baseUrl}/${id}/comments`, newObject, config);
        console.log("response: ", response)
        return response.data;
    } catch (error) {
        console.error("Error creating comment:", error.response?.data || error.message);
        throw error;
    }
};

export default { create ,setToken};
