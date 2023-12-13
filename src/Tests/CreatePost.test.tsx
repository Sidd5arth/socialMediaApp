import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { insertData } from "../api/insert";
import { getAll } from "../api/getAll";

// Import necessary modules and setup

jest.mock("../api/insert");
jest.mock("../api/getAll");

const mockInsertData = insertData as jest.MockedFunction<typeof insertData>;
const mockGetAll = getAll as jest.MockedFunction<typeof getAll>;

describe("CreatePost component", () => {
  test("handles post creation when the 'Post' button is clicked", async () => {
    // Mock the insertData and getAll functions
    // mockInsertData.mockResolvedValue({}); // Change this line
    mockGetAll.mockResolvedValueOnce([{ post_id: "1", content: "Test post" }]);

    // Render the component (not shown for brevity)

    // Simulate user input
    const inputField = screen.getByPlaceholderText(
      "Write your post..."
    ) as HTMLInputElement;
    fireEvent.change(inputField, { target: { value: "Test post content" } });

    // Click the 'Post' button
    fireEvent.click(screen.getByRole("button", { name: "Post" }));

    // Ensure the loading state is displayed
    expect(screen.getByText("Uploading")).toBeInTheDocument();

    // Wait for the asynchronous operations to complete
    await waitFor(() => {});

    // Ensure that insertData and getAll were called
    expect(mockInsertData).toHaveBeenCalledWith("post", [
      { created_by: "mockUserId", content: "Test post content" },
    ]);
    expect(mockGetAll).toHaveBeenCalledWith("post");

    // Ensure that loading state disappears
    expect(screen.queryByText("Uploading")).not.toBeInTheDocument();

    // Ensure that the input field is cleared
    expect(inputField.value).toBe("");

    // Ensure that the post is displayed (this will depend on your actual component behavior)
    expect(screen.getByText("Test post")).toBeInTheDocument();
  });
});
