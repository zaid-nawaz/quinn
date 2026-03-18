"use client";
import { useState } from "react";
import { saveCourse } from "../actions/saveCourse";
import { useRouter } from "next/navigation";

export default function AddCourses() {
  const [val, setVal] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!val.trim()) return;
    await saveCourse(val);
    setVal("");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Add New Course
        </h1>

        <div className="flex flex-col gap-4">
          <textarea
            placeholder="Paste your playlist url here..."
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none p-4 rounded-xl w-full h-40 resize-none transition"
          />

          <button
            onClick={handleSubmit}
            className="bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition duration-200"
          >
            Save Course
          </button>
        </div>
      </div>
    </div>
  );
}