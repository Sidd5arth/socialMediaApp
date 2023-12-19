import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AppContext from "../context/app-context";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

import Likes from "../Pages/Likes";

// testing for Liked post to render
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

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
const appContextValuesNOposts = {
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
      likes: [], // no likes
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

describe("Likes component", () => {
  test("renders Likes component correctly with liked posts", async () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValuesNOposts}>
          <Likes />
        </AppContext.Provider>
      </Router>
    );

    expect(
      screen.getByRole("heading", { name: /Liked Posts/i })
    ).toBeInTheDocument();
  });
  test("renders liked posts", async () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValues}>
          <Likes />
        </AppContext.Provider>
      </Router>
    );

    expect(screen.getByText(/Test post 1/i)).toBeInTheDocument();
  });
  test("renders NO liked posts", async () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValuesNOposts}>
          <Likes />
        </AppContext.Provider>
      </Router>
    );

    await waitFor(() => screen.getByText("Liked Posts"));

    expect(
      screen.getByText(/your liked posts are listed here/i)
    ).toBeInTheDocument();
  });
});
