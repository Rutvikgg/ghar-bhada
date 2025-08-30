import dbConnect from "@/lib/dbConnect";
import RentCollection from "@/models/RentCollection";
import Tenant from "@/models/Tenant";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const rentCollections = await RentCollection.find({})
      .populate("tenant")
      .sort({ collection_date: -1 });
    return NextResponse.json(
      { success: true, data: rentCollections },
      { status: 200 }
    );
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
    const { tenant_id, receipt_no, start_date, end_date, collection_date } =
      await req.json();

    // Find the tenant to get the rent amount
    const tenant = await Tenant.findById(tenant_id);
    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "Tenant not found." },
        { status: 404 }
      );
    }

    // Calculate total months. The +1 is for inclusive month count.
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);

    const totalMonths =
      (endDateObj.getFullYear() - startDateObj.getFullYear()) * 12 +
      (endDateObj.getMonth() - startDateObj.getMonth()) +
      1;

    // Calculate total rent
    const totalRent = totalMonths * tenant.rent_amount;

    const newRentRecord = await RentCollection.create({
      tenant: tenant_id,
      receipt_no,
      start_date,
      end_date,
      total_months: totalMonths,
      total_rent: totalRent,
      collection_date, // Added the date of collection
    });

    return NextResponse.json(
      { success: true, data: newRentRecord },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
