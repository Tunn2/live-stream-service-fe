// src/components/search/streams.tsx
import React, { useEffect, useState } from "react";
import api from "../../configs/axios"; // Use the configured axios instance
import { Col, Row } from "antd";
import "./style.scss";
import { useNavigate } from "react-router-dom";
export default function SearchStream({ searchQuery, setSearchQuery }) {
  const [streams, setStreams] = useState([]); // Ensure initial state is an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStreams = async () => {
      if (!searchQuery) return; // If no search query, don't fetch streams
      setLoading(true);
      setError(null);

      try {
        const response = await api.post(
          `/streams/searchStreams?title=${searchQuery}`,
          {}
        );

        setStreams(response.data || []);
      } catch (err) {
        setError("Failed to fetch streams");
        console.error(err);
        setStreams([]);
      }

      setLoading(false);
    };

    fetchStreams();
  }, [searchQuery]);
  const nav = useNavigate();
  return (
    <div>
      {loading && <p>Loading streams...</p>}
      {error && <p>{error}</p>}
      {!loading && streams.length === 0 && (
        <p>No streams found for "{searchQuery}"</p>
      )}
      {streams.length > 0 && (
        <ul className="search-result">
          {streams.map((stream) => (
            <Row
              className="search-item"
              onClick={() => {
                nav(`room/${stream._id}`);
                setSearchQuery("");
              }}
            >
              <Col span={8}>
                <img src={stream.thumbnailImg} alt="image" />
              </Col>
              <Col span={16}>
                <li key={stream._id} className="">
                  <h3 className="search-preview-name">{stream.title}</h3>
                  <Row>
                    <Col span={12} className="left">
                      <p>
                        Category:{" "}
                        <b>{stream.categories?.join(", ") || "N/A"}</b>
                      </p>
                    </Col>
                    <Col span={12} className="left">
                      <p>
                        Viewers: <b>{stream.currentViewCount}</b>
                      </p>
                    </Col>
                  </Row>
                </li>
              </Col>
            </Row>
          ))}
        </ul>
      )}
    </div>
  );
}
