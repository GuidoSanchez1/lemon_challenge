import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
    withCredentials: true,
});


export async function loginUser(_: string, { arg }: { arg: { email: string; password: string } }) {
    const form = new URLSearchParams();
    console.log('Logging in with:', arg.email, arg.password);
    form.append('username', arg.email);
    form.append('password', arg.password);

    const response = await api.post('/users/login', form, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    console.log('Login response:', response.data);
    return response.data;
}

export const logoutUser = async () => {
    const response = await api.post('/users/logout');
    return response.data;
};

export async function fetchCurrentUser() {
    try {
        const response = await api.get('/users/me', { withCredentials: true });
        return response.data;
    } catch {
        return null;
    }
}


export const registerUser = async (url: string, { arg }: { arg: { email: string; password: string } }) => {
    const response = await api.post(url, arg);
    return response.data;
};

export default api;

