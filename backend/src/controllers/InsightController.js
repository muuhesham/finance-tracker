import { asyncHandler } from "../utils/asyncHandler.js";
import sendResponse from "../utils/response.js";

export function createInsightController({ insightService }) {
  return {
    monthly: asyncHandler(async (request, response) => {
      const insights = await insightService.generateMonthlyInsights(request.user.sub, request.query.month);
      return sendResponse(response, insights, 200);
    }),
  };
}
