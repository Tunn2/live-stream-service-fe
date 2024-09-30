// src/components/search/streamer.jsx
import React, { useEffect, useState } from "react";
import api from "../../configs/axios"; // Use the configured axios instance
import { Col, Row } from "antd";
import "./style.scss";
import { useNavigate } from "react-router-dom";
export default function SearchStreamer({ searchQuery, setSearchQuery }) {
  const [streamers, setStreamers] = useState([]); // Ensure initial state is an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const fetchStreamers = async () => {
      if (!searchQuery) return;
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(
          `/users/all?searchQuery=${searchQuery}&limit=5&page=1`
        );
        setTotal(response.data.data.total);

        setStreamers(response.data.data.data || []); // Safely handle data, default to an empty array if undefined
      } catch (err) {
        setError("Failed to fetch streamers");
        console.error(err);
        setStreamers([]); // Reset to an empty array on error to prevent undefined access
      }

      setLoading(false);
    };

    fetchStreamers();
  }, [searchQuery]); // Run the effect when searchQuery changes
  const nav = useNavigate();
  return (
    <div>
      {loading && <p>Loading streamers...</p>}
      {error && <p>{error}</p>}
      {!loading && streamers.length === 0 && (
        <p>No streamers found for "{searchQuery}"</p>
      )}
      {streamers.length > 0 && (
        <ul className="search-result">
          {streamers.map((streamer) => (
            <li key={streamer._id}>
              <Row
                className="search-item"
                onClick={() => {
                  nav(`/profile/${streamer._id}`);
                  setSearchQuery("");
                }}
              >
                <Col span={8}>
                  <img
                    src={streamer.avatarUrl}
                    alt="error"
                    className="avatar"
                  />
                </Col>
                <Col span={16} className="left">
                  <h3 className="search-preview-name">{streamer.name}</h3>
                  <p>Followers: 0</p>
                </Col>
              </Row>
            </li>
          ))}
        </ul>
      )}
      <div className="left">
        There are {total - 5 > 0 ? total - 5 : 0} more user match the search
        result
      </div>
    </div>
  );
}
