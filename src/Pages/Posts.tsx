import React, { useEffect, useState, useContext, useRef } from "react";
import {
  EditableProTable,
  ProCard,
  ProForm,
  ProTable,
  ActionType,
  EditableFormInstance,
  ProColumns,
  ProFormInstance,
} from "@ant-design/pro-components";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import AppContext from "../context/app-context";
import { allData } from "../types";
import { getAll } from "../api/getAll";
import { Circles } from "react-loader-spinner";
import SideNavBar from "../Components/SideNavBar";

export type TableListItem = {
  id: React.Key | number;
  name: string | undefined;
  likes: number | undefined;
  bookmarks: number | undefined;
  creator: string | undefined;
  createdAt: string | undefined;
  postId: string | undefined;
};

export type commentData = {
  id: React.Key | number;
  date: string | undefined;
  name: string | undefined;
  upgradeNum: string | undefined;
};

const Posts = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const formRef = useRef<ProFormInstance<any>>();
  const actionRef = useRef<ActionType>();
  const editableFormRef = useRef<EditableFormInstance>();
  const { userData, dimensions, allPostData, prflpic } = useContext(AppContext);
  const [loadingPost, setLoadingPost] = useState<boolean>(true);
  const [allPostComments, setAllComments] = useState<allData[] | null>(null);
  const [tableListDataSource, setTableListDataSource] = useState<
    TableListItem[]
  >([]);
  const navigate = useNavigate();
  const [smallScreen, setSmallScreen] = useState<boolean>(
    dimensions.width < 600
  );
  useEffect(() => {
    if (dimensions.width < 600) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  }, [dimensions]);
  useEffect(() => {
    if (dimensions.width > 780) {
      navigate("/Navbar");
    }
  }, [dimensions.width > 780]);
  useEffect(() => {
    if (!userData.user.id) {
      navigate("/", { replace: true });
      return;
    } else {
      let num = 0;
      if (allPostData && userData.user.id) {
        const myPosts = allPostData.filter(
          (items: allData) => items.created_by === userData.user.id
        );
        const newArr = [];
        for (const item of myPosts) {
          const creatorData = prflpic.filter(
            (val) => item.created_by === val.user_id
          )[0];
          newArr.push({
            id: num,
            name: item.content,
            creator: creatorData.username,
            likes: item?.likes?.length,
            bookmarks: item?.bookmarks?.length,
            createdAt: item.created_at,
            postId: item.post_id,
          });
          num++;
        }
        setTableListDataSource(newArr);
      }
      setLoadingPost(false);
    }
  }, [userData, allPostData]);

  useEffect(() => {
    const getAllCommentData = async () => {
      try {
        const allComments = await getAll("comments");
        setAllComments(allComments);
      } catch (error) {
        toast.error("Error while getting post data");
      }
    };
    getAllCommentData();
  }, []);

  const expandedRowRender = (id: string | undefined) => {
    const data: commentData[] = [];
    allPostComments?.map((item, index: React.Key) => {
      if (item.post_id === id) {
        data.push({
          id: index,
          date:
            new Date("2023-12-11T08:03:50.753623+00:00").toLocaleDateString(
              "en-US"
            ) +
            " " +
            new Date("2023-12-11T08:03:50.753623+00:00").toLocaleTimeString(
              "en-US"
            ),
          name: item.content,
          upgradeNum: item.post_id,
        });
      }
    });
    return (
      <ProTable
        columns={[
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Content", dataIndex: "name", key: "name" },
          {
            title: "Action",
            dataIndex: "operation",
            key: "operation",
            valueType: "option",
            render: () => [
              <a className="mr-3 text-green-400" key="Pause">
                Edit
              </a>,
              <a className="text-red-400" key="Stop">
                Delete
              </a>,
            ],
          },
        ]}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={data}
        pagination={false}
      />
    );
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: "Name",
      dataIndex: "name",
      valueType: "text",
      ellipsis: true,
    },
    {
      title: "Total Likes",
      dataIndex: "likes",
      valueType: "digit",
    },
    {
      title: "Total bookmarks",
      dataIndex: "bookmarks",
      valueType: "digit",
    },

    {
      title: "Actions",
      valueType: "option",
      render: (_, row) => [
        <a
          key="delete"
          className="text-red-500"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue(
              "table"
            ) as TableListItem[];
            formRef.current?.setFieldsValue({
              table: tableDataSource.filter((item) => item.id !== row?.id),
            });
          }}
        >
          Delete
        </a>,
        <a
          className="text-green-500"
          key="edit"
          onClick={() => {
            actionRef.current?.startEditable(row.id);
          }}
        >
          Edit
        </a>,
        <a className="text-pink-500" key="Like">
          Like
        </a>,
      ],
    },
  ];

  return (
    <ProCard>
      {loadingPost ? (
        <div className="h-[10px] w-full flex items-center justify-center gap-2">
          <p className="text-xs">Loading posts</p>
          <Circles color="black" width={"10px"} height={"10px"} />
        </div>
      ) : (
        <div className="w-full m-auto flex align-middle justify-center h-[90vh]">
          {smallScreen && (
            <div className="w-full absolute flex bottom-0">
              <SideNavBar />
            </div>
          )}
          <ProForm<{
            table: TableListItem[];
          }>
            formRef={formRef}
            initialValues={{
              table: tableListDataSource,
            }}
          >
            <EditableProTable<TableListItem>
              rowKey="id"
              scroll={{
                x: true,
              }}
              pagination={{
                showQuickJumper: true,
                pageSizeOptions: ["10", "20", "50"],
                defaultPageSize: 10,
              }}
              editableFormRef={editableFormRef}
              controlled
              actionRef={actionRef}
              formItemProps={{
                label: "Your Posts",
                rules: [
                  {
                    validator: async (_, value) => {
                      if (value.length < 1) {
                        throw new Error("Please add at least one element");
                      }

                      if (value.length > 5) {
                        throw new Error("Up to five elements can be set up");
                      }
                    },
                  },
                ],
              }}
              maxLength={10}
              name="table"
              columns={columns}
              recordCreatorProps={{
                record: (index) => {
                  return {
                    id: (index + 1).toString(),
                    name: "Default Name",
                    likes: 0,
                    bookmarks: 0,
                    containers: 0,
                    creator: "",
                    createdAt: "",
                    postId: "",
                  };
                },
              }}
              editable={{
                type: "multiple",
                editableKeys,
                onChange: setEditableRowKeys,
              }}
              expandable={{
                expandedRowRender: (record) => expandedRowRender(record.postId),
              }}
            />
          </ProForm>
        </div>
      )}
    </ProCard>
  );
};

export default Posts;
