export default function paginationBuilder({
  totalData,
  currentPage,
  limit,
}: {
  totalData: number;
  currentPage: number;
  limit: number;
}): {
  totalPage: number;
  currentPage: number;
  prevPage: number | null;
  nextPage: number | null;
  totalData: number;
} {
    const totalPage = Math.ceil(totalData / limit);
    
    const prevPage = currentPage - 1 > 0 ? currentPage - 1 : null;
    const nextPage = currentPage + 1 <= totalPage ? currentPage + 1 : null;
    
    return {
        totalPage,
        currentPage,
        prevPage,
        nextPage,
        totalData,
    };
}
