import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

import Bookmarks from "../Pages/Bookmarks";
import AppContext from "../context/app-context";

const appContextValues = {
  userData: {
    user: {
      id: "123",
      email: "example@example.com",
      user_metadata: {
        first_name: "John",
      },
    },
    session: {},
  },
  dimensions: {
    width: 800,
    height: 600,
  },
  allPostData: [],
  prflpic: [],
  setAllPostData: () => {},
  setUserData: () => {},
  setPrflpic: () => {},
};

// Render the component with the mocked context values
render(
  <Router>
    <AppContext.Provider value={appContextValues}>
      <Bookmarks />
    </AppContext.Provider>
  </Router>
);

test("renders Bookmarks component correctly", () => {
  // Mock the necessary context values

  // Test that the "Bookmarks" heading is rendered
  const headingElement = screen.getByText(/Bookmarks/i);
  expect(headingElement).toHaveTextContent("Bookmarks"); // Use toHaveTextContent matcher

  // Test that the loading spinner is not displayed
  const spinnerElement = screen.queryByTestId("loading-spinner");
  expect(spinnerElement).not.toBeInTheDocument();
});
test("renders PostCard component for each item in the bookmarked array", () => {
  // Create a sample bookmarked array with multiple items
  const bookmarkedArray = [
    { post_id: 1, caption: "Post 1" },
    { post_id: 2, caption: "Post 2" },
    { post_id: 3, caption: "Post 3" },
  ];

  // Select all PostCard components by testId
  const postCardElements = screen.getAllByTestId("post-card");

  // Assert that the number of PostCard components is equal to the length of the bookmarked array
  expect(postCardElements.length).toBe(bookmarkedArray.length);
});
