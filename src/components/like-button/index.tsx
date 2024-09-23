import React, { useEffect, useState } from "react";
import "./index.scss";
import { Button } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import axios from "axios";

const LikeButton = ({ isLiked, streamId, userId }) => {
  const [liked, setLiked] = useState(false);

  const handleClick = async () => {
    if (liked) {
      const response = await axios.post(
        `http://localhost:4000/api/streams/${streamId}/${userId}/dislike`
      );
    }
    setLiked(!liked);
  };
  useEffect(() => {
    setLiked(isLiked);
  }, []);
  return (
    <Button
      className={`like-button ${liked ? "liked" : ""}`}
      onClick={handleClick}
    >
      <LikeOutlined />
    </Button>
  );
};

export default LikeButton;
