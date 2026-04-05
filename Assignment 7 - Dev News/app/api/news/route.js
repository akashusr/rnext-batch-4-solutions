import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  try {
    const jsonDirectory = path.join(process.cwd(), "public");
    const fileContents = await fs.readFile(
      jsonDirectory + "/data.json",
      "utf8"
    );
    const news = JSON.parse(fileContents);

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load news data" },
      { status: 500 }
    );
  }
}
