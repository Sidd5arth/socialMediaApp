import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppContext from "../context/app-context";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import Home from "../Pages/Home";
Object.defineProperty(window, "matchMedia", {
  value: () => {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    };
  },
});
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
  dimensions: { width: 1200, height: 800 },
  allPostData: [
    {
      post_id: "1",
      content: "Test post 1",
      likes: ["mockUserId", "123"],
      bookmarks: ["sdvsd", "123"],
      created_by: "123",
      created_at: new Date().toISOString(),
    },
  ],
  prflpic: [],
  setAllPostData: () => {},
  setUserData: () => {},
  setPrflpic: () => {},
};

describe("Home component", () => {
  test("renders Home component with default state", async () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValues}>
          <Home />
        </AppContext.Provider>
      </Router>
    );

    expect(
      screen.getByRole("heading", { name: /Explore Posts/i })
    ).toBeInTheDocument();
  });

  test("loads posts when the component mounts", async () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValues}>
          <Home />
        </AppContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Loading posts")).toBeInTheDocument();
    });
  });
});
