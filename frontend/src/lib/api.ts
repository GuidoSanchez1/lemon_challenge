import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
    withCredentials: true,
});


export async function loginUser(_: string, { arg }: { arg: { email: string; password: string } }) {
    const response = await api.post('/users/login', arg);
    return response.data;
}

export const logoutUser = async () => {
    const response = await api.post('/users/logout');
    return response.data;
};


export const registerUser = async (url: string, { arg }: { arg: { email: string; password: string } }) => {
    const response = await api.post(url, arg);
    return response.data;
};

export default api;

