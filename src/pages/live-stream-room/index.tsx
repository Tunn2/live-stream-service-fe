import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import {
  Card,
  Button,
  Form,
  Input,
  List,
  Avatar,
  Typography,
  Row,
  Col,
  Badge,
  Skeleton,
  Modal,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import Hls from "hls.js";
import { useNavigate, useParams } from "react-router-dom";
import LikeButton from "../../components/like-button";
import ShareButton from "../../components/share-button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import Title from "antd/es/typography/Title";

const { Text } = Typography;
const socket = io("http://localhost:4000");

const LiveStream = () => {
  const user = useSelector((store) => store.user);
  const { id: roomId } = useParams();
  const liveVideoRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [viewersCount, setViewersCount] = useState(0);
  const messageEndRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpenStop, setIsOpenStop] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    // Tham gia vào room theo roomId
    socket.emit("join_room", roomId);

    // Lắng nghe số lượng người xem
    socket.on("viewers_count", (count) => {
      setViewersCount(count);
    });

    // Lắng nghe tin nhắn mới trong room
    socket.on("new_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Khi rời khỏi room
      socket.emit("leave_room", roomId);
      socket.off("viewers_count");
      socket.off("new_message");
    };
  }, [roomId]);

  const handleGetStream = async () => {
    try {
      const response = await api.get(`streams/${roomId}`);
      if (response.data.data.endedAt !== null) {
        navigate("/error");
      }
      setStream(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stream:", error);
      toast.error("Could not load the stream.");
    }
  };

  useEffect(() => {
    handleGetStream();
  }, []);

  const stopStream = () => {
    setStreaming(false);
    socket.emit("disconnect");
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Re-run the effect when 'messages' changes

  const sendMessage = () => {
    try {
      if (message?.trim()) {
        const newMessage = {
          text: message,
          sender: "You", // Replace with the actual sender name if needed
        };
        socket.emit("send_message", {
          roomId,
          message: newMessage,
          userId: user._id,
        });
        setMessage(""); // Clear input field
      }
    } catch (error) {
      toast.error("Please sign in");
    }
  };

  const handleStopStream = async () => {
    setIsOpenStop(true);
    setLoading(true);
    if (user?.id === stream?.userId) {
      try {
        const response = await api.post(`streams/end/${roomId}`);
        setLoading(false);
        toast.success("Stop stream successfully");
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const loadLiveStream = () => {
    if (!stream || !stream.streamUrl) {
      console.error("Stream URL is not available.");
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(stream.streamUrl);
      hls.attachMedia(liveVideoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        liveVideoRef.current.play();
        setLoading(false);
      });
    } else if (
      liveVideoRef.current.canPlayType("application/vnd.apple.mpegurl")
    ) {
      liveVideoRef.current.src = stream.streamUrl;
      liveVideoRef.current.play();
      setLoading(false);
    }
  };

  const saveStream = async () => {
    try {
      const response = await api.post(`/streams/save/${roomId}`);
      console.log("Stream saved:", response.data);
    } catch (error) {
      console.error("Failed to save stream:", error?.response || error);
    }
  };

  useEffect(() => {
    if (stream) {
      loadLiveStream();
      saveStream();

      const interval = setInterval(() => {
        loadLiveStream();
        saveStream();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [stream]);

  // useEffect(() => {
  //   window.addEventListener("beforeunload", function (e) {
  //     handleStopStream();
  //   });
  // });

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const handleUnload = () => {
      handleStopStream();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  return (
    <div style={{ padding: "24px", backgroundColor: "#f0f2f5" }}>
      <Row gutter={[24, 24]}>
        {/* Camera Stream Section */}
        <>
          <Col xs={12} sm={24} md={12}>
            <Card
              title="Live Stream"
              bordered={false}
              style={{
                marginBottom: "24px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <video
                ref={liveVideoRef}
                autoPlay
                muted
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              />
              {viewersCount} watching
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                {user?._id === stream?.userId ? (
                  <Button
                    type="primary"
                    onClick={() => setIsOpenStop(true)}
                    style={{ width: "100%" }}
                    danger
                  >
                    Stop Stream
                  </Button>
                ) : (
                  <></>
                )}
                <Modal
                  open={isOpenStop}
                  title="Do you want to stop?"
                  onCancel={() => setIsOpenStop(false)}
                  footer={
                    <>
                      <Button onClick={() => setIsOpenStop(false)}>No</Button>
                      <Button
                        type="primary"
                        danger
                        onClick={() => handleStopStream()}
                        loading={loading}
                      >
                        Yes
                      </Button>
                    </>
                  }
                >
                  This action will stop your stream
                </Modal>
              </div>
            </Card>
          </Col>
        </>

        {/* Live Stream Section */}
        {/* <Col xs={24}>
          <Card
            title="Live Stream"
            bordered={false}
            style={{
              marginBottom: "24px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            {loading ? (
              <Skeleton active />
            ) : (
              <video
                ref={liveVideoRef}
                autoPlay
                style={{
                  width: "100%",
                  maxWidth: "720px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              />
            )}
            <Badge
              count={viewersCount}
              style={{
                backgroundColor: "#52c41a",
                marginTop: "12px",
                marginRight: "-28px",
                textAlign: "center",
                width: "100%",
              }}
            >
              <Text type="secondary">Viewers</Text>
            </Badge>
          </Card>
          <Title level={4} style={{ textAlign: "center", marginTop: "12px" }}>
            {stream?.title}
          </Title>
        </Col> */}
        <Col xs={12}>
          <Card
            title="Comments"
            bordered={false}
            style={{
              marginBottom: "24px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <List
              dataSource={messages}
              renderItem={(item) => (
                <List.Item key={item.id} ref={messageEndRef}>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<Text strong>{item.sender}:</Text>}
                    description={item.text}
                  />
                </List.Item>
              )}
              style={{
                marginBottom: "16px",
                height: "300px",
                overflowY: "scroll",
              }}
            />
            <Form
              onFinish={sendMessage}
              layout="inline"
              style={{ width: "100%" }}
            >
              <Form.Item style={{ flexGrow: 1 }}>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn"
                  onPressEnter={sendMessage} // Nhấn Enter để gửi tin nhắn
                  style={{ marginBottom: "10px" }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Send
                </Button>
              </Form.Item>
            </Form>
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {/* <LikeButton isLiked={like} /> */}
              <ShareButton />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Comments Section */}
    </div>
  );
};

export default LiveStream;
