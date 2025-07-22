import { getUserFromRequest } from "@/lib/auth";
import { connectDb } from "@/lib/dbConnect";
import Habit from "@/models/Habit.model";
import { NextRequest, NextResponse } from "next/server";
type Completion = {
  date: string; // format: 'YYYY-MM-DD'
};
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const userId = getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habitId = params.id;
    const { searchParams } = new URL(req.url);

    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Verify habit exists and belongs to user
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const completed = habit.completions.some(
      (completion: Completion) => completion.date === date
    );

    return NextResponse.json({
      habitId,
      date,
      completed,
    });
  } catch (error) {
    console.error("Get habit status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
