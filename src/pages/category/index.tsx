import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import { Layout, Typography, List, Row, Col, Card, Pagination } from "antd";
import { EyeOutlined, LikeOutlined } from "@ant-design/icons";
import "./category.css";
const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

export default function Category() {
  const [streams, setStreams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [categories, setCategories] = useState([]);
  let currentCate;
  const navigate = useNavigate(); // Fix: useNavigate hook
  const { category } = useParams();
  currentCate = category;
  // Fetch streams by category
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await api.get(
          `http://localhost:4000/api/streams/filter-by-category?category=${category}&page=${currentPage}&itemsPerPage=${pageSize}`
        );
        console.log(response.data);
        setStreams(response.data.streams);
        setTotalPages(Math.ceil(response.data.totalStreams / pageSize));
      } catch (error) {
        console.error("Error fetching streams:", error);
      }
    };

    if (category) {
      fetchStreams();
    }
  }, [category, currentPage, pageSize]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cateRes = await api.get(
          "http://localhost:4000/api/streams/categories"
        );
        setCategories(cateRes.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Layout className="layout">
        <Sider width={240} className="sider2">
          <Title level={5} className="title-center">
            CATEGORIES
          </Title>
          <List
            itemLayout="vertical"
            dataSource={categories}
            renderItem={(category) => (
              <List.Item
                className="list-item-center"
                onClick={() => navigate(`/category/${category.name}`)}
              >
                <img
                  src={category.image}
                  alt="image"
                  style={{ width: "100%", height: "auto" }}
                />
                <Text className="list-text">{category.name}</Text>
              </List.Item>
            )}
          />
        </Sider>
        <Content>
          <h2 className="title-center">
            <span style={{ borderBottom: "4px solid rgba(145, 71, 255, 1)" }}>
              {category?.toLocaleUpperCase()} STREAMS
            </span>
          </h2>
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
                                navigate(`/profile/${stream.userId._id}`);
                              }}
                            >
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
              <></>
            )}
          </Row>
          {!streams ||
            (streams.length == 0 && (
              <div className="center">
                <h2>No streams available</h2>
              </div>
            ))}
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
    </>
  );
}
