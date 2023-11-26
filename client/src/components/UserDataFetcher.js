import { useEffect, useState } from "react";

const UserDataFetcher = ({ children }) => {
  const [userData, setUserData] = useState({
    initials: "", // Initialize initials as an empty string
    firstName: "",
    lastName: "",
    email: "",
    // Add other user data fields as needed
  });

  useEffect(() => {
    // Check if JWT token is available in local storage
    const token = localStorage.getItem("token");

    if (token) {
      // Fetch user data from your backend API with the JWT token in headers
      fetch("http://localhost:5000/users/protected-lecturer", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Assuming the response contains user data fields like firstName, lastName, and email
          const { firstName, lastName, email } = data;

          // Calculate initials from firstName and lastName, e.g., "JS" for "John Smith"
          const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

          // Update the userData state with fetched data and initials
          setUserData({
            ...data,
            initials,
          });
        })
        .catch((error) => {
          console.error("Error fetching user data: ", error);
        });
    }
  }, []); // Make sure to provide appropriate dependencies

  return children(userData);
};

export default UserDataFetcher;
