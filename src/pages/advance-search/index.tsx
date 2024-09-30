import React, { useEffect, useState } from "react";
import { Form, Input, Row, Col, Card, Typography } from "antd";
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

  const reset = async () => {
    setSearchDetail({ title: "", categories: [] }); // Reset title and categories
    await setSearchResult([]);
    console.log("reseting: ", searchResult);
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
    <div className="search-container">
      <div className="form-container">
        <Form layout="vertical">
          <Form.Item name="title">
            <h2 className="search-header">Title</h2>
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

          <div className="categories-container">
            <h2 className="search-header">Category</h2>
            <Row gutter={[16, 16]}>
              {categories.map((category) => (
                <Col key={category.id}>
                  <div
                    className={
                      searchDetail.categories.includes(category.id)
                        ? "category-card-selected"
                        : "category-card"
                    }
                    onClick={() => toggleCategory(category.id)}
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
            <Row gutter={16}>
              <Col>
                <button className="search-btn" onClick={() => onFinish()}>
                  Go
                </button>
              </Col>
              <Col>
                <button className="reset-btn" onClick={() => reset()}>
                  Reset
                </button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
      <div>
        <h2>Search Result</h2>
        <Row gutter={[16, 16]}>
          {searchResult.length > 0 ? (
            searchResult.map((stream) => (
              <Col xs={24} sm={12} md={8} key={stream._id}>
                <Card
                  hoverable
                  cover={
                    <div className="card-cover">
                      <img
                        alt={stream.title}
                        src={stream.thumbnailUrl}
                        className="card-cover-image"
                        onClick={() => {
                          navigate(`/room/${stream._id}`);
                        }}
                      />
                      <span className="view-count">
                        {stream.currentViewCount} <EyeOutlined />
                      </span>
                      <span className="live-badge">LIVE</span>
                    </div>
                  }
                >
                  <Meta
                    description={
                      <div className="stream-info">
                        <div
                          className="stream-info-text"
                          onClick={() => {
                            navigate(`/profile/${stream.userId}`);
                          }}
                        >
                          <img
                            alt="avatar"
                            src={stream.userDetails.avatarUrl}
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
                              navigate(`/profile/${stream.userId}`);
                            }}
                          >
                            {stream.userDetails.name}
                          </span>
                        </div>
                        <br />
                        <ul className="category-list">
                          {stream.categories.map((category, index) => (
                            <li
                              key={index}
                              onClick={() => navigate(`/category/${category}`)}
                            >
                              {category}
                            </li>
                          ))}
                        </ul>
                      </div>
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
