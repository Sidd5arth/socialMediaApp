import React, { useState, useContext, useEffect } from "react";
import {
  HomeOutlined,
  UserOutlined,
  HeartOutlined,
  DiffOutlined,
  BookOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import AppContext from "../context/app-context";
import { useNavigate } from "react-router";
import { Layout, Menu, theme } from "antd";
import Home from "../Pages/Home";
import Profile from "./ProfileComp/Profile";
import Bookmarks from "../Pages/Bookmarks";
import Likes from "../Pages/Likes";
import Posts from "../Pages/Posts";
import { supabase } from "../SupabaseClient";
import { toast } from "react-hot-toast";
import { getData } from "../api/getAll";
const { Header, Content, Footer, Sider } = Layout;

const Navbar: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { userData, setUserData, setPrflpic, prflpic, dimensions } =
    useContext(AppContext);
  const navigate = useNavigate();
  console.log(userData);
  useEffect(() => {
    if (dimensions.width < 780) {
      navigate("/Home");
    }
  }, [dimensions.width < 780]);
  useEffect(() => {
    const getImg = async () => {
      try {
        if (userData.user.id) {
          const imG = await getData("users");
          if (imG) {
            console.log(imG);
            setPrflpic(imG);
          }
        }
      } catch (error) {
        toast.error("profile pic not avilable");
      }
    };
    getImg();
  }, [userData]);
  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem("supabaseSession");
    navigate("/", { replace: true });
    setUserData({
      user: {
        id: null,
        email: undefined,
        user_metadata: {
          first_name: null,
        },
      },
      session: null,
    });
    if (error) {
      toast.error("something went wrong");
    }
  };
  const tabData = [
    { icn: HomeOutlined, name: "Home", component: <Home /> },
    { icn: HeartOutlined, name: "Likes", component: <Likes /> },
    { icn: BookOutlined, name: "Bookmark", component: <Bookmarks /> },
    { icn: DiffOutlined, name: "Posts", component: <Posts /> },
    { icn: UserOutlined, name: "Profile", component: <Profile /> },
    {
      icn: LogoutOutlined,
      name: "Logout",
      colorBgContainer: "red",
      component: (
        <div className="flex flex-col w-1/2 justify-center align-middle gap-3">
          <div>Your are logging out</div>
          <button
            className="text-sm cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg shadow-gray-300"
            onClick={handleLogOut}
          >
            Logout
          </button>
        </div>
      ),
    },
  ];
  const [clikedTab, setClickedTab] = useState<number>(1);

  const handleTabClick = ({ key }: { key: React.Key }) => {
    const clickedTab = key as string;
    console.log(clickedTab);
    setClickedTab(Number(clickedTab));
  };

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          style={{ padding: "1em", height: "100vh", marginTop: "4.6em" }}
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={handleTabClick}
        >
          {tabData.map((icon, index) => (
            <Menu.Item
              key={String(index + 1)}
              icon={React.createElement(icon.icn)}
            >
              {icon.name}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "white" }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              height: "85vh",
            }}
            className="flex align-middle justify-center w-full"
          >
            {tabData[clikedTab - 1].component}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ©2023 Created by siddharth
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Navbar;
