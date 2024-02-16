const express = require("express");
const { authMiddleware } = require("../middleware");
const { AccountModel } = require("../db");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await AccountModel.findOne({
    userId: req.userId,
  });
  res.json({
    balance: account.balance,
  });
});

router.post("/transfer", async (req, res) => {
  const { amount, to } = req.body;
  const account = await AccountModel.findOne({
    userId: req.userid,
  });
  if (account.balance < amount) {
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }
  const toAccount = await Account.findOne({
    userId: to,
  });

  if (!toAccount) {
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  await AccountModel.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  );

  await AccountModel.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  );

  res.json({
    message: "Transfer successful",
  });
});

module.exports = router;
