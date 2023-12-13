import React, { useState, useContext, useEffect, useRef } from "react";
import AppContext from "../context/app-context";
import { Circles } from "react-loader-spinner";
import SideNavBar from "./SideNavBar";
import { useNavigate } from "react-router";
import { insertData } from "../api/insert";
import { allData } from "../types";
import { toast } from "react-hot-toast";
import { getAll } from "../api/getAll";

const CreatePost: React.FC = () => {
  const { userData, dimensions, setAllPostData, allPostData } =
    useContext(AppContext);
  const [loading, setloading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();

  const [smallScreen, setSmallScreen] = useState<boolean>(
    dimensions.width < 600
  );

  useEffect(() => {
    if (dimensions.width > 780) {
      navigate("/Navbar");
    }
  }, [dimensions.width > 780]);

  // const handleTextArea = (val: string) => {
  //   setPostText(val);
  // };
  // if (mutationLoading || mutationError) {
  //   return;
  // }
  // if (image) {
  //   const bucketName = "socialmedia-content";
  //   const filePath = `posts/${image.name}`;
  //   await uploadFile(bucketName, filePath, image);
  // }
  // if (uploadResponse) {

  const handlePostSubmit = async () => {
    const inputText = inputRef?.current?.value;
    const userId = userData.user.id;
    const content = inputText;
    try {
      if (content && userId) {
        setloading(true);

        // Await the result of insertData
        await insertData("post", [{ created_by: userId, content: content }]);

        const getAllPostData = async () => {
          try {
            const allPosts = await getAll("post");
            const sorted = allPosts?.sort((a, b) => {
              // strings to Date object
              const dateA = a.created_at ? new Date(a.created_at) : null;
              const dateB = b.created_at ? new Date(b.created_at) : null;

              // Comparing dates
              if (dateA instanceof Date && dateB instanceof Date) {
                return dateB.getTime() - dateA.getTime();
              } else if (dateA instanceof Date) {
                return -1;
              } else if (dateB instanceof Date) {
                return 1;
              } else {
                return 0;
              }
            });
            if (allPosts !== null) {
              setAllPostData(sorted);
            }
          } catch (error) {
            toast.error("Error while getting post data");
          }
        };
        getAllPostData();
        inputRef.current.value = "";

        setloading(false);
      }
    } catch (error) {
      toast.error("post not created");
    }
  };

  return (
    <>
      {smallScreen && (
        <div className="w-full absolute flex bottom-0">
          <SideNavBar />
        </div>
      )}
      <div className="md:w-full w-[50vh] mx-auto mt-10 p-4 shadow-lg shadow-gray-200 bg-white rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
        <textarea
          className="resize-none w-full h-20 p-2 mb-4 border border-gray-200 bg-gray-50 bg-opacity-50 rounded-lg"
          placeholder="Write your post..."
          ref={inputRef}
          // onChange={(e) => handleTextArea(e.target.value)}
        ></textarea>
        <div className="flex justify-between items-center mb-4">
          <button
            className="text-sm w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg "
            onClick={handlePostSubmit}
          >
            {loading ? (
              <div className="flex justify-center align-middle gap-3">
                <p>Uploading</p>
                <Circles color="white" width={"20px"} height={"20px"} />
              </div>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
