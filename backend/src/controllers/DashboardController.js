import { asyncHandler } from "../utils/errors.js";

export function createDashboardController({ dashboardService }) {
  return {
    summary: asyncHandler(async (request, response) => {
      const summary = await dashboardService.getMonthlySummary(
        request.user.sub,
        request.query.month,
      );
      response.status(200).json(summary);
    }),
  };
}
