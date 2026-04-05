import connectMongo from "@/dbConnect/connectMongo";
import Plan from "@/models/plan";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
    try {
        const { slug } = await params;

        await connectMongo();

        const plan = await Plan.findOne({ slug: slug }).lean();

        if (!plan) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Plan not found.",
                },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: JSON.parse(JSON.stringify(plan)),
        });
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                error: err.message || "Failed to fetch plan. Please try again later.",
            },
            { status: 500 },
        );
    }
}
