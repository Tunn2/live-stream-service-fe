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
} from "antd";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import "./home.css"; // Import the CSS file
import { EyeOutlined, LikeOutlined } from "@ant-design/icons";

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
  const ArraySize = (arr)=>{
    if(!arr){
      return 0;
    }else return arr.length;
  }
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await api.get(
          `http://localhost:4000/api/streams?page=${currentPage}&size=${pageSize}&isStreaming=true`
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
        const response = await api.get(
          "http://localhost:4000/api/stream/top1?type=like"
        );
        setTopLikedStream(response.data);
        const cateRes = await api.get(
          "http://localhost:4000/api/streams/categories"
        );
        setCategories(cateRes.data.data);
      } catch (error) {
        console.error("Error fetching top-liked stream:", error);
      }
    };

    fetchTopLikedStream();
  }, []);

  return (
    <Layout className="layout">
      {/* Categories Section */}
      <Sider width={240} className="sider">
        <Title level={5} className="title-center">Categories</Title>
        <List
          itemLayout="vertical"
          dataSource={categories}
          renderItem={(category) => (
            <List.Item className="list-item-center">
              <Text className="list-text">{category.name}</Text>
            </List.Item>
          )}
        />
      </Sider>

      {/* Main Content Section */} 
      <Layout className="sider" >
        <h2 className="title-center" ><span style={{borderBottom: "4px solid rgba(145, 71, 255, 1)"}}>TOP STREAM</span> </h2>
        <Content style={{}}>
          {topLikedStream ? (
            <div className="top-liked-container">
              
              <img
                src={topLikedStream.thumbnailUrl}
                alt={topLikedStream.title}
                className="top-liked-image"
              />
              <div className="top-liked-banner">Trendy</div>
              <div className="top-liked-banner2">{topLikedStream.categories[0]}</div>
              <div className="top-liked-bottom">
                <div className="top-liked-details">
                  <img
                    src={topLikedStream.userId.avatarUrl}
                    alt={`${topLikedStream.userId.name}'s avatar`}
                    className="top-liked-avatar"
                    onClick={()=>{navigate(`profile/${topLikedStream.userId._id}`)}}
                    style={{cursor: "pointer"}}
                  />
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <Row className="space-between"><p className="top-liked-title">{topLikedStream.title}</p>
                    <p className="top-liked-username">{ArraySize(topLikedStream.likeBy)} <LikeOutlined /></p></Row>
                    <Row className="space-between"><p className="top-liked-username">
                      Stream by: <span onClick={()=>{navigate(`profile/${topLikedStream.userId._id}`)}} style={{fontWeight: 800, cursor: "pointer"}}>{topLikedStream.userId.name}</span>
                    </p>
                    <p className="top-liked-username">{topLikedStream.currentViewCount} <EyeOutlined /></p> </Row>
                    <button
                      type="default"
                      ghost
                      className="top-liked-button"
                      onClick={() => {
                        navigate(`/room/${topLikedStream._id}`);
                      }}
                    >
                      Go to Stream
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="top-liked-container">
              <img src="/default_image.jpg" alt="Featured Stream" className="fallBack" />
              <div className="fallBack1">
                <h2 className="fallbackH2">
                  No stream available yet, the most liked stream will be displayed here
                </h2>
              </div>
            </div>
          )}
        </Content>
          <hr className="splitter"/>
        {/* Featured Streams Section */}
        <Content>
          <h2 className="title-center"><span style={{borderBottom: "4px solid rgba(145, 71, 255, 1)"}}>FEATURED STREAMS</span></h2>
          <Row gutter={[16, 16]}>
            {streams.length > 0 ? (
              streams.map((stream, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: "relative" }}>
                        <img
                          alt={stream.title}
                          src={stream.thumbnailUrl}
                          className="card-cover-image"
                          onClick={() => {
                            navigate(`/room/${stream._id}`);
                          }}
                        />
                        <span className="view-count">{stream.currentViewCount} <EyeOutlined />  </span>
                        <span className="live-badge">LIVE</span>
                      </div>
                    }
                  >
                    <Meta
                      description={
                        <>
                          <div className="stream-info">
                            <div className="stream-info-text" onClick={() => { navigate(`/profile/${stream.userId._id}`); }}>
                              <img
                                alt="avatar"
                                src={stream.userId.avatarUrl}
                                className="avatar"
                              />
                            </div>
                            <div>
                              <span>
                                <strong>{stream.title}</strong> <br />
                                {stream.userId.name}
                              </span>
                            </div>
                          </div>
                          <br />
                          <strong>Categories:</strong>
                          <ul>
                            {stream.categories.map((category, index) => (
                              <li key={index}>{category}</li>
                            ))}
                          </ul>
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
