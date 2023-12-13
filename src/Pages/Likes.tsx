import React, { useEffect, useState, useContext } from "react";
import PostCard from "../Components/PostCard";
import { useNavigate } from "react-router";
import SideNavBar from "../Components/SideNavBar";
import AppContext from "../context/app-context";
import { Circles } from "react-loader-spinner";
import { allData } from "../types";

const Likes = () => {
  const { userData, dimensions, allPostData, prflpic } = useContext(AppContext);

  const [loadingPost, setLoadingPost] = useState<boolean>(false);
  const [smallScreen, setSmallScreen] = useState<boolean>(
    dimensions.width < 600
  );
  const [bookmarked, setBookmarked] = useState<allData[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (dimensions.width > 780) {
      navigate("/Navbar");
    }
  }, [dimensions.width > 780]);

  useEffect(() => {
    setLoadingPost(true);
    if (!userData.user.id) {
      navigate("/", { replace: true });
      return;
    } else {
      if (allPostData && userData.user.id) {
        const user_id = userData.user.id;
        const bookmarkPosts = allPostData.filter((item: allData) => {
          // Explicitly assert that item.bookmarks is an array of strings
          // since ts not recognising the type defined in supabase;
          const bookmarksArray = item.likes as string[];
          const isBookmarked = bookmarksArray.includes(user_id);
          return isBookmarked;
        });

        setBookmarked(bookmarkPosts);
      }
    }
    setLoadingPost(false);
  }, [userData, allPostData]);

  useEffect(() => {
    if (dimensions.width < 600) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  }, [dimensions]);

  useEffect(() => {
    if (!smallScreen && isOpen) {
      setIsOpen(false);
    }
  }, [smallScreen, isOpen]);

  return (
    <>
      {loadingPost ? (
        <div className="absolute h-full w-full flex items-center justify-center">
          <Circles color="black" width={"20px"} height={"20px"} />
        </div>
      ) : (
        <div
          className="lg:mx-20 flex flex-row gap-1 align-middle justify-center w-full"
          style={{ height: "80vh" }}
        >
          {smallScreen && (
            <div className="w-full absolute flex bottom-0">
              <SideNavBar />
            </div>
          )}
          <div className="lg:mt-1 w-full flex flex-col items-start justify-start ">
            <div className="bg-opacity-50 w-full rounded-lg backdrop-blur-md">
              <h1 className="text-xl font-semibold p-4">Liked Posts</h1>
            </div>
            {bookmarked?.length === 0 ? (
              <div className=" h-full w-full flex items-center justify-center">
                your liked posts are listed here
              </div>
            ) : (
              <div
                className="w-full overflow-y-auto h-full p-4 scroll-smooth mt-2"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#dddddd #ffffff",
                  scrollBehavior: "smooth",
                }}
              >
                {bookmarked?.map((item) => {
                  {
                    const prfl = prflpic.filter((items) => {
                      if (items.user_id === item.created_by) {
                        return items.profile;
                      }
                    });
                    const img = prfl[0]?.profile;
                    return (
                      <PostCard
                        key={item.post_id}
                        caption={item.content}
                        post_id={item.post_id}
                        likes={item.likes}
                        bookmarks={item.bookmarks}
                        creator_id={item.created_by}
                        created_at={item.created_at}
                        imageSrc={img}
                      />
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Likes;
