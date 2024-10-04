import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  List,
  Button,
  Pagination,
  Avatar,
} from "antd";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import "./home.scss"; // Import the CSS file
import {
  CrownOutlined,
  EyeOutlined,
  FireOutlined,
  LikeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import stream from "../../img/stream.jpg";
const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

const HomePage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [topLikedStream, setTopLikedStream] = useState(null);
  const [categories, setCategories] = useState([]);
  const [topStreamers, setTopStreamers] = useState([]);
  interface Stream {
    _id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    currentViewCount: number;
    categories: string[];
    userId: { _id: string; name: string; avatarUrl: string };
  }

  const [streams, setStreams] = useState<Stream[]>([]);
  const ArraySize = (arr) => {
    if (!arr) {
      return 0;
    } else return arr.length;
  };

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await api.get(
          `streams?page=${currentPage}&size=${pageSize}&isStreaming=true`
        );

        setStreams(response.data.data.streams);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error("Error fetching streams:", error);
      }
    };

    fetchStreams();
  }, [currentPage, pageSize]);

  useEffect(() => {
    const fetchTopLikedStream = async () => {
      try {
        const cateRes = await api.get("/streams/categories");
        setCategories(cateRes.data.data);
      } catch (error) {
        console.error("Error fetching top-liked stream:", error);
      }
    };

    const fetchTopStreamers = async () => {
      try {
        const topStreamers = await api.get("users/topUser?top=5");
        setTopStreamers(topStreamers.data.data);
      } catch (error) {
        console.error("Error fetching top streamers", error);
      }
    };

    const fetchTopStream = async () => {
      try {
        const response = await api.get("/streams/top1?type=like");
        const topStream = Array.isArray(response.data)
          ? response.data[0] // If it's an array, use the first object
          : response.data; // Otherwise, use the object directly

        setTopLikedStream(topStream);
      } catch (error) {
        console.error("Error fetching top streamers", error);
      }
    };

    fetchTopStreamers();
    fetchTopStream();
    fetchTopLikedStream();
  }, []);

  return (
    <Layout className="layout">
      {/* Categories Section */}
      <Sider width={300} className="sider">
        <div className="top-section">
          <Title level={5} className="title-center3">
            TOP STREAMERS <CrownOutlined />
          </Title>
          <List
            itemLayout="vertical"
            dataSource={topStreamers}
            renderItem={(streamers) => (
              <List.Item
                className="list-item-streamers"
                onClick={() => navigate(`/profile/${streamers._id}`)}
              >
                <Row align="middle">
                  <Col span={6} className="avatar-container">
                    <Avatar
                      src={streamers.avatarUrl}
                      icon={<UserOutlined />}
                      alt={`${streamers.name} avatar`}
                      className="avatar"
                    />
                  </Col>
                  <Col span={18} className="info-container">
                    <h5 className="streamers-name">{streamers.name}</h5>
                    <h5 className="total-like">
                      Total likes: <span>{streamers.totalLikes}</span>{" "}
                      <LikeOutlined />
                    </h5>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </div>

        {/* Bottom Half - Categories */}
        <div className="bottom-section">
          <Title level={5} className="title-center2">
            CATEGORIES
          </Title>
          <List
            className="list"
            itemLayout="vertical"
            dataSource={categories}
            renderItem={(category) => (
              <List.Item
                className="list-item-center"
                onClick={() => navigate(`/category/${category.name}`)}
              >
                <img
                  src={
                    category.image ||
                    "https://artsmidnorthcoast.com/wp-content/uploads/2014/05/no-image-available-icon-6-300x188.png"
                  }
                  alt="category image"
                  className="category-image"
                  style={{ width: "100%", height: "auto" }}
                />
                <Text className="list-text">{category.name}</Text>
              </List.Item>
            )}
          />
        </div>
      </Sider>

      {/* Main Content Section */}
      <Layout className="main" style={{ overflowX: "hidden" }}>
        <Content className="top-stream">
          <h2>
            <FireOutlined /> TOP STREAM
          </h2>
          {topLikedStream ? (
            <div className="top-liked-container">
              <div className="top-liked-image">
                <img
                  src={
                    topLikedStream.thumbnailUrl ||
                    "https://artsmidnorthcoast.com/wp-content/uploads/2014/05/no-image-available-icon-6-300x188.png"
                  }
                  alt={topLikedStream.title}
                />
              </div>
              <div className="top-liked-details">
                <Row style={{ display: "flex", gap: "1em" }}>
                  <div>
                    <Avatar
                      src={topLikedStream.userId.avatarUrl}
                      icon={<UserOutlined />}
                      alt={`${topLikedStream.userId.name}'s avatar`}
                      className="top-liked-avatar"
                      onClick={() => {
                        navigate(`profile/${topLikedStream.userId._id}`);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <div>
                    <p className="top-liked-username">
                      <span
                        onClick={() => {
                          navigate(`profile/${topLikedStream.userId._id}`);
                        }}
                        style={{ fontWeight: 800, cursor: "pointer" }}
                      >
                        {topLikedStream.userId.name}
                      </span>
                    </p>
                    <div style={{ display: "flex", gap: "1em" }}>
                      <p className="like-icon">
                        {ArraySize(topLikedStream.likeBy)} <LikeOutlined />
                      </p>
                      <p className="view-icon">
                        {topLikedStream.currentViewCount} <EyeOutlined />
                      </p>
                    </div>
                  </div>
                </Row>
                <button
                  type="default"
                  className="top-liked-button"
                  onClick={() => {
                    navigate(`/room/${topLikedStream._id}`);
                  }}
                >
                  Go to Stream
                </button>
              </div>
            </div>
          ) : (
            <div className="top-liked-container">
              <div className="fallback-image">
                <img src={stream} alt="Featured Stream" />
              </div>
              <div className="fallback-info">
                <h2>
                  No stream available yet, the most liked stream will be
                  displayed here
                </h2>
              </div>
            </div>
          )}
        </Content>

        {/* Featured Streams Section */}
        <Content className="stream-list">
          <h2>FEATURED STREAMS</h2>
          <Row gutter={[16, 16]}>
            {streams.length > 0 ? (
              streams.map((stream, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card
                    className="stream-card"
                    hoverable
                    cover={
                      <div
                        style={{ position: "relative" }}
                        className="card-cover-image"
                      >
                        <img
                          alt={stream.title}
                          src={stream.thumbnailUrl}
                          onClick={() => {
                            navigate(`/live-stream-room/${stream._id}`);
                          }}
                        />
                        <span className="view-count">
                          {stream.currentViewCount} <EyeOutlined />{" "}
                        </span>
                        <span className="live-badge">LIVE</span>
                      </div>
                    }
                  >
                    <Meta
                      description={
                        <>
                          <div className="stream-info">
                            <div
                              className="stream-info-text"
                              onClick={() => {
                                navigate(`/profile/${stream.userId?._id}`);
                              }}
                            >
                              <Avatar
                                alt="avatar"
                                icon={<UserOutlined />}
                                src={stream.userId?.avatarUrl}
                                className="avatar"
                              />
                            </div>
                            <div>
                              <span className="stream-title">
                                <strong
                                  onClick={() => {
                                    navigate(`/live-stream-room/${stream._id}`);
                                  }}
                                >
                                  {stream.title}
                                </strong>{" "}
                                <br />
                              </span>
                              <span class="stream-streamer-name"
                                onClick={() => {
                                  navigate(`/profile/${stream.userId?._id}`);
                                }}
                              >
                                {" "}
                                {stream.userId?.name}
                              </span>
                            </div>
                          </div>
                        </>
                      }
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
            style={{ marginTop: "20px" }}
            defaultCurrent={currentPage}
            total={totalPages * 10}
            onChange={(page) => {
              setCurrentPage(page);
            }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
