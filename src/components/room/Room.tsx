import {
  LiveKitRoom,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Container, Row, Col } from "react-bootstrap";
import api from "../../configs/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IngressInput } from "livekit-server-sdk";
import { Video } from "../video/Video";
import { toast } from "react-toastify";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useChatSidebar } from "../chat/use-chat-sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chat } from "../chat/chat";
import { ChatToggle } from "../chat/chat-toggle";
import { StreamerHeader } from "./stream-header";

const serverUrl = "wss://live-stream-platform-1kj7rddo.livekit.cloud";

export default function Room() {
  const user = useSelector((store) => store.user);
  const { id: streamId } = useParams();
  const [stream, setStream] = useState(null);
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  const { collapsed } = useChatSidebar((state) => state);

  useEffect(() => {
    handleGetViewerToken();
  }, []);

  const handleGetViewerToken = async () => {
    try {
      const response = await api.get(`/streams/${streamId}`);
      setStream(response.data.data);
      setLikeCount(response.data.data.likeBy.length);
      setLike(response.data.data.likeBy.includes(user?._id));

      const viewerToken = await api.get(
        `/viewer-token?streamId=${streamId}&userId=${user._id}&hostId=${response.data.data.userId._id}`
      );

      setToken(viewerToken.data);

      const decodedToken = jwtDecode(viewerToken.data) as JwtPayload & {
        name?: string;
      };
      const name = decodedToken?.name;
      const identity = decodedToken.jti;

      if (identity) {
        setIdentity(identity);
      }
      if (name) {
        setName(name);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div style={{ position: "relative", backgroundColor: "" }}>
      { collapsed && (
        <div className="position-absolute" style={{ right: "10px", top: "10px", zIndex: 1}}>
          <ChatToggle />
        </div>
      )}
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: "92vh" }}
      >
        <Container fluid className="h-100 p-0">
          <Row className="g-0 h-100">
            {/* Video Section */}
            <Col
              xs={12}
              lg={collapsed ? 12 : 8}
              xl={collapsed ? 12 : 9}
              className="overflow-auto h-100"
            >
              {stream && stream.userId && (
                <>
                  <Video
                    hostName={stream.userId.name}
                    hostIdentity={stream.userId._id}
                  />
                  <StreamerHeader 
                    hostName={stream.userId.name}
                    hostIdentity={stream.userId._id}
                    viewerIdentity={user._id}
                    avatarUrl={stream.userId.avatarUrl}
                    streamTitle={stream.title}
                    streamId={stream._id}
                    like={like}
                    likeCount={likeCount}
                  />
                </>
              )}
            </Col>

            {/* Chat Section */}
            <Col
              xs={12}
              lg={collapsed ? 0 : 4}
              xl={collapsed ? 0 : 3}
              className="h-100"
            >
              {stream && stream.userId && (
                <Chat
                  viewerName={user.name}
                  hostName={stream.userId.name}
                  hostIdentity={stream.userId._id}
                  isChatEnabled={true}
                  streamId={stream._id}
                />
              )}
            </Col>
          </Row>
        </Container>
      </LiveKitRoom>
    </div>
  );
}
