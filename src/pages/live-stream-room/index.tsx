// import React, { useRef, useState, useEffect } from "react";
// import io from "socket.io-client";
// import {
//   Card,
//   Button,
//   Form,
//   Input,
//   List,
//   Avatar,
//   Typography,
//   Row,
//   Col,
//   Badge,
//   Skeleton,
//   Modal,
//   Spin,
// } from "antd";
// import { CommentOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
// import Hls from "hls.js";
// import { useNavigate, useParams } from "react-router-dom";
// import LikeButton from "../../components/like-button";
// import ShareButton from "../../components/share-button";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import api from "../../configs/axios";
// import "./index.scss";

// const { Text } = Typography;
// const socket = io("http://localhost:4000");

// const LiveStream = () => {
//   const user = useSelector((store) => store.user);
//   const { id: roomId } = useParams();
//   const liveVideoRef = useRef(null);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [viewersCount, setViewersCount] = useState(0);
//   const messageEndRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isOpenStop, setIsOpenStop] = useState(false);
//   const [like, setLike] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const navigate = useNavigate();
//   const [currentDuration, setCurrentDuration] = useState(null);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [isFollowingLoading, setIsFollowingLoading] = useState(false);

//   const handleFollowUser = async () => {
//     if (!stream || !stream.userId) {
//       toast.error("Streamer information is unavailable.");
//       return;
//     }

//     const newIsFollowing = !isFollowing;
//     setIsFollowing(newIsFollowing);
//     setIsFollowingLoading(true);

//     try {
//       if (newIsFollowing) {
//         await api.put(`/users/follow/${user._id}/${stream.userId._id}`);
//         toast.success("Followed successfully");
//       } else {
//         await api.put(`/users/unfollow/${user._id}/${stream.userId._id}`);
//         toast.success("Unfollowed successfully");
//       }
//     } catch (error) {
//       console.error(error);
//       // Revert the state if the API call fails
//       setIsFollowing(!newIsFollowing);
//       toast.error("Failed to update follow status.");
//     } finally {
//       setIsFollowingLoading(false); // End loading
//     }
//   };

//   useEffect(() => {
//     // Tham gia vào room theo roomId
//     socket.emit("join_room", roomId);

//     // Lắng nghe số lượng người xem
//     socket.on("viewers_count", (count) => {
//       setViewersCount(count);
//     });

//     // Lắng nghe tin nhắn mới trong room
//     socket.on("new_message", (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       // Khi rời khỏi room
//       socket.emit("leave_room", roomId);
//       socket.off("viewers_count");
//       socket.off("new_message");
//     };
//   }, [roomId]);

//   const handleGetStream = async () => {
//     try {
//       const response = await api.get(`streams/${roomId}`);
//       if (response.data.data.endedAt !== null) {
//         navigate("/error");
//       }

//       setStream(response.data.data);
//       setLikeCount(response.data.data.likeBy.length);
//       setLike(response.data.data.likeBy.includes(user?._id));
//       setIsFollowing(response.data.data.userId.followBy.includes(user?._id))
//     } catch (error) {
//       console.error("Failed to fetch stream:", error);
//       toast.error("Could not load the stream.");
//     }
//   };

//   useEffect(() => {
//     handleGetStream();
//   }, []);

//   useEffect(() => {
//     if (messageEndRef.current) {
//       messageEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]); // Re-run the effect when 'messages' changes

//   const sendMessage = () => {
//     try {
//       if (message?.trim()) {
//         const newMessage = {
//           text: message,
//           sender: "You", // Replace with the actual sender name if needed
//         };
//         socket.emit("send_message", {
//           roomId,
//           message: newMessage,
//           userId: user._id,
//         });
//         setMessage(""); // Clear input field
//       }
//     } catch (error) {
//       toast.error("Please sign in");
//     }
//   };

//   const handleStopStream = async () => {
//     setIsOpenStop(true);
//     setLoading(true);
//     if (user?._id === stream?.userId?._id) {
//       try {
//         const response = await api.post(`streams/end/${roomId}`);
//         setLoading(false);
//         toast.success("Stop stream successfully");
//         navigate("/");
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   const loadLiveStream = () => {
//     if (!stream || !stream.streamUrl) {
//       console.error("Stream URL is not available.");
//       return;
//     }

//     if (Hls.isSupported()) {
//       const hls = new Hls();
//       hls.loadSource(stream.streamUrl);
//       hls.attachMedia(liveVideoRef.current);
//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         liveVideoRef.current.play();
//         setLoading(false);
//       });
//     } else if (
//       liveVideoRef.current.canPlayType("application/vnd.apple.mpegurl")
//     ) {
//       liveVideoRef.current.src = stream.streamUrl;
//       liveVideoRef.current.play();
//       setLoading(false);
//     }
//   };

//   const saveStream = async () => {
//     if (user?._id !== stream?.userId?._id) {
//       return;
//     }

//     try {
//       const response = await api.post(`/streams/save/${roomId}`);
//       console.log("Stream saved:", response.data);
//     } catch (error) {
//       console.error("Failed to save stream:", error?.response || error);
//     }
//   };

//   useEffect(() => {
//     if (stream) {
//       loadLiveStream();
//       saveStream();

//       const interval = setInterval(() => {
//         loadLiveStream();
//         saveStream();
//       }, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [stream]);

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       event.preventDefault();
//       event.returnValue = "";
//     };

//     const handleUnload = () => {
//       handleStopStream();
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     window.addEventListener("unload", handleUnload);

//     // Cleanup the event listener on component unmount
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       window.removeEventListener("unload", handleUnload);
//     };
//   }, []);

//   const handleSkipToEnd = () => {
//     const video = liveVideoRef.current;
//     if (video) {
//       const newTime = video.duration - 30;
//       if (newTime > 0) {
//         video.currentTime = newTime;
//       } else {
//         // If the video is less than 30 seconds, just play from the start
//         video.currentTime = 0;
//       }
//     }
//   };

//   // Function to handle video metadata loading
//   const handleLoadedMetadata = () => {
//     handleSkipToEnd();
//   };

//   const handleTimeUpdate = () => {
//     const video = liveVideoRef.current;
//     if (video) {
//       setCurrentDuration(video.currentTime);
//     }
//   };

//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };  

//   useEffect(() => {
//     const video = liveVideoRef.current;
  
//     const updateCurrentDuration = () => {
//       setCurrentDuration(video.currentTime);
//     };
  
//     if (video) {
//       video.addEventListener("timeupdate", updateCurrentDuration);
//     }
  
//     return () => {
//       if (video) {
//         video.removeEventListener("timeupdate", updateCurrentDuration);
//       }
//     };
//   }, [liveVideoRef]);

//   return (
//     <div className="live-stream-container">
//       <Row gutter={[24, 24]} style={{ height: "100%" }}>
//         {/* Camera Stream Section */}
//         <Col xs={24} sm={24} md={16} className="live-stream-wrapper">
//           <Card bordered={false} className="live-stream-card">
//             <div style={{ position: "relative" }}>
//               {/* Live Badge */}
//               <div className="live-badge">LIVE</div>
//               {/* Video Element */}
//               {loading ? (
//                 <Spin size="large" />
//               ) : (
//                 <video
//                   ref={liveVideoRef}
//                   autoPlay
//                   muted
//                   className="live-video"
//                   onLoadedMetadata={handleLoadedMetadata}
//                   onTimeUpdate={handleTimeUpdate}
//                 />
//               )}
//               {/* Viewers Count */}
//               <div className="viewers-count">
//                 <EyeOutlined /> {viewersCount} watching
//               </div>
//             </div>
            
//             <div className="stream-info">
//               <div className="streamer-avatar">
//                 <Avatar
//                   src={stream?.userId?.avatarUrl}
//                   icon={<UserOutlined />}
//                   alt={`${stream?.userId?.name}'s avatar`}
//                   onClick={() => {
//                     navigate(`/profile/${stream?.userId?._id}`);
//                   }}
//                   style={{ cursor: "pointer" }}
//                 />
//               </div>
//               <div className="stream-details">
//                 <p className="streamer-name">
//                   <span
//                     onClick={() => {
//                       navigate(`/profile/${stream?.userId?._id}`);
//                     }}
//                     style={{ fontWeight: 800, cursor: "pointer" }}
//                   >
//                     {stream?.userId?.name}
//                   </span>
//                 </p>
//                 <p className="stream-title">{stream?.title || "Title"}</p>
//               </div>
//               <div className="stream-button">
//                 {user?._id !== stream?.userId?._id &&(
//                   <Button
//                     type="primary"
//                     onClick={handleFollowUser}
//                     loading={isFollowingLoading}
//                   >
//                     {isFollowing ? "Followed" : "Follow"}
//                   </Button>
//                 )}
//                 <div style={{ textAlign: "center" }}>
//                   <p>{formatTime(currentDuration)}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="stop-stream-button">
//               {user?._id === stream?.userId?._id && (
//                 <>
//                   <Button
//                     type="primary"
//                     onClick={() => setIsOpenStop(true)}
//                     danger
//                   >
//                     Stop Stream
//                   </Button>
//                   <Modal
//                     open={isOpenStop}
//                     title="Do you want to stop?"
//                     onCancel={() => setIsOpenStop(false)}
//                     footer={
//                       <>
//                         <Button onClick={() => setIsOpenStop(false)}>No</Button>
//                         <Button
//                           type="primary"
//                           danger
//                           onClick={() => handleStopStream()}
//                           loading={loading}
//                         >
//                           Yes
//                         </Button>
//                       </>
//                     }
//                   >
//                     This action will stop your stream
//                   </Modal>
//                 </>
//               )}
//             </div>
//           </Card>
//         </Col>

//         <Col xs={24} sm={24} md={8} className="comments-wrapper">
//           <Card bordered={false} className="comments-card">
//             <div className="comments-list">
//               <List
//                 dataSource={messages}
//                 renderItem={(item) => (
//                   <List.Item key={item.id} ref={messageEndRef}>
//                     <List.Item.Meta
//                       avatar={
//                         <Avatar icon={<UserOutlined />} src={item.avatar} />
//                       }
//                       title={<Text strong>{item.sender}:</Text>}
//                       description={item.text}
//                       style={{ color: "white" }}
//                     />
//                   </List.Item>
//                 )}
//               />
//             </div>
//             <Form
//               onFinish={sendMessage}
//               layout="inline"
//               className="message-form"
//             >
//               <Form.Item style={{ flexGrow: 1 }}>
//                 <Input
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Type your message here"
//                   onPressEnter={sendMessage}
//                   className="message-input"
//                 />
//               </Form.Item>
//               <Form.Item>
//                 <button className="submit-button" htmlType="submit">
//                   <CommentOutlined />
//                 </button>
//               </Form.Item>
//             </Form>
//             <div className="interaction-buttons">
//               {stream && (
//                 <LikeButton
//                   streamId={stream._id}
//                   userId={user?._id}
//                   likeCount={likeCount}
//                   like={like}
//                 />
//               )}
//               <ShareButton />
//             </div>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default LiveStream;
