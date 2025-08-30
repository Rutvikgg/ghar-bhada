import dbConnect from "@/lib/dbConnect";
import Tenant from "@/models/Tenant";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const tenants = await Tenant.find({});
    return NextResponse.json({ success: true, data: tenants }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const tenant = await Tenant.create(body);
    return NextResponse.json({ success: true, data: tenant }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
