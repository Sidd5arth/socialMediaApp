import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Likes from "../Pages/Likes";

describe("Likes component", () => {
  // Mock the necessary context and useNavigate function
  jest.mock("../context/app-context", () => ({
    __esModule: true,
    default: jest.fn(),
    useContext: jest.fn().mockReturnValue({
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
      dimensions: { width: 1200 },
      allPostData: [
        {
          post_id: "1",
          content: "Test post 1",
          likes: ["mockUserId", "SVsfv"],
          bookmarks: ["sdvsd", "SDFds"],
          created_by: "creatorId",
          created_at: new Date().toISOString(),
        },
      ],
      prflpic: [],
    }),
  }));

  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
  }));

  test("renders Likes component correctly with liked posts", async () => {
    render(
      <MemoryRouter>
        <Likes />
      </MemoryRouter>
    );

    // Output the rendered HTML to the console
    // console.log(screen.debug());

    // Wait for the "Liked Posts" heading to be present
    expect(screen.getByText(/Liked Posts/i)).toBeInTheDocument();

    // Assert other elements if needed
    expect(screen.getByText("Test post 1")).toBeInTheDocument();
  });
});

//   test("renders 'your liked posts are listed here' when there are no liked posts", async () => {

//     jest.mock("../context/app-context", () => ({
//       __esModule: true,
//       default: jest.fn(),
//       useContext: jest.fn().mockReturnValue({
//         userData: {
//           user: {
//             id: "123",
//             email: "example@example.com",
//             user_metadata: {
//               first_name: "John",
//             },
//           },
//           session: {},
//         },
//         dimensions: { width: 800 },
//         allPostData: [],
//         prflpic: [],
//       }),
//     }));

//     render(
//       <MemoryRouter>
//         <Likes />
//       </MemoryRouter>
//     );

//     // Wait for the loading to complete
//     await waitFor(() => screen.getByText("Liked Posts"));

//     // Assert that the message for no liked posts is displayed
//     expect(
//       screen.getByText("your liked posts are listed here")
//     ).toBeInTheDocument();
//   });

//   test("redirects to '/' when user is not logged in", async () => {
//     // Mock the context to have no user data (user not logged in)
//     jest.mock("../context/app-context", () => ({
//       __esModule: true,
//       default: jest.fn(),
//       useContext: jest.fn().mockReturnValue({
//         userData: { user: {} },
//         dimensions: { width: 800 },
//         allPostData: [],
//         prflpic: [],
//       }),
//     }));

//     render(
//       <MemoryRouter>
//         <Likes />
//       </MemoryRouter>
//     );

//     // Wait for the redirect to complete
//     await waitFor(() => expect(screen.queryByText("Liked Posts")).toBeNull());

//     // Assert that the user is redirected to '/'
//     expect(screen.queryByText("Login")).toBeInTheDocument(); // Update with your home page text
//   });

// Add more test cases as needed to cover different scenarios and interactions
