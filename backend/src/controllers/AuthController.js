import { asyncHandler } from '../utils/errors.js';

export function createAuthController({ authService }) {
  return {
    register: asyncHandler(async (request, response) => {
      const result = await authService.register(request.body);
      response.status(201).json(result);
    }),

    login: asyncHandler(async (request, response) => {
      const result = await authService.login(request.body);
      response.status(200).json(result);
    }),

    profile: asyncHandler(async (request, response) => {
      const result = await authService.getProfile(request.user.sub);
      response.status(200).json(result);
    })
  };
}
