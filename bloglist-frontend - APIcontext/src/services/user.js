import axios from "axios"
const baseUrl = '/api/users'

const getAll = async () => {
    const request = axios.get(baseUrl)
    const response = await request
    return response.data
}

const getById = async (id) => {
    const request = axios.get(`${baseUrl}/${id}`)
    console.log("id: ", id)
    const response = await request
    return response.data
}

export default { getAll, getById }