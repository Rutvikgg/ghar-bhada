import dbConnect from "@/lib/dbConnect";
import Tenant from "@/models/Tenant";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = await params;

  try {
    const tenant = await Tenant.findById(id);
    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "Tenant not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: tenant }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred.",
      },
      { status: 400 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = await params;

  try {
    const updatedData = await req.json();
    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "Tenant not found." },
        { status: 404 }
      );
    }

    // Push the current state to the history array
    tenant.history.push({
      name: tenant.name,
      mobile_number: tenant.mobile_number,
      rent_amount: tenant.rent_amount,
    });

    // Update the main fields with the new data
    Object.assign(tenant, updatedData);

    await tenant.save();

    return NextResponse.json({ success: true, data: tenant }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred.",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = await params;

  try {
    const deletedTenant = await Tenant.findByIdAndDelete(id);

    if (!deletedTenant) {
      return NextResponse.json(
        { success: false, error: "Tenant not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred.",
      },
      { status: 400 }
    );
  }
}
