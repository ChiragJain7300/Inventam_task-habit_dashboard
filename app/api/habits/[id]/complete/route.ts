import { getUserFromRequest } from "@/lib/auth";
import { connectDb } from "@/lib/dbConnect";
import Habit from "@/models/Habit.model";
import { NextRequest, NextResponse } from "next/server";
type Completion = {
  date: string; // format: 'YYYY-MM-DD'
};
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDb();

    // Protected Routes
    const userId = getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habitId = context.params.id;
    const habit = await Habit.findOne({ _id: habitId, userId });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const today = new Date().toISOString().split("T")[0];
    const existingCompletionIndex = habit.completions.findIndex(
      (completion: Completion) => completion.date === today
    );

    if (existingCompletionIndex !== -1) {
      habit.completions.splice(existingCompletionIndex, 1);
      await habit.save();

      return NextResponse.json({
        message: "Habit unmarked for today",
        completed: false,
      });
    } else {
      // Add new completion
      habit.completions.push({
        date: today,
        completedAt: new Date(),
      });
      await habit.save();

      return NextResponse.json({
        message: "Habit completed for today",
        completed: true,
      });
    }
  } catch (error) {
    console.error("Complete habit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
