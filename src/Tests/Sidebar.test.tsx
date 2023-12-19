import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AppContext from "../context/app-context";
import { BrowserRouter as Router } from "react-router-dom";
import SideNavBar from "../Components/SideNavBar";
//tabs rendering for mobile view
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
  dimensions: { width: 400, height: 800 },
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

const setWindowWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe("SideNavBar component", () => {
  beforeEach(() => {
    setWindowWidth(400);
  });

  test("renders SideNavBar component with basic navigation items", () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValues}>
          <SideNavBar />
        </AppContext.Provider>
      </Router>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Likes")).toBeInTheDocument();
    expect(screen.getByText("Bookmarks")).toBeInTheDocument();
  });
});
