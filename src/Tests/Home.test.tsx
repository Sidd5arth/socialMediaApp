import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Home from "../Pages/Home";
import { supabase } from "../SupabaseClient";

jest.mock("../SupabaseClient", () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));

describe("Home component", () => {
  test("renders Home component with default state", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Add your assertions for the initial state of the component
    expect(screen.getByText("Home")).toBeInTheDocument();
    // Add more assertions as needed
  });

  test("loads posts when the component mounts", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText("Loading posts")).toBeInTheDocument();
      // Adjust the assertion based on your loading logic
    });
  });

  test("navigates to the login page when the user is not logged in", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for the navigation to complete
    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
      // Add more assertions based on the logout logic
    });
  });
});
