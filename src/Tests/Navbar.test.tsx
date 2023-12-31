import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../Components/Navbar";

describe("Navbar component", () => {
  test("renders Navbar component with basic navigation items", () => {
    act(() => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Likes")).toBeInTheDocument();
    expect(screen.getByText("Bookmark")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
