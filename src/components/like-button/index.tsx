import React, { useEffect, useState } from "react";
import "./index.scss";
import { Button } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../../configs/axios";

const LikeButton = ({ streamId, userId, likeCount, like }) => {
  const [liked, setLiked] = useState(like);
  const [likedCount, setLikedCount] = useState(likeCount);

  const handleClick = async () => {
    console.log(likedCount);
    if (liked) {
      setLikedCount(likedCount - 1);
      const response = await api.post(`streams/${streamId}/${userId}/dislike`);
    } else {
      setLikedCount(likedCount + 1);
      const response = await api.post(`streams/${streamId}/${userId}/like`);
    }
    setLiked(!liked);
  };

  return (
    <Button
      className={`like-button ${liked ? "liked" : ""}`}
      onClick={handleClick}
    >
      {likedCount} <LikeOutlined />
    </Button>
  );
};

export default LikeButton;
