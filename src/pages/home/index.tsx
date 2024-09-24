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




const HomePage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [topLikedStream, setTopLikedStream] = useState(null);
  const [categories,setCategories]= useState([]);
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
          `http://localhost:4000/api/streams?page=${currentPage}&size=${pageSize}&isStreaming=true`
        );
        setStreams(response.data.data.streams); // Assuming the API response returns an array of streams
        setTotalPages(response.data.data.totalPages);

        console.log("Streams:", response.data.data);
      } catch (error) {
        console.error("Error fetching streams:", error);
      }
    };

    fetchStreams();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const fetchTopLikedStream = async () => {
      try {
        const response = await api.get("http://localhost:4000/api/stream/top1?type=like");
        setTopLikedStream(response.data); // Assuming the first item is the top-liked stream
        const cateRes = await api.get("http://localhost:4000/api/streams/categories");
        setCategories(cateRes.data.data);
      } catch (error) {
        console.error("Error fetching top-liked stream:", error);
      }
    };

    fetchTopLikedStream();
  }, []);
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
            <List.Item style={{ textAlign: "center",cursor: "pointer" }}>
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
          {topLikedStream ? (
            <div style={{ position: "relative", width: "100%" }}>
            {/* Image */}
            <img
              src={topLikedStream.thumbnailUrl}
              alt={topLikedStream.title}
              style={{ width: "80%", borderRadius: "8px", marginBottom: "32px",border: "2px solid black", margin: "0% 10%" }}
            />
          
            {/* Top-left corner banner */}
            <div
              style={{
                position: "absolute",
                top: "2%", // small margin from the top
                left: "12%",
                backgroundColor: "#FF0800",
                color: "white",
                padding: "5px 30px",
                borderRadius: 5,
                fontSize: "22px",
                fontWeight: "bold",
                zIndex: 1001, // Ensure it's above everything
                border: "1px solid white"
                
              }}
            >
              Top likes
            </div>
          
            {/* Bottom content */}
            <div
            style={{
              position: "absolute",
              bottom: "5%",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: "20px",
                borderRadius: 10,
                border: "3px solid rgba(145, 71, 255, 0.8)", // You can change this color
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px", // Space between avatar and text
                width: "80%",
              }}
            >
              {/* Avatar */}
              <img
                src={topLikedStream.userId.avatarUrl}
                alt={`${topLikedStream.userId.name}'s avatar`}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%", // Circular avatar
                  border: "3px solid rgba(145, 71, 255, 0.8)", // You can change this color
                }}
              />

              {/* Text Section (Title + Username) */}
              <div style={{ flex: 1, textAlign: "left" }}>
                {/* Stream Title */}
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "30px",
                    color: "rgb(210, 180, 255)", // You can change this color
                    
                  }}
                >
                  {topLikedStream.title}
                </p>
                  
                {/* User Name */}
                <p
                  style={{
                    fontSize: "18px",
                    color: "rgb(210, 180, 255)", // You can change this color
                    marginTop: "10px",
                  }}
                >
                  Stream by: {topLikedStream.userId.name}
                </p>

                {/* Go to Stream Button */}
                <Button
                  type="default"
                  ghost
                  style={{
                    width: "100%",
                    color: "rgb(210, 180, 255)", // Text color
                    borderColor: "rgb(210, 180, 255)", // Border color
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    navigate(`/room/${topLikedStream._id}`);
                  }}
                >
                  Go to Stream
                </Button>
              </div>
            </div>
          </div>
          </div>
          


          ) : (
            
            <div style={{ position: "relative", width: "100%" }}>
          <img
              src={stream}
              alt="Featured Stream"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "32px" }}
            />
          <div
            style={{
              position: "absolute",
              bottom: "10%", // Vertical position, 10% from the bottom of the image
              left: 0,
              right: 0, // Ensures full width for centering
              display: "flex",
              justifyContent: "center", // Centers content horizontally
              zIndex: 1000,
            }}
          >
            <h2
              style={{  
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "10px 20px",
                borderRadius: 5,
              }}
            >
              No stream available yet, the most liked stream will be displayed here
            </h2>
          </div>
          </div>
          )}
        </Content>


        {/* Featured Streams Section */}
        <Content>
          <Title level={4} style={{ textAlign: "center", marginBottom: "32px" }}>
            Featured Streams
          </Title>
          <Row gutter={[16, 16]}>
            {streams.length > 0 ? (
              streams.map((stream, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: "relative" }}>
                        {/* Stream Image */}
                        <img
                          alt={stream.title}
                          src={stream.thumbnailUrl} // Assuming each stream has an image URL
                          style={{ height: "200px", width: "100%", borderRadius: "8px 8px 0px 0px", cursor: "pointer" }}
                          onClick={() => {
                            navigate(`/room/${stream._id}`);
                          }}
                        />

                        {/* View Count - Top Left */}
                        <span
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          {stream.currentViewCount} watching
                        </span>

                        {/* LIVE Badge - Bottom Left */}
                        <span
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "10px",
                            backgroundColor: "red",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            border: "1px solid white"
                          }}
                        >
                          LIVE
                        </span>
                      </div>
                    }
                  >
                    <Meta
                      description={
                        <>
                          {/* Flex container for avatar and stream info */}
                          <div style={{ marginTop: "10px", display: "flex", alignItems: "center", width: "100%" }}>
                            <Row gutter={16} align="middle" onClick={() => { navigate(`/profile/${stream.userId._id}`); }}>
                              {/* Avatar Column */}
                              <div style={{ display: "inline-block", width: "100%" }}>
                                {/* Avatar */}
                                <div style={{ display: "inline-block", verticalAlign: "middle", marginRight: "10px", padding: "0px 20px" }}>
                                  <img
                                    alt="avatar"
                                    src={stream.userId.avatarUrl}
                                    style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                                  />
                                </div>

                                {/* Stream Info */}
                                <div style={{ display: "inline-block", verticalAlign: "middle" }}>
                                  <span>
                                    <strong>{stream.title}</strong> <br />
                                    {stream.userId.name}
                                  </span>
                                </div>
                              </div>
                            </Row>
                          </div>

                          <br />

                          {/* Categories */}
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

          {/* Pagination */}
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
      
    </Layout>
  );
};

export default HomePage;