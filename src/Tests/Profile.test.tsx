import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "../Components/ProfileComp/Profile";
import { BrowserRouter as Router } from "react-router-dom";
import AppContext from "../context/app-context";
import { updateImg } from "../api/update";

jest.mock("react-hot-toast");
jest.mock("../SupabaseClient", () => ({
  supabase: {
    auth: {
      signOut: jest.fn(() => ({ error: null })),
    },
  },
}));

jest.mock("../api/update", () => ({
  updateImg: jest.fn(),
}));

const appContextValues = {
  userData: {
    user: {
      id: "123",
      email: "example@example.com",
      user_metadata: {
        first_name: "Name",
      },
    },
    session: {},
  },
  dimensions: {
    width: 800,
    height: 600,
  },
  allPostData: [],
  prflpic: [
    {
      user_id: "123",
      profile: "sdsa",
      username: "Name",
    },
  ],
  setAllPostData: jest.fn(),
  setUserData: jest.fn(),
  setPrflpic: jest.fn(),
  setImage: jest.fn(() => Promise.resolve()),
};

jest.mock("../hooks/useFileUpload", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    uploadFile: jest.fn(),
    uploadResponse: "mockedUrl",
    isUploading: false,
  })),
}));

describe("Profile", () => {
  it("renders user information correctly", async () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValues}>
          <Profile />
        </AppContext.Provider>
      </Router>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("opens and closes modal for editing profile", async () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValues}>
          <Profile />
        </AppContext.Provider>
      </Router>
    );

    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
  });

  it("uploads image successfully", async () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValues}>
          <Profile />
        </AppContext.Provider>
      </Router>
    );

    fireEvent.click(screen.getByText("Edit"));

    const fileInput = screen.getByText(
      "Drag & drop an image or click to select one"
    );
    fireEvent.change(fileInput, {
      target: { files: [new File(["test"], "test.jpg")] },
    });

    fireEvent.click(screen.getByText("OK"));
  });

  it("updates post count based on user's posts", async () => {
    const appContextValuesWithPosts = {
      ...appContextValues,
      allPostData: [
        { id: 1, created_by: "123" },
        { id: 2, created_by: "456" },
        { id: 3, created_by: "123" },
      ],
    };

    render(
      <Router>
        <AppContext.Provider value={appContextValuesWithPosts}>
          <Profile />
        </AppContext.Provider>
      </Router>
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });
  it("calls updateImg and updates profile picture", async () => {
    render(
      <Router>
        <AppContext.Provider value={appContextValues}>
          <Profile />
        </AppContext.Provider>
      </Router>
    );

    (appContextValues.setImage as jest.Mock).mockClear();
    appContextValues.setPrflpic.mockClear();

    await waitFor(() => appContextValues.setImage());

    expect(updateImg).toHaveBeenCalledWith(
      "users",
      "user_id",
      "123",
      "profile",
      "mockedUrl"
    );

    expect(appContextValues.setPrflpic).toHaveBeenCalledTimes(1);

    console.log(appContextValues.setPrflpic.mock.calls);
  });
});
