import { NextResponse } from "next/server";
import { publicKey } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ key: publicKey() });
}