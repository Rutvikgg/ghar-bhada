import dbConnect from "@/lib/dbConnect";
import RentCollection from "@/models/RentCollection";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const rentCollections = await RentCollection.find({ tenant: id }).populate(
      "tenant"
    );
    if (!rentCollections.length) {
      return NextResponse.json(
        { success: false, error: "No rent collections found for this tenant." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: rentCollections },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a specific rent collection by its ID
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const deletedRentCollection = await RentCollection.findByIdAndDelete(id);

    if (!deletedRentCollection) {
      return NextResponse.json(
        { success: false, error: "Rent collection not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Rent collection deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
