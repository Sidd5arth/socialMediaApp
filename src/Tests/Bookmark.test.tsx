import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import AppContextProvider from "../context/AppContextProvider";

import Bookmarks from "../Pages/Bookmarks";

// Mocking the context values for testing
jest.mock("../context/AppContextProvider", () => ({
  __esModule: true,
  default: {
    userData: {
      user: { id: "123" },
    },
    dimensions: { width: 800 },
    allPostData: [
      {
        post_id: "1",
        content: "Test Content 1",
        bookmarks: ["123"],
        created_by: "123",
        created_at: new Date(),
      },
      {
        post_id: "2",
        content: "Test Content 2",
        bookmarks: [],
        created_by: "456",
        created_at: new Date(),
      },
    ],
    prflpic: [
      {
        user_id: "123",
        profile: "profile1.jpg",
      },
    ],
  },
}));

test("renders Bookmarks component", () => {
  render(
    <AppContextProvider>
      <Router>
        <Bookmarks />
      </Router>
    </AppContextProvider>
  );

  // You can use screen queries to check if certain elements are rendered
  expect(screen.getByText("Bookmarks")).toBeInTheDocument();
  expect(
    screen.getByText("post that are bookmarked shown here")
  ).toBeInTheDocument();
});

test("displays bookmarked posts when there are bookmarks", () => {
  render(
    <AppContextProvider>
      <Router>
        <Bookmarks />
      </Router>
    </AppContextProvider>
  );

  // Assuming there's at least one bookmarked post
  expect(screen.getByText("Test Content 1")).toBeInTheDocument();
});

test("displays loading spinner while loading posts", () => {
  render(
    <AppContextProvider>
      <Router>
        <Bookmarks />
      </Router>
    </AppContextProvider>
  );

  // Simulate loading state
  expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
});

test("navigates to Navbar on window resize when width > 780", () => {
  // Mock the navigate function
  const mockNavigate = jest.fn();
  jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
  }));

  render(
    <AppContextProvider>
      <Router>
        <Bookmarks />
      </Router>
    </AppContextProvider>
  );

  // Resize the window
  global.innerWidth = 800;
  global.dispatchEvent(new Event("resize"));

  // Expect the navigate function to be called
  expect(mockNavigate).toHaveBeenCalledWith("/Navbar");
});
