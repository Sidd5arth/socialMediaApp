import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
  RefObject,
} from "react";
import PostCard from "../Components/PostCard";
import CreatePost from "../Components/CreatePost";
import { useNavigate } from "react-router";
import { AiOutlineArrowRight } from "react-icons/ai";
import SideNavBar from "../Components/SideNavBar";
import AppContext from "../context/app-context";
import { Circles } from "react-loader-spinner";
import { allData } from "../types";
import { getAllPaginated } from "../api/getAll";
import { toast } from "react-hot-toast";
const Home = () => {
  const { userData, dimensions, prflpic, setAllPostData, allPostData } =
    useContext(AppContext);
  const [loadingPost, setLoadingPost] = useState<boolean>(false);
  const [allPost, setAllPost] = useState<allData[] | undefined>(undefined);
  const [range, setRange] = useState({ from: 0, to: 9 });
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [waitnext, setWaitnext] = useState(false);

  const [smallScreen, setSmallScreen] = useState<boolean>(
    dimensions.width < 600
  );
  const scrollableDivRef: RefObject<HTMLDivElement> = useRef(null);
  const navigate = useNavigate();
  const [paginationTrigger, setPaginationTrigger] = useState(false);
  useEffect(() => {
    setAllPostData(allPost);
  }, [allPost]);

  const getAllPostData = useCallback(async () => {
    try {
      setLoadingPost(true);
      const allPosts = await getAllPaginated("post", range.from, range.to);

      if (allPosts && allPosts?.length < 10) {
        setHasMorePosts(false);
      }

      setRange((prev) => ({
        from: prev.from + 10,
        to: prev.to + 10,
      }));

      if (allPosts !== null) {
        setAllPost((prev) => {
          if (prev) return [...prev, ...allPosts];
          else return allPosts;
        });
      }
    } catch (error) {
      toast.error("Error while getting post data");
    } finally {
      setLoadingPost(false);
    }
  }, [
    range.from,
    range.to,
    setAllPost,
    setHasMorePosts,
    setLoadingPost,
    toast,
  ]);

  //to trigger getpost api only when scroll is down - 10
  useEffect(() => {
    if (paginationTrigger) {
      getAllPostData();
      setPaginationTrigger(false);
    }
  }, [paginationTrigger, getAllPostData]);

  // checking is user logged in and triggering to get the post
  useEffect(() => {
    if (!userData.user.id) {
      navigate("/", { replace: true });
      return;
    }
    setPaginationTrigger(true);
  }, [userData]);

  // component like createPost should not be visible on mobile screen
  // because it takes extraspace on screen
  // this use effect is to remove it on small screen
  useEffect(() => {
    if (dimensions.width < 600) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  }, [dimensions]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableDivRef.current) {
        const { scrollTop, clientHeight, scrollHeight } =
          scrollableDivRef.current;

        if (
          scrollTop + clientHeight >= scrollHeight &&
          hasMorePosts &&
          !waitnext
        ) {
          setWaitnext(true);
          // Fetch more data when the user reaches the bottom
          setPaginationTrigger(true);
          //simulating debuncing
          setTimeout(() => {
            setWaitnext(false);
          }, 300);
        }
      }
    };

    // Attaching a scroll event listener to the ref
    if (scrollableDivRef.current) {
      scrollableDivRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      // Remove the scroll event listener when the componnet unmounts i.e A clean-up function
      if (scrollableDivRef.current) {
        scrollableDivRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMorePosts, getAllPostData]);

  return (
    <>
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
            <h1 className="text-xl font-semibold p-4">Explore Posts</h1>
          </div>
          {allPostData?.length === 0 ? (
            <div className="w-full mx-auto h-96 p-4 border border-gray-300 rounded-lg my-4 text-center relative">
              <h1>Create A Post</h1>
              <AiOutlineArrowRight className="text-2xl mt-2 absolute right-0 top-1/2 transform -translate-y-1/2" />
            </div>
          ) : (
            <div
              className="w-full overflow-y-auto h-full p-4 scroll-smooth mt-2"
              ref={scrollableDivRef}
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#dddddd #ffffff",
                scrollBehavior: "smooth",
              }}
            >
              {allPostData?.map((item) => {
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
          {loadingPost && (
            <div className="h-[10px] w-full flex items-center justify-center gap-2">
              <p className="text-xs">Loading posts</p>
              <Circles color="black" width={"10px"} height={"10px"} />
            </div>
          )}
        </div>
        {!smallScreen && (
          <div className="w-7/12 flex flex-col items-center justify-between py-1">
            <CreatePost />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
