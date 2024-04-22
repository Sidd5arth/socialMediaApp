import React, { useState, useContext, useEffect, useRef } from "react";
import AppContext from "../context/app-context";
import { Circles } from "react-loader-spinner";
import SideNavBar from "./SideNavBar";
import { useNavigate } from "react-router";
import { insertData } from "../api/insert";
import { toast } from "react-hot-toast";
import { getAll } from "../api/getAll";
import { Modal } from "antd";
import { Button, message } from "antd";
import ImagePrompt from "./PromptComponent/ImagePrompt";
import CaptionPrompt from "./PromptComponent/CaptionPrompt";
import { IoIosAddCircle } from "react-icons/io";
import { updateImg } from "../api/update";
import useFileUpload from "../hooks/useFileUpload";

const CreatePost: React.FC = () => {
  const { userData, dimensions, setAllPostData } = useContext(AppContext);
  const [loading, setloading] = useState(false);
  const [charCount, setCharCount] = useState<number>(0);
  const [textDisable, setTextDisable] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [image, setImage] = useState<File | null>();
  const [caption, setCaption] = useState<string>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const { uploadFile, uploadResponse, isUploading } = useFileUpload();

  const navigate = useNavigate();

  const [smallScreen, setSmallScreen] = useState<boolean>(
    dimensions.width < 600
  );

  useEffect(() => {
    if (dimensions.width > 780) {
      navigate("/Navbar");
    }
  }, [dimensions.width > 780]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedImage = event.target.files?.[0] || null;
    setImage(selectedImage);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setImage(droppedFile);
  };

  const handleImageContainerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const setPostToDatabase = async () => {
    try {
      if (userData.user.id && uploadResponse) {
        const payload = [
          {
            created_by: userData.user.id,
            creator_name: userData.user.user_metadata.first_name,
            content: caption,
            img_url: uploadResponse,
          },
        ];
        await insertData("post", payload);
      }
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
          toast.success("Post created!");
        } catch (error) {
          toast.error("Error while getting post data");
        }
      };
      getAllPostData();
      setCaption("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setImage(null);
      setloading(false);
    } catch (error) {
      toast.error("upload error");
    }
  };

  useEffect(() => {
    if (uploadResponse) {
      setPostToDatabase();
    }
  }, [uploadResponse]);

  const handlePostSubmit = async () => {
    const userId = userData.user.id;
    const content = caption;
    try {
      if (content && userId && image) {
        setloading(true);
        const bucketName = "socialmedia-content";
        const filePath = `posts/${image.name}`;
        await uploadFile(bucketName, filePath, image);
      } else {
        toast.error("Add both a caption and an Image to upload");
        setloading(false);
      }
    } catch (error) {
      toast.error("post not created");
    }
  };

  const handleCharCount = () => {
    if (inputRef?.current?.value !== undefined) {
      if (inputRef.current.value.length > 200) {
        setTextDisable(true);
      } else {
        setTextDisable(false);
      }
      setCaption(inputRef?.current?.value);
      setCharCount(inputRef?.current?.value.length);
    }
  };

  console.log(caption);

  return (
    <>
      {contextHolder}
      {smallScreen && (
        <div className="w-full absolute flex bottom-0">
          <SideNavBar />
        </div>
      )}
      <div className="md:w-full w-[80vw] mx-auto p-4 shadow-lg shadow-gray-200 bg-white rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
        {/* eslint-disable */}
        <div
          ref={imageContainerRef}
          className={`flex justify-center w-full items-center mb-4 h-56 bg-cover bg-center cursor-pointer bg-gray-50 bg-opacity-50 rounded-lg shadow-md ${
            !image ? "border-2 border-dotted border-gray-500" : ""
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleImageContainerClick}
          style={{
            backgroundImage: image
              ? `url('${URL.createObjectURL(image)}')`
              : "none",
          }}
        >
          {/* eslint-enable */}
          {!image && (
            <div className="flex flex-col items-center justify-center ">
              <IoIosAddCircle className="text-3xl text-gray-500" />
              <p className="text-gray-500 w-80 text-center p-2">
                Drag & Drop an image here or click to select one or Generate
                with AI
              </p>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <div className="position-relative w-full">
          <h3 className="text-gray-600">Write a caption</h3>
          <textarea
            // disabled={textDisable}
            value={caption ? caption : inputRef?.current?.value}
            onInput={handleCharCount}
            aria-label="textarea"
            className={`text-xs resize-none w-full h-20 p-2 mb-2 border bg-gray-50 bg-opacity-50 rounded-lg ${
              !textDisable ? "border-gray-200" : "border-red-500"
            }`}
            placeholder="Write Your Caption here..."
            ref={inputRef}
          ></textarea>
        </div>
        {/* ) : (
          <div className="flex justify-center items-center mb-4 h-80 bg-cover bg-center">
            <Circles color="black" width={"20px"} height={"20px"} />
          </div>
        )} */}
        <div className="flex w-full gap-2">
          <ImagePrompt setImage={setImage} />
          <CaptionPrompt setCaption={setCaption} />
        </div>
        <Button
          disabled={textDisable}
          type="primary"
          className="text-sm w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded-lg shadow-lg "
          onClick={() => handlePostSubmit()}
        >
          {loading ? (
            <div className="flex justify-center align-middle gap-3">
              <p>Uploading</p>
              <Circles color="white" width={"20px"} height={"20px"} />
            </div>
          ) : (
            "Post"
          )}
        </Button>
      </div>
    </>
  );
};

export default CreatePost;
