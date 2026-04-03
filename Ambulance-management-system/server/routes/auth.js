import { Router } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../db.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.json({ status: "error", message: "Missing required parameters" });
    }

    const hashedPassword = crypto.createHash("md5").update(Password).digest("hex");

    const [rows] = await pool.execute(
      "SELECT access_key FROM user WHERE user_role = ? AND password = ?",
      [Email, hashedPassword]
    );

    if (rows.length > 0) {
      const payload = {
        iss: "localhost",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        sub: Email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: "HS256" });

      return res.json({
        status: "success",
        message: "Login successful",
        access_token: token,
      });
    } else {
      return res.json({ status: "error", message: "Login credentials are incorrect" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.json({ status: "error", message: "Server error" });
  }
});

export default router;
