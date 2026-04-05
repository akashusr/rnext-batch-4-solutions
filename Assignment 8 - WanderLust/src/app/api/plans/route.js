import connectMongo from "@/dbConnect/connectMongo";
import Plan from "@/models/plan";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const count = parseInt(searchParams.get("count")) || 10;

        await connectMongo();

        const plans = await Plan.find().limit(count).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            data: JSON.parse(JSON.stringify(plans)),
        });
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                error: err.message || "Failed to fetch plans. Please try again later.",
            },
            { status: 500 },
        );
    }
}
