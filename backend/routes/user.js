const express = require("express");
const { UserModel } = require("../db");
const zod = require("zod");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware");

const signUpBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signUpBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect input",
    });
  }
  const existingUser = await UserModel.findOne({
    username: req.body.username,
  });
  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken / Incorrect input",
    });
  }
  // console.log("Hello");
  const user = await UserModel.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const userId = user._id;

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});

router.get("/signup", async (req, res) => {
  res.json({
    message: "Hello World",
  });
});

const signInBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", (req, res) => {
  const { success } = signInBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while logging in",
    });
  }
  const registeredUser = UserModel.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (!registeredUser) {
    res.status(411).json({
      message: "Error while logging in",
    });
  }
  const userId = registeredUser._id;
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );
  res.status(200).json({
    token,
  });
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }
  await UserModel.findByIdAndUpdate(req.userId, req.body);
  res.json({
    message: "Updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  if (!req.query) {
    const users = await UserModel.find({});
    return res.json({
      users,
    });
  } else {
    const { filter } = req.query;

    const users = await UserModel.find({
      $or: [
        {
          firstName: filter,
        },
        {
          lastName: filter,
        },
      ],
    });
    res.json({
      users: users.map((user) => {
        return {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id,
        };
      }),
    });
  }
});

module.exports = router;
