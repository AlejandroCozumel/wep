import axios from "axios";

export async function loginService(user) {
    try {
        const data = await axios.post(`${process.env.NEXT_PUBLIC_WEP_URL}/login`, user);
        return data
    } catch (error) {
        console.log(error)
    }
}

export async function edgeVerifyToken(token) {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_WEP_URL}/isOpen`, {
            method: "GET",
            headers: {
                "token": token,
            }
        });
        if (!data) {
            return false;
        }
        return true;

    } catch (error) {
        console.log(error)
    }
}