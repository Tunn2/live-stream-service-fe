import { Button } from "antd";
import React, { useState } from "react";
import "./index.scss";
import { ShareAltOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const ShareButton = () => {
  const handleShare = async () => {
    const currentUrl = window.location.href;
    await navigator.clipboard.writeText(currentUrl);
    toast.success("Copied current url");
  };

  return (
    <Button className={"share-button"} onClick={handleShare}>
      <ShareAltOutlined />
    </Button>
  );
};

export default ShareButton;
