"use client";

import React, { useState, useEffect } from "react";
import { HabitWithStatus } from "../types";

interface HabitDashboardProps {
  onLogout: () => void;
}

const HabitDashboard: React.FC<HabitDashboardProps> = ({ onLogout }) => {
  const [habits, setHabits] = useState<HabitWithStatus[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitDescription, setNewHabitDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      fetchHabits();
    }
  }, [token]);
  const fetchHabits = async () => {
    try {
      const response = await fetch("/api/habits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch habits");
      }

      const data = await response.json();
      setHabits(data);
    } catch (err) {
      setError("Failed to load habits");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newHabitName,
          description: newHabitDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create habit");
      }

      const newHabit = await response.json();
      setHabits([newHabit, ...habits]);
      setNewHabitName("");
      setNewHabitDescription("");
      setShowAddForm(false);
    } catch (err) {
      setError("Failed to create habit");
      console.error(err);
    }
  };

  const handleToggleComplete = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update habit");
      }

      const result = await response.json();

      // Update the habit in the list
      setHabits(
        habits.map((habit) =>
          habit._id === habitId
            ? { ...habit, completedToday: result.completed }
            : habit
        )
      );
    } catch (err) {
      setError("Failed to update habit");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-16">
          <h1
            className="text-4xl md:text-6xl uppercase font-bold text-amber-300 tracking-widest"
            style={{ fontFamily: "Raleway Dots" }}
          >
            My Habits
          </h1>
          <button
            onClick={onLogout}
            className="py-2 px-4 md:px-8 text-sm md:text-lg text-black bg-amber-300 hover:bg-amber-200 font-bold border border-gray-300 rounded-md  cursor-pointer duration-150 "
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-52 text-lg py-2 font-bold text-black bg-amber-300 hover:bg-amber-200 duration-150 rounded-md cursor-pointer"
            >
              Add New Habit
            </button>
          ) : (
            <div className="bg-amber-100 p-6 rounded-lg shadow">
              <h3 className="uppercase text-3xl font-bold mb-4 text-sky-500 text-center tracking-wide">
                Add New Habit
              </h3>
              <form onSubmit={handleAddHabit} className="space-y-4">
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-1">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-black"
                    placeholder="e.g., Drink 8 glasses of water"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={newHabitDescription}
                    onChange={(e) => setNewHabitDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-black"
                    placeholder="Additional details about this habit"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="w-36 md:w-44 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 cursor-pointer"
                  >
                    Add Habit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewHabitName("");
                      setNewHabitDescription("");
                    }}
                    className="w-36 md:w-44 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No habits yet. Create your first habit!
              </p>
            </div>
          ) : (
            habits.map((habit) => (
              <div
                key={habit._id}
                className="bg-amber-100 p-6 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {habit.name}
                    </h3>
                    {habit.description && (
                      <p className="text-gray-600 mt-1">{habit.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">
                      {habit.completedToday ? "✅" : "🕓"}
                    </span>
                    <button
                      onClick={() => handleToggleComplete(habit._id)}
                      className={`px-4 py-2 rounded-md font-medium ${
                        habit.completedToday
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-sky-600 text-white hover:bg-sky-700"
                      }`}
                    >
                      {habit.completedToday ? "Completed" : "Mark Done"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitDashboard;
