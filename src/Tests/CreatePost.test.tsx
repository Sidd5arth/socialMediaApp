import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { insertData } from "../api/insert";
import { getAll } from "../api/getAll";

jest.mock("../api/insert");
jest.mock("../api/getAll");

const mockInsertData = insertData as jest.MockedFunction<typeof insertData>;
const mockGetAll = getAll as jest.MockedFunction<typeof getAll>;

describe("CreatePost component", () => {
  test("handles post creation when the 'Post' button is clicked", async () => {
    mockGetAll.mockResolvedValueOnce([{ post_id: "1", content: "Test post" }]);

    const inputField = screen.getByPlaceholderText(
      "Write your post..."
    ) as HTMLInputElement;
    fireEvent.change(inputField, { target: { value: "Test post content" } });

    fireEvent.click(screen.getByRole("button", { name: "Post" }));

    expect(screen.getByText("Uploading")).toBeInTheDocument();

    await waitFor(() => {});

    expect(mockInsertData).toHaveBeenCalledWith("post", [
      { created_by: "mockUserId", content: "Test post content" },
    ]);
    expect(mockGetAll).toHaveBeenCalledWith("post");

    expect(screen.queryByText("Uploading")).not.toBeInTheDocument();

    expect(inputField.value).toBe("");

    expect(screen.getByText("Test post")).toBeInTheDocument();
  });
});
