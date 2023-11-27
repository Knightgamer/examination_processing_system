
import axios from "axios";
import React, { useEffect, useState } from "react";

function CourseRegistration() {
 // State variables to store courses, selected courses, and loading status
 const [courses, setCourses] = useState([]);
 const [selectedCourses, setSelectedCourses] = useState([]);
 const [isLoading, setIsLoading] = useState(true);

 // Fetch courses from backend when component mounts
 useEffect(() => {
    axios
      .get("http://localhost:5000/courses") // Adjust with your actual endpoint
      .then((response) => {
        setCourses(response.data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching courses:", error));
 }, []);

 // Function to handle course selection
 const handleCourseSelection = (courseId) => {
    setSelectedCourses((prevSelectedCourses) => {
      if (prevSelectedCourses.includes(courseId)) {
        return prevSelectedCourses.filter((id) => id !== courseId);
      } else {
        return [...prevSelectedCourses, courseId];
      }
    });
 };

 // Function to handle form submission
 const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedCourses.length < 5) {
      alert("You must select at least 5 courses.");
      return;
    }

    // Retrieve student ID from local storage
    const studentId = localStorage.getItem("userId"); // Adjust the key as per your implementation

    if (!studentId) {
      alert("No student ID found. Please log in.");
      return;
    }

    console.log(
      "Submitting courses:",
      selectedCourses,
      "for student:",
      studentId
    );

    axios
      .post("http://localhost:5000/student/register", {
        student: studentId,
        courses: selectedCourses,
      })
      .then((response) => {
        alert("Courses registered successfully");
      })
      .catch((error) => {
        console.error("Error registering courses:", error);
        alert("Failed to register courses. Please try again.");
      });
 };

 // Render loading message if data is still being fetched
 if (isLoading) {
    return <div>Loading courses...</div>;
 }

 // Render form with course checkboxes and submit button
 return (
    <div>
      <h1>Course Registration</h1>
      <form onSubmit={handleSubmit}>
        {courses.map((course) => (
          <div key={course._id}>
            <input
              type="checkbox"
              id={course._id}
              value={course._id}
              onChange={() => handleCourseSelection(course._id)}
            />
            <label htmlFor={course._id}>
              {course.courseCode} {course.courseName}
            </label>
          </div>
        ))}
        <button type="submit">Register Courses</button>
      </form>
    </div>
 );
}

export default CourseRegistration;
//
//This code provides a user interface for course registration. It fetches a list of courses from the backend and displays them as checkboxes. The user can select up to 5 courses and submit the form. The selected courses are then sent to the backend for registration..</s>