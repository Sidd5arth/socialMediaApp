// import React, { useEffect, useState, useContext, useRef } from "react";
// import type {
//   ProColumns,
//   EditableFormInstance,
// } from "@ant-design/pro-components";
// import { EditableProTable } from "@ant-design/pro-components";
// import { ProTable } from "@ant-design/pro-components";
// import { useNavigate } from "react-router";
// import AppContext from "../context/app-context";
// import { allData } from "../types";
// import { getAll } from "../api/getAll";

// type Status = {
//   color: string;
//   text: string;
// };

// const statusMap = {
//   0: {
//     color: "blue",
//     text: "进行中",
//   },
//   1: {
//     color: "green",
//     text: "已完成",
//   },
//   2: {
//     color: "volcano",
//     text: "警告",
//   },
//   3: {
//     color: "red",
//     text: "失败",
//   },
//   4: {
//     color: "",
//     text: "未完成",
//   },
// };

// export type TableListItem = {
//   key: number;
//   name: string | undefined;
//   likes: number | undefined;
//   bookmarks: number | undefined;
//   containers: number;
//   creator: string | undefined;
//   status: Status;
//   createdAt: number;
// };

// export type commentData = {
//   key: number;
//   date: string | undefined;
//   name: string | undefined;
//   upgradeNum: string | undefined;
// };

// const tableListDataSource: TableListItem[] = [];

// const Posts = () => {
//   const { userData, dimensions, allPostData, prflpic } = useContext(AppContext);
//   const [loadingPost, setLoadingPost] = useState<boolean>(false);
//   const [myPosts, setMyPosts] = useState<allData[]>([]);
//   const [allPostComments, setAllComments] = useState<allData[] | null>(null);
//   const navigate = useNavigate();
//   const editableFormRef = useRef<EditableFormInstance>();

//   useEffect(() => {
//     setLoadingPost(true);
//     if (!userData.user.id) {
//       navigate("/", { replace: true });
//       return;
//     } else {
//       if (allPostData && userData.user.id) {
//         const myPosts = allPostData.filter(
//           (item: allData) => item.created_by === userData.user.id
//         );
//         setMyPosts(myPosts);
//       }
//     }
//     setLoadingPost(false);
//   }, [userData, allPostData]);

//   useEffect(() => {
//     const getAllCommentData = async () => {
//       try {
//         const allComments = await getAll("comments");
//         setAllComments(allComments);
//         console.log(allComments);
//       } catch (error) {
//         console.error("Error while getting post data", error);
//       }
//     };
//     getAllCommentData();
//   }, [allPostComments]);

//   useEffect(() => {
//     if (myPosts) {
//       myPosts.map((item) => {
//         const creatorData = prflpic.filter(
//           (val) => item.created_by === val.user_id
//         )[0];
//         tableListDataSource.push({
//           key: Number(item.post_id),
//           name: item.content,
//           containers: Math.floor(Math.random() * 20),
//           creator: creatorData.username,
//           likes: item?.likes?.length,
//           bookmarks: item?.bookmarks?.length,
//           status: statusMap[((Math.floor(Math.random() * 10) % 5) + "") as "0"],
//           createdAt: Date.now() - Math.floor(Math.random() * 100000),
//         });
//       });
//     }
//   }, [myPosts]);

//   const columns: ProColumns<TableListItem>[] = [
//     {
//       title: "Content",
//       width: 120,
//       dataIndex: "name",
//       render: (_) => <a>{_}</a>,
//     },
//     {
//       title: "Total Likes",
//       width: 120,
//       dataIndex: "likes",
//       render: (_) => <a>{_}</a>,
//     },
//     {
//       title: "Total Bookmarks",
//       width: 120,
//       dataIndex: "bookmarks",
//       render: (_) => <a>{_}</a>,
//     },
//     {
//       width: 120,
//       render: () => [
//         <a className="mr-3 text-pink-600" key="Pause">
//           like
//         </a>,
//         <a className="mr-3 text-green-400" key="Pause">
//           Edit
//         </a>,
//         <a className="text-red-400" key="Stop">
//           Delete
//         </a>,
//       ],
//     },
//   ];

//   const expandedRowRender = (id: string) => {
//     const data: commentData[] = [];
//     console.log(allPostComments);
//     allPostComments?.map((item) => {
//       if (item.post_id === id) {
//         data.push({
//           key: Number(item.comment_id),
//           date:
//             new Date("2023-12-11T08:03:50.753623+00:00").toLocaleDateString(
//               "en-US"
//             ) +
//             " " +
//             new Date("2023-12-11T08:03:50.753623+00:00").toLocaleTimeString(
//               "en-US"
//             ),
//           name: item.content,
//           upgradeNum: item.comment_id,
//         });
//       }
//     });

//     const nestedColumns: ProColumns<commentData>[] = [
//       { title: "Date", dataIndex: "date", key: "date" },
//       { title: "Name", dataIndex: "name", key: "name" },
//       {
//         title: "Action",
//         dataIndex: "operation",
//         key: "operation",
//         valueType: "option",
//         render: () => [
//           <a className="mr-3 text-green-400" key="Pause">
//             Edit
//           </a>,
//           <a className="text-red-400" key="Stop">
//             Delete
//           </a>,
//         ],
//       },
//     ];

//     return (
//       <EditableProTable<commentData>
//         columns={nestedColumns}
//         recordCreatorProps={{
//           record: () => ({
//             key: data.length + 1,
//             date: "2023-12-11T08:03:50.753623+00:00",
//             name: "",
//             upgradeNum: "",
//           }),
//         }}
//         editable={{
//           type: "multiple",
//           editableKeys: data.map((item) => item.key),
//           onChange: (keys) => {
//             const newData = data.map((item) => ({ ...item }));
//             newData.forEach((item) => {
//               if (!keys.includes(item.key)) {
//                 const index = newData.findIndex((i) => item.key === i.key);
//                 newData.splice(index, 1);
//               }
//             });
//             // Update the data in the state
//             // setYourState(newData);
//           },
//         }}
//       />
//     );
//   };

//   return (
//     <ProTable<TableListItem>
//       columns={columns}
//       className="w-full"
//       request={(params, sorter, filter) => {
//         console.log(params, sorter, filter);
//         return Promise.resolve({
//           data: tableListDataSource,
//           success: true,
//         });
//       }}
//       rowKey="key"
//       pagination={{
//         showQuickJumper: true,
//         pageSizeOptions: ["10", "20", "50"],
//         defaultPageSize: 10,
//       }}
//       expandable={{ expandedRowRender }}
//       search={false}
//       dateFormatter="string"
//       headerTitle="Your Posts"
//       options={false}
//     />
//   );
// };

// // export default Posts;
