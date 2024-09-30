import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Card, Typography } from "antd";
import api from "../../configs/axios";
import "./AdvanceSearch.css";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { Meta } = Card;
export default function AdvanceSearch() {
  const [categories, setCategories] = useState([]);
  const [searchDetail, setSearchDetail] = useState({
    title: "",
    categories: [],
  });
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCate = async () => {
      try {
        const cateRes = await api.get(
          "http://localhost:4000/api/streams/categories"
        );
        setCategories(cateRes.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCate();
  }, []);

  const handleSearch = async () => {
    try {
      const categoryParams = searchDetail.categories
        .map((cate) => `categoryIndex=${cate}`)
        .join("&");
      console.log(
        `/streams/searchStreams?title=${searchDetail.title}&${categoryParams}`
      );
      const response = await api.post(
        `/streams/searchStreams?title=${
          searchDetail.title || ""
        }&${categoryParams}`
      );

      console.log("Search Response: ", response.data);
      setSearchResult(response.data);
    } catch (error) {
      console.log("Search Error: ", error);
    }
  };

  // Handle category selection based on category ID
  const toggleCategory = (categoryId) => {
    setSearchDetail((prevState) => {
      const isSelected = prevState.categories.includes(categoryId);
      const updatedCategories = isSelected
        ? prevState.categories.filter((cat) => cat !== categoryId)
        : [...prevState.categories, categoryId];

      return {
        ...prevState,
        categories: updatedCategories,
      };
    });
  };

  const onFinish = (values) => {
    const searchData = {
      ...values,
      categories: searchDetail.categories,
    };
    console.log("Form Submitted: ", searchData);
    handleSearch();
  };

  return (
    <div>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Title" name="title">
          <Input
            placeholder="Enter title"
            value={searchDetail.title}
            onChange={(e) =>
              setSearchDetail((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />
        </Form.Item>

        {/* Displaying categories in a scrollable row */}
        <div className="categories-container">
          <Row gutter={[16, 16]}>
            {categories.map((category, index) => (
              <Col key={category.id}>
                <div
                  className={
                    searchDetail.categories.includes(category.id)
                      ? "category-card-selected" // If selected, apply a different style
                      : "category-card"
                  }
                  onClick={() => toggleCategory(category.id)} // Handle click with ID
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                  />
                  <p>{category.name}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
      <div>
        <Row gutter={[16, 16]}>
          {searchResult.length > 0 ? (
            searchResult.map((stream, index) => (
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
                              <strong
                                onClick={() => {
                                  navigate(`/room/${stream._id}`);
                                }}
                              >
                                {stream.title}
                              </strong>{" "}
                              <br />
                            </span>
                            <span
                              onClick={() => {
                                navigate(`/profile/${stream.userId._id}`);
                              }}
                            >
                              {" "}
                              {stream.userId.name}
                            </span>
                          </div>
                        </div>
                        <br />
                        <ul>
                          {stream.categories.map((category, index) => (
                            <li
                              key={index}
                              onClick={() => navigate(`/category/${category}`)}
                            >
                              {category}
                            </li>
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
      </div>
    </div>
  );
}
