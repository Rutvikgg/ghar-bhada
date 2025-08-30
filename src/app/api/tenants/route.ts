import dbConnect from "@/lib/dbConnect";
import Tenant from "@/models/Tenant";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const tenants = await Tenant.find({});
    return NextResponse.json({ success: true, data: tenants }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}

interface TenantBody {
  // Define the expected properties for a Tenant
  // Example:
  name: string;
  age: number;
  // Add other fields as per your Tenant schema
}

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string;
}

export async function POST(req: NextRequest): Promise<Response> {
  await dbConnect();

  try {
    const body: TenantBody = await req.json();
    const tenant = await Tenant.create(body);
    return NextResponse.json<SuccessResponse<typeof tenant>>(
      { success: true, data: tenant },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}
