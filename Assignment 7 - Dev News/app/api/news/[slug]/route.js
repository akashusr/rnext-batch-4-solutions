import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const jsonDirectory = path.join(process.cwd(), "public");
    const fileContents = await fs.readFile(
      jsonDirectory + "/data.json",
      "utf8"
    );
    const news = JSON.parse(fileContents);

    const newsItem = news.find((item) => item.slug === slug);

    if (!newsItem) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json(newsItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load news data" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();

    // Validate that only 'title' or 'description' fields are being updated
    const allowedFields = ["title", "description"];
    const updateFields = Object.keys(body);

    // Check if there are any invalid fields
    const invalidFields = updateFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid fields: ${invalidFields.join(
            ", "
          )}. Only 'title' and 'description' can be updated.`,
        },
        { status: 400 }
      );
    }

    // Check if at least one valid field is provided
    if (updateFields.length === 0) {
      return NextResponse.json(
        {
          error:
            "No valid fields provided for update. You can update 'title' or 'description'.",
        },
        { status: 400 }
      );
    }

    const jsonDirectory = path.join(process.cwd(), "public");
    const filePath = path.join(jsonDirectory, "data.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    let news = JSON.parse(fileContents);

    const newsIndex = news.findIndex((item) => item.slug === slug);

    if (newsIndex === -1) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    // Update only the allowed fields
    if (body.title !== undefined) {
      news[newsIndex].title = body.title;
    }
    if (body.description !== undefined) {
      news[newsIndex].description = body.description;
    }

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(news, null, 4));

    return NextResponse.json({
      message: "News updated successfully",
      updated: news[newsIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    const jsonDirectory = path.join(process.cwd(), "public");
    const filePath = path.join(jsonDirectory, "data.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    let news = JSON.parse(fileContents);

    const newsIndex = news.findIndex((item) => item.slug === slug);

    if (newsIndex === -1) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    // Remove the news item
    const deletedNews = news.splice(newsIndex, 1)[0];

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(news, null, 4));

    return NextResponse.json({
      message: "News deleted successfully",
      deleted: deletedNews,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
