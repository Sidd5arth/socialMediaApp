import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostCard from "../Components/PostCard";
import AppContext from "../context/app-context";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("../api/insert", () => ({
  insertData: jest.fn(() => Promise.resolve()),
}));
jest.mock("../api/getAll", () => ({
  getAll: jest.fn(() => Promise.resolve([])),
}));
jest.mock("../api/update", () => ({
  updateData: jest.fn(() => Promise.resolve()),
}));
jest.mock("../api/delete", () => ({
  deleteData: jest.fn(() => Promise.resolve()),
}));
jest.mock("react-hot-toast", () => ({
  toast: {
    error: jest.fn(),
  },
}));

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

const mockPostData = {
  post_id: "1",
  imageSrc: "mockImageSrc",
  caption: "Mock Caption",
  likes: ["mockUserId"],
  bookmarks: ["mockUserId"],
  creator_id: "mockUserId",
  created_at: "2023-01-01T12:00:00Z",
};

describe("PostCard", () => {
  it("renders post information correctly", async () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValues}>
          <PostCard {...mockPostData} />
        </AppContext.Provider>
      </Router>
    );

    expect(screen.getByText("Mock Caption")).toBeInTheDocument();
    expect(screen.getByLabelText("unlike-button")).toBeInTheDocument();
    expect(screen.getByLabelText("bookmark")).toBeInTheDocument();
  });

  it("handles like and bookmark actions", async () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValues}>
          <PostCard {...mockPostData} />
        </AppContext.Provider>
      </Router>
    );
  });

  it("opens and closes modal for adding comments", async () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValues}>
          <PostCard {...mockPostData} />
        </AppContext.Provider>
      </Router>
    );

    fireEvent.click(screen.getByLabelText("comment-button"));
    expect(screen.getByText("comment here")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close"));
  });
});
