import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

import Bookmarks from "../Pages/Bookmarks";
import AppContext from "../context/app-context";

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

render(
  <Router>
    <AppContext.Provider value={appContextValues}>
      <Bookmarks />
    </AppContext.Provider>
  </Router>
);

test("renders Bookmarks component correctly", () => {
  expect(
    screen.getByRole("heading", { name: /Bookmarks/i })
  ).toBeInTheDocument();
});
