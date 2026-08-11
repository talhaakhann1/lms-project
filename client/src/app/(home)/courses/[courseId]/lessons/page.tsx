"use client"

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { showError, showSuccess } from "@/src/components/ui/toaster";
import { setLoading } from "@/src/store/authSlice";
import { courseService } from "@/src/services/course.service";
import { Course } from "@/src/types/interfaces/course.interface";
import { reviewService } from "@/src/services/review.service";
import { useParams, useRouter } from "next/navigation";
import { Review } from "@/src/types/interfaces/review.interface";
import CourseDetailLoading from "@/src/components/courseDetails/CourseDetailSkeleton";
import { useAppSelector } from "@/src/store/hook";
import LessonList from "@/src/components/lessonList/Lessonlist";
import { lessonService } from "@/src/services/lesson.service";
import { Lesson } from "@/src/types/interfaces/lesson.interface";
import { orderService } from "@/src/services/order.service";
import { Order } from "@/src/types/interfaces/order.interface";



// const mockInstructor: InstructorData = {
//   name: "Laura Kim",
//   title: "Senior Data Analyst, ex-Stripe",
//   bio: "Laura has spent the last decade building analytics platforms for high-growth companies and has taught data fundamentals to over 40,000 students online.",
// };

// const mockCurriculum: CurriculumSection[] = [
//   {
//     id: "section-1",
//     title: "Getting Started",
//     lessons: [
//       { id: "l-1", title: "Course overview", duration: "4:30", locked: false },
//       { id: "l-2", title: "Setting up your environment", duration: "8:12", locked: false },
//       { id: "l-3", title: "Understanding the dataset", duration: "6:45", locked: false },
//     ],
//   },
//   {
//     id: "section-2",
//     title: "Cleaning and Structuring Data",
//     lessons: [
//       { id: "l-4", title: "Handling missing values", duration: "11:20", locked: true },
//       { id: "l-5", title: "Normalizing data types", duration: "9:05", locked: true },
//       { id: "l-6", title: "Building a validation layer", duration: "14:40", locked: true },
//     ],
//   },
//   {
//     id: "section-3",
//     title: "Visualizing Results",
//     lessons: [
//       { id: "l-7", title: "Choosing the right chart", duration: "7:15", locked: true },
//       { id: "l-8", title: "Building interactive dashboards", duration: "16:30", locked: true },
//     ],
//   },
// ];

// const mockReviews: Review[] = [
//   {
//     id: "r-1",
//     studentName: "Jordan Blake",
//     rating: 5,
//     date: "June 2026",
//     text: "Clear, practical, and well-paced. The dataset walkthroughs made the concepts click in a way tutorials never had before.",
//   },
//   {
//     id: "r-2",
//     studentName: "Sofia Alvarez",
//     rating: 5,
//     date: "May 2026",
//     text: "Best data course I've taken this year. Laura explains the reasoning behind each step, not just the syntax.",
//   },
//   {
//     id: "r-3",
//     studentName: "Ethan Ward",
//     rating: 4,
//     date: "April 2026",
//     text: "Really solid course overall. Would have liked a bit more depth in the visualization section, but still highly recommend it.",
//   },
// ];

export default function CourseDetailsPage() {
    const [course, setCourse] = useState<Course | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [actionLoading, setActionLoading] = useState<boolean>(false)
    const params = useParams();
    const courseId = params.courseId as string
    const router = useRouter()
    const user = useAppSelector((state) => state.auth.user)
    console.log(user);

    const userRole = user?.role

    // const handleBuyNow=async()=>{
    //   setActionLoading(true)
    //   try {
    //     const order=await orderService.create(courseId)
    //     const orderId=order.id
    //     router.push(`/checkout/${orderId}`)
    //   } catch (error) {
    //     const axiosError = error as AxiosError<ApiResponse<unknown>>;

    //     const errorMessage =
    //       axiosError.response?.data.message ?? "Something went wrong";

    //     console.error(errorMessage);

    //     showError("Something went wrong", errorMessage);
    //   } finally{
    //     setActionLoading(false)
    //   }
    // }

    const fetchCourseData = async (courseId: string) => {
        setIsLoading(true)
        try {
            const [course, lessons, reviews] = await Promise.all([
                courseService.getById(courseId),
                lessonService.getCourseLessons(courseId),
                reviewService.getCourseReviews(courseId)
            ]);
            setCourse(course);
            setLessons(lessons)
            setReviews(reviews);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse<unknown>>;

            const errorMessage =
                axiosError.response?.data.message ?? "Something went wrong";

            console.error(errorMessage);

            showError("Something went wrong", errorMessage);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCourseData(courseId)
    }, [])

    if (isLoading) {
        return (
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_360px] lg:items-start lg:px-8 lg:py-16">
                <CourseDetailLoading />
            </div>
        )
    }

    // const course = {
    //   title: "Foundations of Data Analysis",
    //   tagline:
    //     "Learn to clean, explore, and visualize real datasets through practical, project-based lessons built around real-world data.",
    //   thumbnailUrl: "/images/courses/data-analysis.jpg",
    //   category: "Data Science",
    //   price: "$49",
    //   originalPrice: "$89",
    //   rating: 4.8,
    //   reviewCount: mockReviews.length + 2137,
    //   description:
    //     "This course walks you through the full lifecycle of a data analysis project — from messy raw exports to a polished, presentable dashboard. You'll work with real datasets at every stage, building habits that carry directly into day-to-day analytics work.",
    //   learningOutcomes: [
    //     "Clean and validate real-world datasets with confidence",
    //     "Structure a repeatable analysis workflow",
    //     "Build clear, interactive dashboards",
    //     "Communicate findings to non-technical stakeholders",
    //     "Spot common data quality issues before they cause problems",
    //     "Choose the right chart for the story you're telling",
    //   ],
    //   requirements: [
    //     "Basic familiarity with spreadsheets or tabular data",
    //     "A computer capable of running a modern browser",
    //     "No prior programming experience required",
    //   ],
    //   totalLessons: mockCurriculum.reduce((sum, section) => sum + section.lessons.length, 0),
    //   totalDurationLabel: "1h 18m",
    //   totalStudents: 18400,
    // };

    return (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_360px] lg:items-start lg:px-8 lg:py-16">
            {/* <CourseCurriculum sections={mockCurriculum} /> */}
            <LessonList isLoading={isLoading} lessons={lessons} courseId={course?.id} onClick={(lessonId) => router.push(`/courses/${courseId}/lessons/${lessonId}`)} />
        </div>
    );
}