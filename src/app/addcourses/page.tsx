"use client"
import { useState } from "react"
import { saveCourse } from "../actions/saveCourse";
import { useRouter } from "next/navigation";


export default function AddCourses ()  {
  const [val, setVal] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async () => {
      await saveCourse(val);
      setVal("");
      router.push("/");
  } 


  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Paste something..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="border p-2 rounded w-80"
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  )
}