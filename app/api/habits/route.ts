import { getUserFromRequest } from "@/lib/auth";
import { connectDb } from "@/lib/dbConnect";
import Habit from "@/models/Habit.model";
import { NextRequest, NextResponse } from "next/server";
type Completion = {
  date: string; // format: 'YYYY-MM-DD'
};
type Habit = {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  completions: Completion[];
};
export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const userId = getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habits = await Habit.find({ userId }).sort({ createdAt: -1 });

    const today = new Date().toISOString().split("T")[0];
    const habitsWithStatus = habits.map((habit: Habit) => {
      const completedToday = habit.completions.some(
        (completion) => completion.date === today
      );

      return {
        _id: habit._id,
        name: habit.name,
        description: habit.description,
        createdAt: habit.createdAt,
        completions: habit.completions,
        completedToday,
      };
    });

    return NextResponse.json(habitsWithStatus);
  } catch (error) {
    console.error("Get habits error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Habit name is required" },
        { status: 400 }
      );
    }

    const habit = await Habit.create({
      userId,
      name,
      description,
      completions: [],
    });

    return NextResponse.json({
      _id: habit._id,
      name: habit.name,
      description: habit.description,
      createdAt: habit.createdAt,
      completions: habit.completions,
      completedToday: false,
    });
  } catch (error) {
    console.error("Create habit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
