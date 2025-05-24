import api from "./api";

export const loginUser = async (username, password) => {
    try {
        const response = await api.post("/api/v1/token/", { username, password });
        console.debug('Response: ', response.data.access);

        localStorage.setItem("token", JSON.stringify(response.data.access));
        
        return response.data;

    } catch (error) {
        throw new Error("Failed to login user");
    }
};