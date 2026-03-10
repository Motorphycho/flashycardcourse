import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { seedExampleData } from "@/lib/seed-data";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await seedExampleData(userId);
    
    if (result.success) {
      return NextResponse.json({
        message: "Example data seeded successfully",
        spanishDeckId: result.spanishDeckId,
        britishHistoryDeckId: result.britishHistoryDeckId,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Seed API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
