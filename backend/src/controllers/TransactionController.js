import { asyncHandler } from "../utils/errors.js";

export function createTransactionController({ transactionService }) {
  return {
    listRecent: asyncHandler(async (request, response) => {
      const transactions = await transactionService.listRecent(
        request.user.sub,
      );
      response.status(200).json(transactions);
    }),

    create: asyncHandler(async (request, response) => {
      const transaction = await transactionService.create(
        request.user.sub,
        request.body,
      );
      response.status(201).json(transaction);
    }),

    update: asyncHandler(async (request, response) => {
      const transaction = await transactionService.update(
        request.user.sub,
        request.params.id,
        request.body,
      );
      response.status(200).json(transaction);
    }),

    remove: asyncHandler(async (request, response) => {
      await transactionService.remove(request.user.sub, request.params.id);
      response.status(204).send();
    }),
  };
}
