import React, { useContext, useEffect, useState, useRef } from "react";
import { FaUser } from "react-icons/fa";
import AppContext from "../../context/app-context";
import { useNavigate } from "react-router";
import SideNavBar from "../SideNavBar";
import { Modal } from "antd";
import { toast } from "react-hot-toast";
import { updateImg } from "../../api/update";
import { CgProfile } from "react-icons/cg";
import useFileUpload from "../../hooks/useFileUpload";

const Profile: React.FC = () => {
  const {
    userData,
    setUserData,
    dimensions,
    allPostData,
    prflpic,
    setPrflpic,
  } = useContext(AppContext);
  const [postCount, setPostCount] = useState<number>(0);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | "">("");
  const [editName, setEditName] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [smallScreen, setSmallScreen] = useState<boolean>(
    dimensions.width < 600
  );

  const { uploadFile, uploadResponse, isUploading } = useFileUpload();

  useEffect(() => {
    const posts = allPostData;
    let count = 0;
    posts?.map((item) => {
      if (item.created_by === userData.user.id) {
        count++;
      }
    });
    setPostCount(count);

    // getting the user ptofile image
    let prf: string | null = null;
    let username: string | null = null;
    for (const item of prflpic) {
      if (item.user_id === userData.user.id) {
        prf = item.profile;
        username = item.username;
      }
    }
    setImageSrc(prf);
    setUserName(username);
  }, [allPostData, userData, prflpic]);

  useEffect(() => {
    if (dimensions.width > 780) {
      navigate("/Navbar");
    }
  }, [dimensions.width > 780]);

  const setImage = async () => {
    try {
      if (userData.user.id) {
        await updateImg(
          "users",
          "user_id",
          userData.user.id,
          "profile",
          uploadResponse
        );
        setPrflpic((prev) => {
          const newArr = [...prev];
          for (const item of newArr) {
            if (item.user_id === userData.user.id) {
              if (typeof uploadResponse === "string") {
                item.profile = uploadResponse;
              }
            }
          }
          return newArr;
        });
      }
    } catch (error) {
      toast.error("upload error");
    }
  };

  useEffect(() => {
    if (uploadResponse) {
      setImage();
    }
  }, [uploadResponse]);

  // uploading image and updating text
  //inside handleOk used uploadFile function provided by fileupload hook and then on url got from image upload
  //is stored in the database vai useEffect which listen to uploadResponse
  // and called setImage to set image in user table.

  const handleOk = async () => {
    setConfirmLoading(true);
    if (selectedImage) {
      const bucketName = "socialmedia-content";
      const filePath = `profile/${selectedImage.name}`;
      await uploadFile(bucketName, filePath, selectedImage);
    }
    if (editName) {
      try {
        if (userData.user.id) {
          await updateImg(
            "users",
            "user_id",
            userData.user.id,
            "username",
            editName
          );
          setPrflpic((prev) => {
            const newArr = [...prev];
            for (const item of newArr) {
              if (item.user_id === userData.user.id) {
                item.username = editName;
              }
            }
            return newArr;
          });
        }
      } catch (error) {
        toast.error("name not updated");
      }
    }

    setEditName("");

    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleFileChange = (file: File) => {
    setSelectedImage(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleImageContainerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage("");
  };

  return (
    <>
      <Modal
        title="Edit Profile"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "#4299f9" },
        }}
      >
        <input
          type="text"
          placeholder="Enter name here"
          className="w-full"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        ></input>

        {/* File input for selecting image */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />

        {/* Drag and drop section */}
        <div
          ref={imageContainerRef}
          className="drag-drop-container p-4 border-2 border-dashed border-blue-500 text-center cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={handleImageContainerClick}
        >
          {selectedImage ? (
            <div>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="max-w-full max-h-48 mx-auto mb-4"
              />
              <button
                className="bg-red-500 text-white py-1 px-2 rounded"
                onClick={clearSelectedImage}
              >
                Clear Image
              </button>
            </div>
          ) : (
            <p>Drag & drop an image or click to select one</p>
          )}
        </div>
      </Modal>
      {smallScreen && (
        <div className="w-full absolute flex bottom-0">
          <SideNavBar />
        </div>
      )}
      <div className="flex flex-col align-middle justify-center md:w-1/3 w-2/3 mt-10 mx-auto p-4 text-center bg-opacity-70 shadow-lg shadow-gray-200">
        <div className="mb-4 w-full flex justify-center">
          {imageSrc ? (
            <div className="rounded-full w-[60px] h-[60px]">
              <img
                src={imageSrc}
                alt="user image"
                className="w-full h-full rounded-full mb-2"
              />
            </div>
          ) : (
            <div className="w-[60px] h-[60px]">
              <CgProfile className="w-full h-full" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold">
          <span>
            <FaUser className="inline-block mr-2 text-lg" />
          </span>
          {userName}
          <p className="text-xs">{userData.user.email}</p>
        </h2>

        <div className="flex justify-center mt-4 gap-3">
          <div className="flex flex-1 p-1 flex-col items-center border-2 border-white rounded-lg ">
            <span className="font-semibold">{postCount}</span>
            <span className="text-gray-500">Posts</span>
          </div>
        </div>
        <div>
          <button
            onClick={() => setOpen(true)}
            className="bg-green-400 text-white rounded shadow-lg p-2 w-[80px]"
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
