import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppContext from "../context/app-context";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Home from "../Pages/Home";
import { supabase } from "../SupabaseClient";

window.matchMedia = jest.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

jest.mock("../SupabaseClient", () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));

const appContextValues = {
  userData: {
    user: {
      id: "123", // userId should be in likes array
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
      likes: ["mockUserId", "123"], // userId should be in likes array
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
