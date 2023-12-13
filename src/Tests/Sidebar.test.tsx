import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import SideNavBar from "../Components/SideNavBar";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

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
      <MemoryRouter>
        <SideNavBar />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Post")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Likes")).toBeInTheDocument();
    expect(screen.getByText("Bookmarks")).toBeInTheDocument();
  });

  test("navigates to the correct path when a navigation item is clicked", () => {
    render(
      <MemoryRouter>
        <SideNavBar />
      </MemoryRouter>
    );

    const navigationItems = ["Home", "Post", "Profile", "Likes", "Bookmarks"];
    for (const item of navigationItems) {
      const navItem = screen.getByText(item, { selector: "nav li p" });
      fireEvent.click(navItem);

      expect(mockNavigate).toHaveBeenCalledWith(`/`);
    }
  });
});
