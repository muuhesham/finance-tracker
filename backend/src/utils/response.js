export default function sendResponse(response, data, statusCode) {
    return response.status(statusCode).json(data);
};