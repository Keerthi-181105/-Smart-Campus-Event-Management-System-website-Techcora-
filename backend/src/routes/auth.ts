import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { requireAuth } from "../middleware/auth";
import crypto from "crypto";
import { sendMail } from "../lib/mailer";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  // eslint-disable-next-line no-console
  console.log("[auth] login", { email });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  // eslint-disable-next-line no-console
  console.log("[auth] login: ok", { id: user.id, role: user.role });
  res.json({
    token,
    role: user.role,
    message: "Login successful",
  });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, role: true },
  });

  res.json(user);
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body as { email: string };
  if (!email) return res.status(400).json({ message: "Email required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.json({ message: "If that email exists, a reset link was sent" });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
  // Note: Types will align after running Prisma migrate/generate
  await prisma.user.update({ where: { id: user.id }, data: { resetToken: token, resetTokenExpires: expires } as any });

  const appUrl = process.env.APP_URL || "http://localhost:5173";
  const link = `${appUrl}/reset-password?token=${token}`;
  await sendMail(email, "Reset your password", `<p>Click to reset: <a href="${link}">${link}</a></p>`);
  // eslint-disable-next-line no-console
  console.log("[auth] forgot-password sent", { email });
  res.json({ message: "If that email exists, a reset link was sent" });
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body as { token: string; password: string };
  if (!token || !password) return res.status(400).json({ message: "Missing fields" });

  // Note: Types will align after running Prisma migrate/generate
  const user = await prisma.user.findFirst({ where: { resetToken: token, resetTokenExpires: { gt: new Date() } } as any });
  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  const hash = await bcrypt.hash(password, 10);
  // Note: Types will align after running Prisma migrate/generate
  await prisma.user.update({ where: { id: user.id }, data: { password: hash, resetToken: null, resetTokenExpires: null } as any });
  // eslint-disable-next-line no-console
  console.log("[auth] reset-password ok", { id: user.id });
  res.json({ message: "Password updated" });
});

export default router;
