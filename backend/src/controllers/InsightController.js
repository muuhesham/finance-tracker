import { asyncHandler } from "../utils/errors.js";

export function createInsightController({ insightService }) {
  return {
    monthly: asyncHandler(async (request, response) => {
      const insights = await insightService.generateMonthlyInsights(
        request.user.sub,
        request.query.month,
      );
      response.status(200).json(insights);
    }),
  };
}
