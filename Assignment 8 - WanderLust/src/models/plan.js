import { mongoose } from "mongoose";

const planSchema = new mongoose.Schema(
    {
        days: {
            type: String,
            required: true,
        },
        prompt: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        backgroundImage: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        destination_highlights_description: {
            type: String,
            required: true,
        },
        highlights_places: [
            {
                place: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: String,
                    required: true,
                },
            },
        ],
        gastronomy: {
            type: String,
            required: true,
        },
        smart_travel: {
            type: String,
            required: true,
        },
        budget_estimate: {
            type: String,
            required: true,
        },
        travel_plan: [
            {
                day: {
                    type: String,
                    required: true,
                },
                place: {
                    type: String,
                    required: true,
                },
                time_budget: [
                    {
                        date: {
                            type: String,
                            required: true,
                        },
                        activity: {
                            type: String,
                            required: true,
                        },
                        note: {
                            type: String,
                        },
                    },
                ],
                place_image: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);

const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema);

export default Plan;
