import React from "react";
import {
  RiHome2Line,
  RiArticleLine,
  RiInformationLine,
  RiAddCircleLine,
} from "react-icons/ri";
import { useNavigate } from "react-router";
import { FaRegHeart, FaRegSave } from "react-icons/fa";

interface NavigationItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navigationItems: NavigationItem[] = [
  { path: "/Home", icon: <RiHome2Line size={15} />, label: "Home" },
  { path: "/Post", icon: <RiAddCircleLine size={15} />, label: "Create" },
  { path: "/Posts", icon: <RiArticleLine size={15} />, label: "Posts" },
  { path: "/Profile", icon: <RiInformationLine size={15} />, label: "Profile" },
  { path: "/Likes", icon: <FaRegHeart size={14} />, label: "Likes" },
  { path: "/Bookmarks", icon: <FaRegSave size={14} />, label: "Bookmarks" },
];

const SideNavBar: React.FC = () => {
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav
      style={{ zIndex: "100" }}
      className={
        "mb-2 w-96 rounded-lg mx-auto border-white border shadow-lg bg-blue-100 transform bg-opacity-50 backdrop-blur-md"
      }
    >
      <ul className="flex gap-3 p-2 justify-center align-middle ">
        {navigationItems.map((item) => (
          <li
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className="text-sm cursor-pointer p-2 bg-opacity-50 hover:text-blue-500 rounded-lg transition-all"
          >
            <div className="flex flex-col gap-1 justify-center align-middle">
              <div className="mx-auto w-3">{item.icon}</div>
              <div>
                <p style={{ fontSize: "0.7em" }}>{item.label}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideNavBar;
