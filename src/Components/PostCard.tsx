import React, { useState, useEffect, useContext } from "react";
import AppContext from "../context/app-context";
import {
  FaRegHeart,
  FaHeart,
  FaSave,
  FaRegSave,
  FaCommentAlt,
} from "react-icons/fa";
import { Circles } from "react-loader-spinner";
import ProCard from "@ant-design/pro-card";
import { Modal } from "antd";
import { insertData } from "../api/insert";
import { getAll } from "../api/getAll";
import { allData } from "../types";
import { updateData } from "../api/update";
import { deleteData } from "../api/delete";
import { toast } from "react-hot-toast";
import { CgProfile } from "react-icons/cg";

interface Props {
  imageSrc?: string;
  caption?: string;
  likes?: string[];
  bookmarks?: string[];
  post_id?: string | "";
  created_at?: string;
  creator_id?: string;
  taggedUsers?: string[];
}

const PostCard: React.FC<Props> = ({
  imageSrc,
  caption,
  likes,
  bookmarks,
  post_id,
  creator_id,
  created_at,
}) => {
  const { userData, setAllPostData, allPostData } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarks, setIsBookmarks] = useState(false);
  const [userComment, setUserComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [currentComment, setCurrentComment] = useState<string | undefined>(
    undefined
  );
  const [currentPost, setCurrentPost] = useState<string | undefined>(undefined);
  const [loadingComments, setLoadingComments] = useState(false);
  const [allPostComments, setAllComments] = useState<allData[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (userData.user.id) {
      if (likes?.includes(userData.user.id)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
      if (bookmarks?.includes(userData.user.id)) {
        setIsBookmarks(true);
      } else {
        setIsBookmarks(false);
      }
    }
  }, [likes, bookmarks, userData]);

  const handleLikeNbookmark = async (val: string) => {
    let arr: string[] | undefined;
    if (val === "likes") {
      arr = likes;
    } else {
      arr = bookmarks;
    }
    if (userData.user.id) {
      if (arr?.includes(userData.user.id)) {
        const Arr = likes?.filter((item) => item !== userData.user.id);
        try {
          if (typeof post_id !== "undefined" && typeof Arr !== "undefined") {
            await updateData("post", "post_id", post_id, val, Arr);
          }
        } catch (error) {
          toast.error("not able to unlike the post at the moment");
        }
      } else {
        arr?.push(userData.user.id);
        try {
          if (typeof post_id !== "undefined" && typeof arr !== "undefined") {
            await updateData("post", "post_id", post_id, val, arr);
          }
        } catch (error) {
          toast.error("not able to like the post at the moment");
        }
      }
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    try {
      if (currentComment) {
        await updateData(
          "comments",
          "comment_id",
          currentComment,
          "content",
          editComment
        );
      }
      if (currentPost) {
        await updateData(
          "post",
          "post_id",
          currentPost,
          "content",
          editComment
        );
        setAllPostData((prev) => {
          if (!prev) {
            return prev;
          }
          const newArr = prev.map((item) => {
            if (item.post_id === currentPost) {
              return { ...item, content: editComment };
            }
            return item;
          });

          return newArr;
        });
      }
    } catch (error) {
      toast.error("comment not created");
    }

    setEditComment("");

    allPostComments?.map((item) => {
      if (item.comment_id === currentComment) {
        item.content = editComment;
      }
    });
    setOpenEdit(false);
    setConfirmLoading(false);
  };
  const handleDelete = async () => {
    setConfirmLoading(true);
    try {
      if (currentComment) {
        await deleteData("comments", "comment_id", currentComment);
        handleCommentData();
      }
      if (currentPost) {
        await deleteData("post", "post_id", currentPost);
        setAllPostData((prev) => {
          if (!prev) {
            return prev;
          }
          const newArr = prev.filter((item) => item.post_id !== currentPost);
          return newArr;
        });
      }
    } catch (error) {
      toast.error("comment not created");
    }

    setEditComment("");

    setOpenDelete(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const handleEditCancel = () => {
    setOpenEdit(false);
  };
  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleCommentData = async () => {
    setOpen(true);
    setLoadingComments(true);
    const getAllCommentData = async () => {
      try {
        const allComments = await getAll("comments");
        // geting all comments and filtering the matched post_id
        if (allComments !== null) {
          const filteredComents = allComments.filter(
            (item) => item.post_id === post_id
          );
          setAllComments(filteredComents);
        }
      } catch (error) {
        toast.error("Error while getting post data");
      }
      setLoadingComments(false);
    };
    getAllCommentData();
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userComment.length === 0) {
      toast.error("field is empty");
      return;
    }
    const insertComment = [
      {
        created_by: userData.user.id ? userData.user.id : undefined,
        post_id: post_id,
        content: userComment,
      },
    ];

    try {
      setLoadingComments(true);
      await insertData("comments", insertComment);
      handleCommentData();
      setLoadingComments(false);
    } catch (error) {
      toast.error("comment not created");
    }
    setUserComment("");
  };
  function getTimestampString(val: string) {
    const dateObject = new Date(val);
    const formattedTimestamp = dateObject.toLocaleString();
    return formattedTimestamp;
  }

  return (
    <ProCard className="w-full mx-auto border-2 rounded-lg mb-2 border-white shadow-lg shadow-gray-200">
      <Modal
        title="Edit here"
        open={openEdit}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleEditCancel}
        okButtonProps={{
          style: { backgroundColor: "#4299f9" },
        }}
      >
        <input
          type="text"
          placeholder="input here"
          className="w-full"
          value={editComment}
          onChange={(e) => setEditComment(e.target.value)}
        ></input>
      </Modal>
      <Modal
        title="Are you sure!"
        open={openDelete}
        onOk={handleDelete}
        confirmLoading={confirmLoading}
        onCancel={handleDeleteCancel}
        okButtonProps={{
          style: { backgroundColor: "#4299f9" },
        }}
      ></Modal>
      <Modal title="Title" open={open} onCancel={handleCancel} footer={null}>
        <form
          className="flex flex-col align-middle justify-center gap-2"
          onSubmit={(e) => addComment(e)}
        >
          <input
            type="text"
            placeholder="comment here"
            className="w-full"
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
          ></input>
          <button className="bg-blue-500 p-2 text-white rounded text-xs w-1/4 mb-3">
            Post
          </button>
        </form>
        {loadingComments ? (
          <div className="h-full w-full flex items-center justify-center">
            <Circles color="black" width={"20px"} height={"20px"} />
          </div>
        ) : (
          <div className="h-[440px] overflow-y-scroll">
            {allPostComments?.map((item) => (
              <div
                key={item.comment_id}
                className="flex flex-col align-middle justify-end"
              >
                <p>{item.content}</p>
                {item.created_by === userData.user.id ? (
                  <div className="flex gap-3">
                    <button
                      className="text-xs rounded text-green-400"
                      onClick={(e) => {
                        setCurrentComment(item.comment_id);
                        setOpenEdit(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs rounded text-red-400"
                      onClick={() => {
                        setCurrentComment(item.comment_id);
                        setOpenDelete(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>
      <div className="flex-col">
        <div className="flex h-full gap-9 justify-between">
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
          <p className="text-gray-700 mb-2 w-2/3">{caption}</p>
          <p className="text-gray-500 mb-2 text-xs italic w-1/6">
            {typeof created_at === "string"
              ? getTimestampString(created_at)
              : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1 gap-4 mb-2">
        {creator_id === userData.user.id ? (
          <div className="flex items-center justify-between mt-4 gap-2 mb-1">
            <button
              className="text-red-400 hover:text-blue-400"
              onClick={() => {
                setCurrentPost(post_id);
                setOpenDelete(true);
              }}
            >
              delete
            </button>
            <button
              className="text-green-400 hover:text-blue-400"
              onClick={(e) => {
                setCurrentPost(post_id);
                setOpenEdit(true);
              }}
            >
              edit
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mt-1 gap-4 mb-2"></div>
        )}
        <div className="flex items-center justify-end mt-1 gap-4 mb-2">
          <div className="flex items-center align-middle gap-1 border-2 bg-white w-18 h-8 md:p-2 p-1 rounded-lg border-white shadow-lg transform bottom-8 left-24 bg-opacity-80 backdrop-blur-md">
            {isLiked ? (
              <FaHeart
                className="text-red-500 cursor-pointer"
                onClick={() => {
                  setIsLiked(false);
                  handleLikeNbookmark("likes");
                }}
              />
            ) : (
              <FaRegHeart
                className="text-red-500 cursor-pointer "
                onClick={() => {
                  setIsLiked(true);
                  handleLikeNbookmark("likes");
                }}
              />
            )}
            <p className="text-gray-500">{likes?.length}</p>
          </div>
          <div
            className="flex items-center align-middle gap-1 border-2 bg-white w-18 h-8 md:p-2 p-1 rounded-lg border-white shadow-lg transform bottom-8 left-24 bg-opacity-80 backdrop-blur-md"
            onClick={handleCommentData}
          >
            <button className="text-blue-500"></button>
            <FaCommentAlt className="text-blue-500 cursor-pointer" />
            <p className="text-gray-500">5</p>
          </div>
          <div className="flex items-center align-middle gap-1 border-2 bg-white w-18 h-8 md:p-2 p-1 rounded-lg border-white shadow-lg transform bottom-8 left-24 bg-opacity-80 backdrop-blur-md">
            <button className="text-blue-500"></button>
            {isBookmarks ? (
              <FaSave
                onClick={() => {
                  handleLikeNbookmark("bookmarks");
                  setIsBookmarks(false);
                }}
                className="text-blue-500 cursor-pointer"
              />
            ) : (
              <FaRegSave
                onClick={() => {
                  handleLikeNbookmark("bookmarks");
                  setIsBookmarks(true);
                }}
                className="text-blue-500 cursor-pointer"
              />
            )}
            <p className="text-gray-500">{bookmarks?.length}</p>
          </div>
        </div>
      </div>
    </ProCard>
  );
};

export default PostCard;
