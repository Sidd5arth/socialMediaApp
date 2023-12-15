import React from "react";
import { render, screen } from "@testing-library/react";
import Posts from "../Pages/Posts";
import AppContext from "../context/app-context";
import { MemoryRouter } from "react-router-dom";
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

describe("Posts Component", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  it("renders Posts component correctly", () => {
    render(
      <MemoryRouter>
        <AppContext.Provider value={appContextValues}>
          <Posts />
        </AppContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Your Posts")).toBeDefined();
    expect(screen.getByText("Test post")).toBeDefined();
  });
});
