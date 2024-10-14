import type { Request, Response, NextFunction } from "express";
import responseBuilder from "../utils/responseBuilder";
import {
  createWithdrawal,
  getWithdrawals,
  countWithdrawals,
  getWithdrawalById,
  updateWithdrawal,
} from "../services/withdrawal";
import {
  createWithdrawalValidation,
  getWithdrawalsValidation,
  updateWithdrawalStatusValidation,
} from "../validations/withdrawal";
import paginationBuilder from "../utils/paginationBuilder";
import { createNotification } from "../services/notification";
import { decrementBalance, updateBalance } from "../services/user";
import { getTransactionsByUser } from "../services/transaction";

export async function createWithdrawalController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { amount, accountNo, accountType, bankName } =
      createWithdrawalValidation(request);

    if (user.balance < amount) {
      return response
        .status(400)
        .json(responseBuilder(false, 400, "Insufficient balance"));
    }

    const withdrawal = await createWithdrawal({
      amount,
      accountNo,
      accountType,
      bankName,
      userId: user.id,
    });

    await decrementBalance(user.id, amount);

    return response.json(
      responseBuilder(true, 200, "Withdrawal created", withdrawal)
    );
  } catch (error) {
    next(error);
  }
}

export async function getWithdrawalsController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const { limit, page } = getWithdrawalsValidation(request);

    const totalWithdrawals = await countWithdrawals(
      user.type === "ADMIN" ? undefined : user.id
    );

    const pagination = paginationBuilder({
      currentPage: page,
      limit,
      totalData: totalWithdrawals,
    });

    if (page > pagination.totalPage) {
      return response
        .status(404)
        .json(responseBuilder(false, 404, "Page not found"));
    }

    const skip = (page - 1) * limit;

    const withdrawals = await getWithdrawals(
      limit,
      skip,
      user.type === "ADMIN" ? undefined : user.id
    );

    return response.json(
      responseBuilder(true, 200, "Withdrawals retrieved", withdrawals)
    );
  } catch (error) {
    next(error);
  }
}

export async function updateWithdrawalStatusController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { withdrawalId, status } = updateWithdrawalStatusValidation(request);

    const withdrawal = await getWithdrawalById(withdrawalId);

    if (!withdrawal) {
      return response
        .status(400)
        .json(responseBuilder(false, 400, "Withdrawal not found"));
    }

    if (withdrawal.status !== "PENDING") {
      return response
        .status(400)
        .json(responseBuilder(false, 400, "Withdrawal already processed"));
    }

    const newWithdrawal = await updateWithdrawal(withdrawalId, status);

    if (newWithdrawal.status === "REJECTED")
      await updateBalance({
        userId: withdrawal.userId,
        amount: withdrawal.amount,
      });

    await createNotification({
      userId: withdrawal.userId,
      message: `Your withdrawal of ${withdrawal.amount} has been ${newWithdrawal.status}`,
    });

    return response.json(
      responseBuilder(true, 200, "Withdrawal status updated")
    );
  } catch (error) {
    next(error);
  }
}

export async function getBalanceController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = request.user;

    const lastMountEarning = await getTransactionsByUser({ userId: user.id });

    return response.json(
      responseBuilder(true, 200, "User balance retrieved", {
        balance: user.balance,
        lastMountEarning: lastMountEarning._sum.amount || 0,
      })
    );
  } catch (error) {
    next(error);
  }
}
