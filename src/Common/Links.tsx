import React from "react";
import CreatePost from "../Components/CreatePost";
import Profile from "../Components/ProfileComp/Profile";
import AuthPage from "../Pages/AuthPage";
import Home from "../Pages/Home";
import Navbar from "../Components/Navbar";
import Posts from "../Pages/Posts";
import Bookmarks from "../Pages/Bookmarks";
import Likes from "../Pages/Likes";

export const Links = [
  {
    name: "Navbar",
    path: "/Navbar",
    element: <Navbar />,
    showInNavigation: true,
  },
  {
    name: "Home",
    path: "/Home",
    element: <Home />,
    showInNavigation: true,
  },
  {
    name: "AuthPage",
    path: "/",
    element: <AuthPage />,
    showInNavigation: true,
  },
  {
    name: "CreatePost",
    path: "/Post",
    element: <CreatePost />,
    showInNavigation: true,
  },
  {
    name: "Profile",
    path: "/Profile",
    element: <Profile />,
    showInNavigation: true,
  },
  {
    name: "Posts",
    path: "/Posts",
    element: <Posts />,
    showInNavigation: true,
  },
  {
    name: "Bookmarks",
    path: "/Bookmarks",
    element: <Bookmarks />,
    showInNavigation: true,
  },
  {
    name: "Likes",
    path: "/Likes",
    element: <Likes />,
    showInNavigation: true,
  },
];
