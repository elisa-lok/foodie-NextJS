import axios from 'axios';

export const checkUserLogin = async (token) => {
  try {
    const response = await axios.get("/api/auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response; 
  } catch (error) {
    console.error("Error checking user login:", error);
    throw error;
  }
};