import { asyncHandler } from "../utils/asyncHandler.js";
import sendResponse from "../utils/response.js";

export function createTransactionController({ transactionService }) {
  return {
    listRecent: asyncHandler(async (request, response) => {
      const transactions = await transactionService.listRecent(request.user.sub);
      return sendResponse(response, transactions, 200);
    }),

    create: asyncHandler(async (request, response) => {
      const transaction = await transactionService.create(request.user.sub, request.body);
      return sendResponse(response, transaction, 201);
    }),

    update: asyncHandler(async (request, response) => {
      const transaction = await transactionService.update(request.user.sub, request.params.id, request.body);
      return sendResponse(response, transaction, 200);
    }),

    remove: asyncHandler(async (request, response) => {
      await transactionService.remove(request.user.sub, request.params.id);
      return sendResponse(response, null, 204);
    }),
  };
}
