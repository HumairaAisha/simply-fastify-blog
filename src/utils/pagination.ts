type PaginationParams = {
  page?: number | string;
  perPage?: number | string;
};

type PaginationResult = {
  skip: number;
  take: number;
  page: number;
  perPage: number;
};

export function getPagination({
  page = 1,
  perPage = 10,
}: PaginationParams): PaginationResult {
  // Convert to numbers
  let pageNum = typeof page === "string" ? parseInt(page, 10) : page;
  let perPageNum =
    typeof perPage === "string" ? parseInt(perPage, 10) : perPage;

  // Validate and fallback
  if (isNaN(pageNum) || pageNum < 1) pageNum = 1;
  if (isNaN(perPageNum) || perPageNum < 1) perPageNum = 10;

  const skip = (pageNum - 1) * perPageNum;
  const take = perPageNum;

  return { skip, take, page: pageNum, perPage: perPageNum };
}
