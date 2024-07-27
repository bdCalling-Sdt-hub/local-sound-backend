export interface CustomError extends Error {
  status?: number;
}

export default function error(message: string, status: number) {
  const error: CustomError = new Error(message);
  error.status = status;
  return error;
}
