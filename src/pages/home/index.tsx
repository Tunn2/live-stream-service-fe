import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  List,
  Avatar,
  Divider,
  Input,
  Button,
  Pagination,
} from "antd";
import axios from "axios"; // Import axios for making the API call
import stream from "../../../src/img/stream.jpg";
import stream1 from "../../../src/img/stream2.jpg";
import stream2 from "../../../src/img/stream3.jpg";
import stream3 from "../../../src/img/stream4.jpg";
import lienminhImg from "../../../src/img/lienminh.jpg";
import pubgImg from "../../../src/img/pubg.jpg";
import avatarImg from "../../../src/img/avarta.jpg";
import gtaImg from "../../../src/img/gta.jpg";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;
const { TextArea } = Input;

const categories = [
  { name: "Liên Minh", image: lienminhImg },
  { name: "PUBG", image: pubgImg },
  { name: "Avatar", image: avatarImg },
  { name: "GTA", image: gtaImg },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  interface Stream {
    _id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
  }
  const [streams, setStreams] = useState<Stream[]>([]);

  // Fetch live streams when the component mounts
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await api.get(
          `http://localhost:4000/api/streams?page=${currentPage}&isStreaming=true`
        );
        setStreams(response.data.data.streams); // Assuming the API response returns an array of streams
        setTotalPages(response.data.data.totalPages);
        console.log("Streams:", response.data.data);
      } catch (error) {
        console.error("Error fetching streams:", error);
      }
    };

    fetchStreams();
  }, [currentPage]);

  return (
    <Layout style={{ padding: "20px", gap: "20px" }}>
      {/* Categories Section */}
      <Sider width={240} style={{ background: "#fff" }}>
        <Title level={5} style={{ textAlign: "center", marginBottom: "16px" }}>
          Categories
        </Title>
        <List
          itemLayout="vertical"
          dataSource={categories}
          renderItem={(category) => (
            <List.Item style={{ textAlign: "center" }}>
              <Avatar
                shape="square"
                size={100}
                src={category.image}
                style={{
                  borderRadius: "8px",
                  transition: "transform 0.3s",
                  cursor: "pointer",
                }}
              />
              <Text style={{ display: "block", marginTop: "8px" }}>
                {category.name}
              </Text>
            </List.Item>
          )}
        />
      </Sider>

      {/* Main Content Section */}
      <Layout style={{ background: "#fff" }}>
        <Content style={{ marginBottom: "32px" }}>
          <img
            src={stream}
            alt="Featured Stream"
            style={{ width: "100%", borderRadius: "8px", marginBottom: "32px" }}
          />
        </Content>

        {/* Featured Streams Section */}
        <Content>
          <Title
            level={4}
            style={{ textAlign: "center", marginBottom: "32px" }}
          >
            Featured Streams
          </Title>
          <Row gutter={[16, 16]}>
            {streams.length > 0 ? (
              streams.map((stream, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={stream.title}
                        src={stream.thumbnailUrl} // Assuming each stream has an image URL
                        style={{ height: "200px", borderRadius: "8px" }}
                      />
                    }
                    onClick={() => {
                      navigate(`/room/${stream._id}`);
                    }}
                  >
                    <Meta
                      title={stream.title}
                      description={stream.description}
                    />
                  </Card>
                </Col>
              ))
            ) : (
              <Text>No streams available</Text>
            )}
          </Row>
          <Pagination
            align="center"
            defaultCurrent={currentPage}
            total={totalPages * 10}
            onChange={(page) => {
              setCurrentPage(page);
            }}
          />
        </Content>
      </Layout>

      {/* Chat Box Section */}
      <Sider width={300} style={{ background: "#fff" }}>
        <Title level={6} style={{ marginBottom: "16px" }}>
          Live Chat
        </Title>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f5f5f5",
            height: "442px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flexGrow: 1, padding: "16px", overflowY: "auto" }}>
            {/* Placeholder for chat messages */}
            <Text type="secondary">No messages yet.</Text>
          </div>
          <Divider />
          <div style={{ padding: "16px", display: "flex" }}>
            <TextArea
              rows={1}
              placeholder="Type a message"
              style={{ marginRight: "8px", borderRadius: "8px" }}
            />
            <Button
              type="default"
              style={{
                borderRadius: "8px",
                backgroundColor: "#909090",
                color: "white",
              }}
              hover={{ backgroundColor: "#707070" }}
            >
              Send
            </Button>
          </div>
        </div>
      </Sider>
    </Layout>
  );
};

export default HomePage;
