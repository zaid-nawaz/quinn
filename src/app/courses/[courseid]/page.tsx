// src/app/courses/[courseid]/page.tsx

export default function CourseDetailPage({ params }: { params: { courseid: string } }) {
  return (
    <div>
      <h1>Course: {params.courseid}</h1>    
    </div>
  );
}