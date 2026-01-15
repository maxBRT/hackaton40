import axios from 'axios';

// If axios throws an error, extract the error message from the server 
// Pass the error message to the setError callback
export const handleApiError = (
    error: unknown,
    setError: (msg: string) => void
) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data);
        const serverMessage = error.response?.data?.message;
        const genericMessage = error.message;
        setError(serverMessage || genericMessage);
    } else {
        console.error("Unknown Error:", error);
        setError("An unexpected error occurred");
    }
};