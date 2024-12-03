export const api = "http://127.0.0.1:8000"

export const getData = async (url, token) => {
    try {
      const response = await fetch(url, {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json()
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return {error: error};
    }
  };