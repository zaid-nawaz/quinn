import Link from "next/link"

export const CourseLink = ({ courseId, itemCount, videoId, createEntry } : any) => {
    return (
        <div>
        <Link href={`/courses/${courseId}/${itemCount}/${videoId}`} onClick={createEntry}>Go to course</Link>
        </div>
    )
}