import { asyncHandler } from "../utils/asyncHandler.js";
import sendResponse from "../utils/response.js";

export function createDashboardController({ dashboardService }) {
  return {
    summary: asyncHandler(async (request, response) => {
      const summary = await dashboardService.getMonthlySummary(request.user.sub, request.query.month);
      return sendResponse(response, summary, 200);
    }),
  };
}
