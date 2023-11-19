import React, { useState, useEffect } from "react";

function HomePage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch courses assigned to the teacher
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/lecturercourse"); // Update the API endpoint as needed
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
      setIsLoading(false);
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teacher's Dashboard</h1>
      <div>
        <h2 className="text-xl font-semibold">Your Courses</h2>
        {courses.length > 0 ? (
          <ul className="list-disc pl-5">
            {courses.map((course) => (
              <li key={course._id}>{course.course_name}</li>
            ))}
          </ul>
        ) : (
          <p>No courses assigned.</p>
        )}
      </div>

      {/* Additional functionalities like managing enrollments, submitting grades, etc., can be added here */}
    </div>
  );
}

export default HomePage;
