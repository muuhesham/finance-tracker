import { asyncHandler } from '../utils/asyncHandler.js';
import sendResponse from '../utils/response.js';

export function createAuthController({ authService }) {
  return {
    register: asyncHandler(async (request, response) => {
      const result = await authService.register(request.body);
      return sendResponse(response, result, 201);
    }),

    login: asyncHandler(async (request, response) => {
      const result = await authService.login(request.body);
      return sendResponse(response, result, 200);
    }),

    profile: asyncHandler(async (request, response) => {
      const result = await authService.getProfile(request.user.sub);
      return sendResponse(response, result, 200);
    })
  };
}
