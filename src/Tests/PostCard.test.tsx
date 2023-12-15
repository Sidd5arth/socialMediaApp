import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostCard from "../Components/PostCard";
import AppContext from "../context/app-context";

// Mock AppContext
jest.mock("../context/app-context", () => ({
  ...jest.requireActual("../context/app-context"),
  useContext: jest.fn(),
}));

const mockUser = {
  id: "mockUserId",
  // add other properties as needed for your user object
};

const mockSetAllPostData = jest.fn();

const mockContextValue = {
  userData: {
    user: mockUser,
  },
  setAllPostData: mockSetAllPostData,
  allPostData: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(React, "useContext").mockReturnValue(mockContextValue);
});

test("renders PostCard component with user image and caption", () => {
  render(
    <PostCard
      imageSrc="mockImageSrc"
      caption="Mock Caption"
      likes={["mockUserId"]}
      bookmarks={["mockUserId"]}
      post_id="mockPostId"
      creator_id="mockUserId"
    />
  );

  expect(screen.getByAltText("user image")).toBeInTheDocument();
  expect(screen.getByText("Mock Caption")).toBeInTheDocument();
  expect(screen.getByText("delete")).toBeInTheDocument();
  expect(screen.getByText("edit")).toBeInTheDocument();
});

test("handles like button click", async () => {
  render(
    <PostCard
      likes={["mockUserId"]}
      bookmarks={["mockUserId"]}
      post_id="mockPostId"
      creator_id="mockCreatorId"
    />
  );

  fireEvent.click(screen.getByText(/heart/i));

  expect(mockSetAllPostData).toHaveBeenCalledTimes(1);
  expect(mockSetAllPostData).toHaveBeenCalledWith(expect.any(Function));
});

test('opens and closes modal when "delete" is clicked', () => {
  render(<PostCard post_id="mockPostId" creator_id="mockUserId" />);

  fireEvent.click(screen.getByText("delete"));

  expect(screen.getByText("are you sure")).toBeInTheDocument();

  fireEvent.click(screen.getByText("cancel"));

  waitFor(() => {
    expect(screen.queryByText("are you sure")).not.toBeInTheDocument();
  });
});

test("handles comment button click", async () => {
  render(
    <PostCard
      likes={["mockUserId"]}
      bookmarks={["mockUserId"]}
      post_id="mockPostId"
      creator_id="mockUserId"
    />
  );

  fireEvent.click(screen.getByText(/comment/i));

  expect(mockSetAllPostData).toHaveBeenCalledTimes(1);
  expect(mockSetAllPostData).toHaveBeenCalledWith(expect.any(Function));
});
