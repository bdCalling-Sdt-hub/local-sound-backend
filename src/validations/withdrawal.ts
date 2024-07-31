import type { Request } from "express";

export function createWithdrawalValidation(request:Request):{
    amount: number;
    accountNo: string;
    accountType: string;
    bankName: string;
}{
    const body = request.body;

    if (!body.amount || typeof body.amount !== "number") {
        throw new Error("Amount is required and must be a number");
    }

    if (!body.accountNo || typeof body.accountNo !== "string") {
        throw new Error("Account number is required and must be a string");
    }

    if (!body.accountType || typeof body.accountType !== "string") {
        throw new Error("Account type is required and must be a string");
    }

    if (!body.bankName || typeof body.bankName !== "string") {
        throw new Error("Bank name is required and must be a string");
    }

    return {
        amount: body.amount,
        accountNo: body.accountNo,
        accountType: body.accountType,
        bankName: body.bankName,
    };
}