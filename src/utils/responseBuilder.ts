export default function responseBuilder(
  ok: boolean,
  statusCode: number,
  message: string,
  data?: Object | Array<any>,
  pagination?: {
    totalPage: number;
    currentPage: number;
    prevPage: number | null;
    nextPage: number | null;
    totalData: number;
  }
) {
  if (!ok) {
    return {
      status: "failed",
      statusCode,
      message,
      data: data || {},
      pagination: pagination || {},
    };
  }

  return {
    status: "success",
    statusCode,
    message,
    data: data || {},
    pagination: pagination || {},
  };
}
