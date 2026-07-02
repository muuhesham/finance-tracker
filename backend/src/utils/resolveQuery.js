export function resolveQuery(query) {
  return typeof query?.lean === "function" ? query.lean() : query;
}
