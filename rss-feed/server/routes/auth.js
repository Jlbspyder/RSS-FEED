import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
}

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      ok: false,
      message: "Email, password, first name, and last name are required.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      ok: false,
      message: "Password must be at least 6 characters.",
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: "An account with that email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        // preferences: {
        //   create: {},
        // },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    const token = signToken(user);

    res.status(201).json({
      ok: true,
      message: "ACCOUNT CREATED FROM REAL AUTH FILE 123",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR FULL:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to create account.",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "Email and password are required.",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        ok: false,
        message: "Invalid email or password.",
      });
    }

    const token = signToken(user);

    res.json({
      ok: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to sign in.",
    });
  }
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      message: "Missing or invalid token.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found.",
      });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      message: "Invalid or expired token.",
    });
  }
});

export default router;
