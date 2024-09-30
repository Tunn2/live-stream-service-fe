import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../configs/axios";
import { Col, Row, Card, Pagination, Avatar } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import "./search.scss";
export default function Search() {
  const { searchQuery } = useParams();
  const [streams, setStreams] = useState([]);
  const [streamers, setStreamers] = useState([]);
  const [loadingStreams, setLoadingStreams] = useState(false);
  const [loadingStreamers, setLoadingStreamers] = useState(false);
  const [errorStreams, setErrorStreams] = useState(null);
  const [errorStreamers, setErrorStreamers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  // Fetch Streams
  useEffect(() => {
    const fetchStreams = async () => {
      setLoadingStreams(true);
      setErrorStreams(null);

      try {
        const response = await api.post(
          `/streams/searchStreams?title=${searchQuery || ""}`,
          {}
        );
        setStreams(response.data || []);
      } catch (err) {
        setErrorStreams("Failed to fetch streams");
        console.error(err);
        setStreams([]);
      }

      setLoadingStreams(false);
    };

    fetchStreams();
  }, [searchQuery]);
  const nav = useNavigate();
  // Fetch Streamers
  useEffect(() => {
    const fetchStreamers = async () => {
      setLoadingStreamers(true);
      setErrorStreamers(null);

      try {
        const response = await api.get(
          `/users/all?searchQuery=${
            searchQuery || ""
          }&limit=${pageSize}&page=${currentPage}`
        );
        console.log(searchQuery);
        if (!searchQuery) {
          setStreamers(response.data.data.data.data || []);
        } else {
          console.log("streamers", response.data.data.data);
          setStreamers(response.data.data.data);
        }
        setTotalPages(response.data.data.totalPages);
      } catch (err) {
        setErrorStreamers("Failed to fetch streamers");
        console.error(err);
        setStreamers([]);
      }

      setLoadingStreamers(false);
    };

    fetchStreamers();
  }, [searchQuery, currentPage, pageSize]);

  return (
    <div>
      {/* Streams Section */}
      <div>
        <h2>Streams</h2>
        {loadingStreams && <p>Loading streams...</p>}
        {errorStreams && <p>{errorStreams}</p>}
        {!loadingStreams && streams.length === 0 && (
          <p>No streams found for "{searchQuery}"</p>
        )}
        {streams.length > 0 && (
          <Row gutter={[16, 16]}>
            {streams.map((stream) => (
              <Col xs={24} sm={12} md={8} key={stream._id}>
                <Card
                  hoverable
                  cover={
                    <div style={{ position: "relative" }}>
                      <img
                        alt={stream.title}
                        src={stream.thumbnailUrl}
                        className="card-cover-image"
                        style={{
                          height: "200px",
                          width: "100%",
                          borderRadius: "8px 8px 0 0",
                        }}
                        onClick={() => {
                          nav(`/room/${stream._id}`);
                        }}
                      />
                      <span
                        className="view-count"
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          border: "1px solid white",
                        }}
                      >
                        {stream.currentViewCount} <EyeOutlined />
                      </span>
                      <span
                        className="live-badge"
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "10px",
                          backgroundColor: "red",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          border: "1px solid white",
                        }}
                      >
                        LIVE
                      </span>
                    </div>
                  }
                >
                  <Card.Meta
                    description={
                      <>
                        <div
                          className="stream-info"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            alt="avatar"
                            src={stream.userId.avatarUrl}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                          />
                          <div>
                            <span>
                              <strong>{stream.title}</strong>
                              <br />
                            </span>
                            <span>{stream.userId.name}</span>
                          </div>
                        </div>
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
            ))}
          </Row>
        )}
      </div>

      {/* Streamers Section */}
      <div>
        <h2>Streamers</h2>
        {loadingStreamers && <p>Loading streamers...</p>}
        {errorStreamers && <p>{errorStreamers}</p>}
        {!loadingStreamers && streamers.length === 0 && (
          <p>No streamers found for "{searchQuery}"</p>
        )}
        {streamers.length > 0 && (
          <ul>
            {streamers.map((streamer) => (
              <li key={streamer._id} className="list-item-streamer">
                <Card
                  className="streamer-card"
                  onClick={() => {
                    nav(`/profile/${streamer._id}`);
                  }}
                >
                  <Meta
                    avatar={
                      <Avatar src={streamer.avatarUrl} className="avatar" />
                    }
                    title={
                      <span className="streamer-name">
                        {streamer.name || streamer.username}
                      </span>
                    }
                    description={`Follower: ${0}`}
                  />
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Pagination
        align="center"
        style={{ marginTop: "20px" }}
        defaultCurrent={currentPage}
        total={totalPages * 10}
        onChange={(page) => {
          setCurrentPage(page);
        }}
      />
    </div>
  );
}
