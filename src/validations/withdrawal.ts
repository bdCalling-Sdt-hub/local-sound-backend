import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createWithdrawalValidation(request: Request): {
  amount: number;
  accountNo: string;
  accountType: string;
  bankName: string;
} {
  const body = request.body;

  if (!body.amount || typeof body.amount !== "number") {
    throw error("Amount is required and must be a number", 400);
  }

  if (body.amount < 1) {
    throw error("Amount must be greater than 0", 400);
  }

  if (!Number.isInteger(body.amount)) {
    throw error("Amount must be an integer", 400);
  }

  if (!body.accountNo || typeof body.accountNo !== "string") {
    throw error("Account number is required and must be a string", 400);
  }

  if (!body.accountType || typeof body.accountType !== "string") {
    throw error("Account type is required and must be a string", 400);
  }

  if (!body.bankName || typeof body.bankName !== "string") {
    throw error("Bank name is required and must be a string", 400);
  }

  return {
    amount: body.amount,
    accountNo: body.accountNo,
    accountType: body.accountType,
    bankName: body.bankName,
  };
}

export function getWithdrawalsValidation(request: Request): {
  limit: number;
  page: number;
} {
  const query = request.query;

  let page = parseInt(query.page as string) || 1;

  if (page < 1) page = 1;

  let limit = parseInt(query.limit as string) || 10;

  if (limit > 100) limit = 100;

  if (limit < 1) limit = 1;

  return {
    limit,
    page,
  };
}

export function updateWithdrawalStatusValidation(request: Request): {
  withdrawalId: string;
  status: "APPROVED" | "REJECTED";
} {
  const body = request.body;
  const withdrawalId = request.params?.id;

  if (!withdrawalId) {
    throw error("Withdrawal ID is required", 400);
  }

  if (!isValidObjectId(withdrawalId)) {
    throw error("Invalid withdrawal ID", 400);
  }

  if (!body.status || typeof body.status !== "string") {
    throw error("Status is required and must be a string", 400);
  }

  if (body.status !== "APPROVED" && body.status !== "REJECTED") {
    throw error("Invalid status", 400);
  }

  return {
    withdrawalId,
    status: body.status,
  };
}
