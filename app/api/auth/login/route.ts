import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  // In a real app, you would validate the credentials against a database
  if (email === "user@example.com" && password === "password") {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" })
    return NextResponse.json({ token })
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}

