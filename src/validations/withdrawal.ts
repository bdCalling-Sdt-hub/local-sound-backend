import type { Request } from "express";
import error from "../utils/error";

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
