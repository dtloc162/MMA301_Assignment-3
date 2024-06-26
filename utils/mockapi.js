import axios from "axios";

// const API_URL = "https://64a59a6e00c3559aa9bff5ab.mockapi.io/api/v1/";

// export const fetchApi = async (category) => {
//   try {
//     const response = await axios.get(`${API_URL}${category}`);
//     return response.data;
//   } catch (error) {
//     console.error("Fetch data failed:", error);
//     throw error;
//   }
// };

const fetchApi = axios.create({
  baseURL: "https://64a59a6e00c3559aa9bff5ab.mockapi.io/api/v1/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
export default fetchApi;
