"use server";

import connectMongo from "@/dbConnect/connectMongo";
import geminiAi from "@/dbConnect/geminiAi";
import { pexelsClient } from "@/dbConnect/pexelsClient";
import Plan from "@/models/plan";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const planGeminiJsonSchema = {
    type: "object",
    properties: {
        days: {
            type: "string",
            description: "Total number of days for the trip (numeric string, e.g., '3')",
        },
        prompt: {
            type: "string",
            description: "Original user input prompt",
        },
        destination: {
            type: "string",
            description: "Primary destination (city or country only)",
        },
        title: {
            type: "string",
            description: "Trip title (50–60 characters exactly)",
        },
        slug: {
            type: "string",
            description: "URL-safe slug, lowercase, hyphen-separated, no special characters",
        },
        description: {
            type: "string",
            description: "Trip summary (110–220 characters)",
        },
        backgroundImage: {
            type: "string",
            description: "Scenic image search query for destination",
        },
        destination_highlights_description: {
            type: "string",
            description: "Overview of destination highlights (≤220 characters)",
        },
        highlights_places: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: {
                type: "object",
                properties: {
                    place: {
                        type: "string",
                        description: "Highlight place name",
                    },
                    description: {
                        type: "string",
                        description: "Short highlight description (≤180 characters)",
                    },
                    rating: {
                        type: "string",
                        description: "Rating out of 5 (e.g., '4.6')",
                    },
                },
                required: ["place", "description", "rating"],
            },
        },
        gastronomy: {
            type: "string",
            description: "Local food & cuisine overview (≤180 characters)",
        },
        smart_travel: {
            type: "string",
            description: "Practical travel tips (≤180 characters)",
        },
        budget_estimate: {
            type: "string",
            description: "Budget estimate with currency (≤180 characters)",
        },
        travel_plan: {
            type: "array",
            description: "Day-wise itinerary (must equal number_of_days)",
            items: {
                type: "object",
                properties: {
                    day: {
                        type: "string",
                        description: "Day number (e.g., 'Day 1')",
                    },
                    place: {
                        type: "string",
                        description: "Main area or attraction for the day",
                    },
                    time_budget: {
                        type: "array",
                        minItems: 1,
                        items: {
                            type: "object",
                            properties: {
                                date: {
                                    type: "string",
                                    description: "Time in '09:00 AM' format",
                                },
                                activity: {
                                    type: "string",
                                    description: "Planned activity",
                                },
                                note: {
                                    type: "string",
                                    description: "Optional short tip or alert",
                                },
                            },
                            required: ["date", "activity"],
                        },
                    },
                    place_image: {
                        type: "string",
                        description: "Place name only for image search",
                    },
                },
                required: ["day", "place", "time_budget", "place_image"],
            },
        },
    },
    required: [
        "days",
        "prompt",
        "destination",
        "title",
        "slug",
        "description",
        "backgroundImage",
        "destination_highlights_description",
        "highlights_places",
        "gastronomy",
        "smart_travel",
        "budget_estimate",
        "travel_plan",
    ],
};

export async function createPlan(_, formData) {
    const userPrompt = formData.get("prompt").trim();

    try {
        if (!userPrompt || userPrompt.length === 0) {
            throw new Error("Please provide a valid travel prompt.");
        }

        await checkPrompt(userPrompt); // check is prompt travel related or not

        await connectMongo(); // connect to database

        // find if any existing prompt is similar to user prompt using gemini ai
        await checkSimilarPlan(userPrompt);

        // Construct the prompt for AI create new plan
        const planPrompt = `
YOU ARE A PROFESSIONAL TRAVEL PLANNING ENGINE.
YOU MUST FOLLOW ALL RULES EXACTLY.
DO NOT ADD EXTRA TEXT.
DO NOT VIOLATE CHARACTER LIMITS.

USER REQUEST:
"${userPrompt}"

────────────────────────────────
STEP 1 — EXTRACT REQUIREMENTS
Extract and internally confirm:
- destination (city or country)
- number_of_days (must be numeric)
If number_of_days cannot be determined → STOP AND GUESS BASED ON PROMPT CONTEXT.

────────────────────────────────
STEP 2 — CONTENT GENERATION RULES

CHARACTER LIMITS (ABSOLUTE — DO NOT EXCEED):
- title: 50–60 characters
- description: 110–220 characters
- destination_highlights_description: max 220 characters
- gastronomy: max 180 characters
- smart_travel: max 180 characters
- budget_estimate: max 180 characters
- highlights_places: EXACTLY 3 ITEMS
- highlights_places.description: max 180 characters

STRUCTURE RULES:
- travel_plan.length MUST EQUAL number_of_days
- Each day MUST contain at least 1 time_budget item
- Use short, realistic place names
- Keep tone professional and practical
- Avoid emojis, markdown, or commentary

IMAGE RULES:
- backgroundImage → scenic search query only
- place_image → ONLY place name, nothing else

NOTES RULE:
- Include notes ONLY where truly useful
- Keep notes short (alerts, tips, warnings)
- At least one note must exist across the entire plan

────────────────────────────────
STEP 3 — SELF VALIDATION (MANDATORY)
Before returning JSON, VERIFY:
- All character limits are respected
- travel_plan day count is correct
- highlights_places count is exactly 3
If ANY rule fails → FIX BEFORE OUTPUT.

RETURN ONLY VALID JSON THAT MATCHES THE PROVIDED SCHEMA.
`;

        // Get AI-generated plan
        const planData = await geminiAi(planPrompt, planGeminiJsonSchema);

        // Fetch background image
        try {
            const bgPhotos = await pexelsClient.photos.search({
                query: planData.backgroundImage,
                per_page: 1,
                orientation: "landscape",
            });

            if (bgPhotos.photos && bgPhotos.photos.length > 0) {
                planData.backgroundImage = bgPhotos.photos[0].src.large2x;
            } else {
                planData.backgroundImage = "/placeholder.jpg";
            }
        } catch (error) {
            planData.backgroundImage = "/placeholder.jpg";
        }

        // Fetch all place images in parallel
        const placeImagePromises = planData.travel_plan.map(async (day) => {
            try {
                const photos = await pexelsClient.photos.search({
                    query: day.place_image,
                    per_page: 1,
                    orientation: "landscape",
                });

                if (photos.photos && photos.photos.length > 0) {
                    return photos.photos[0].src.large;
                } else {
                    return "/placeholder.jpg";
                }
            } catch (error) {
                return "/placeholder.jpg";
            }
        });

        const placeImages = await Promise.all(placeImagePromises);

        // Assign place images
        planData.travel_plan.forEach((day, index) => {
            day.place_image = placeImages[index];
        });

        const plan = await Plan.create(planData);

        revalidatePath("/");
        return redirect(`/plan/${plan.slug}`);
    } catch (err) {
        // Don't catch redirect errors - they need to propagate
        if (err.message === "NEXT_REDIRECT") {
            throw err;
        }
        return {
            success: false,
            error: err.message || "Failed to create plan. Please try again.",
        };
    }
}

// check is prompt travel related or not
async function checkPrompt(userPrompt) {
    const isTravelRelatedPrompt = await geminiAi(
        `You are a strict classifier.

Your task:
Determine whether the user prompt is related to **TRAVEL PLANNING**.

Definition of TRAVEL PLANNING (YES):
The prompt involves at least ONE of the following:
- Creating or requesting an itinerary or trip plan
- Trip duration (days, weeks)
- Destinations, cities, countries to visit
- Hotels, flights, transport, visas
- Budget, luxury, family, solo, adventure travel
- Things to do during a trip

Definition of NOT TRAVEL PLANNING (NO):
- Travel news, tourism statistics, or history
- Definitions (e.g., “what is travel blogging”)
- Jobs, business, or blogging related to travel
- Products for travel (bags, cameras, gadgets)
- General discussion without intent to plan a trip

Rules (NON-NEGOTIABLE):
- If the prompt is informational or educational only → "no"
- If the prompt shows intent to plan or organize a trip → "yes"
- If unsure → "no"
- Do NOT explain your answer
- Output MUST be exactly "yes" or "no"

User Prompt:
"${userPrompt}"`,
        {
            type: "object",
            properties: {
                answer: {
                    type: "string",
                    enum: ["yes", "no"],
                    description: 'Return exactly "yes" or "no"',
                },
            },
            required: ["answer"],
        },
    );

    if (isTravelRelatedPrompt.answer.toLowerCase() !== "yes") {
        throw new Error("Please provide a travel-related prompt to create a plan.");
    }
}

// check similar plan using gemini ai
async function checkSimilarPlan(userPrompt) {
    // Extract destination and days from user prompt using Gemini AI
    const extractedData = await geminiAi(
        `You are a precise data extractor and converter.

Extract ONLY the following from the user prompt:
1. destination - The primary location (city or country name)
2. days - The number of days for the trip converted to numeric days

Rules for destination:
- destination must be a clean location name (e.g., "Paris", "Dubai", "Saudi Arabia")

Rules for days extraction and conversion:
- If days mentioned explicitly (3 days, three days, 3-day, etc.) → extract as numeric string (e.g., "3")
- If weeks mentioned (1 week, 2 weeks, one week, etc.) → convert to days: 1 week = 7, 2 weeks = 14, etc.
- If months mentioned (1 month, 2 months, one month, etc.) → convert to days: 1 month = 30, 2 months = 60, etc.
- If not mentioned or unclear → return null
- Do NOT guess or assume if not explicitly mentioned
- Always return the CONVERTED numeric day value as a string

Examples:
- "3 days in Paris" → days: "3"
- "1 week in Dubai" → days: "7"
- "2 weeks in Tokyo" → days: "14"
- "1 month in India" → days: "30"
- "trip to Paris" (no duration) → days: null

User Prompt:
"${userPrompt}"

Return ONLY the extracted data in JSON format.`,
        {
            type: "object",
            properties: {
                destination: {
                    type: "string",
                    description: "Primary destination (city or country)",
                },
                days: {
                    type: ["string", "null"],
                    description:
                        'Number of days as string (converted from weeks/months if needed, e.g., "7", "30") or null if not mentioned',
                },
            },
            required: ["destination", "days"],
        },
    );

    const { destination, days } = extractedData;

    // Query database based on whether days were mentioned
    let existingPlan;

    if (days === null || days === "null") {
        // User did NOT mention days → match by destination only
        // Return any plan with matching destination (prefer most recent)
        existingPlan = await Plan.findOne({
            destination: { $regex: new RegExp(destination, "i") },
        })
            .sort({ createdAt: -1 })
            .lean();
    } else {
        // User mentioned days → match BOTH destination AND days
        existingPlan = await Plan.findOne({
            destination: { $regex: new RegExp(destination, "i") },
            days: days,
        }).lean();
    }

    // If matching plan found, redirect to it
    if (existingPlan) {
        return redirect(`/plan/${existingPlan.slug}`);
    }

    // No match found, continue to create new plan
}
