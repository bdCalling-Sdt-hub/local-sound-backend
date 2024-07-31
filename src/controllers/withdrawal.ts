import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import { createWithdrawal } from "../services/withdrawal";
import { createWithdrawalValidation } from "../validations/withdrawal";

export async function createWithdrawalController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { amount, accountNo, accountType, bankName } =
      createWithdrawalValidation(request);

    //alliable amount validation

    const withdrawal = await createWithdrawal({
      amount,
      accountNo,
      accountType,
      bankName,
      userId: user.id,
    });

    return response.json(
      responseBuilder(true, 200, "Withdrawal created", withdrawal)
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
}
