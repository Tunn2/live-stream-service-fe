import React, { useEffect, useState } from "react";
import "./index.scss";
import { Button } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../../configs/axios";

const LikeButton = ({ streamId, userId, likeCount, like }) => {
  const [liked, setLiked] = useState(like);

  const handleClick = async () => {
    if (liked) {
      const response = await api.post(`streams/${streamId}/${userId}/dislike`);
    } else {
      const response = await api.post(`streams/${streamId}/${userId}/like`);
    }
    setLiked(!liked);
  };
  useEffect(() => {
    setLiked(false);
  }, []);
  return (
    <Button
      className={`like-button ${liked ? "liked" : ""}`}
      onClick={handleClick}
    >
      {likeCount} <LikeOutlined />
    </Button>
  );
};

export default LikeButton;
