// import React from "react";
// import { render, screen } from "@testing-library/react";
// import { BrowserRouter } from "react-router-dom";
// import Posts from "../Pages/Posts";
// import AppContext from "../context/app-context";

// // Mock the useContext hook
// jest.mock("../context/app-context", () => ({
//   ...jest.requireActual("../context/app-context"),
//   __esModule: true,
//   default: jest.fn(),
// }));

// describe("Posts Component", () => {
//   // Define your mock data for testing
//   const mockUserData = {
//     user: {
//       id: "1",
//       email: "test@example.com",
//     },
//   };

//   const mockDimensions = {
//     width: 800,
//   };

//   const mockAllPostData = [
//     {
//       post_id: "1",
//       content: "Test post",
//       created_by: "1",
//       likes: [],
//       bookmarks: [],
//       created_at: "2023-01-01T12:00:00Z",
//     },
//   ];

//   const mockPrflpic = [
//     {
//       user_id: "1",
//       profile: "profile-image.jpg",
//     },
//   ];

//   it("renders Posts component correctly", () => {
//     // Mock the useContext values
//     (AppContext as jest.Mock).mockReturnValueOnce({
//       userData: mockUserData,
//       dimensions: mockDimensions,
//       allPostData: mockAllPostData,
//       prflpic: mockPrflpic,
//     });

//     render(
//       <BrowserRouter>
//         <Posts />
//       </BrowserRouter>
//     );

//     expect(screen.getByText("Your Posts")).toBeDefined();
//     expect(screen.getByText("Test post")).toBeDefined();
//   });

// });
