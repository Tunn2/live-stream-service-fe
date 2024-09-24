import React, { useEffect, useState } from "react";

import {
  Avatar,
  Button,
  Form,
  Grid,
  Image,
  Input,
  theme,
  Typography,
} from "antd";

import { LoadingOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/features/userSlice";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function Profile() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { userId } = useParams();
  const user1 = useSelector((store) => store.user);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleGetUserById = async () => {
    try {
      const response = await api.get(`users/${userId}`);
      const { password, createdAt, updatedAt, isActive, ...result } =
        response.data.data;
      console.log(result);
      setUser(result);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const onFinish = async (values) => {
    let response = null;

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    if (fileList.length > 0) {
      formData.append("avatar", fileList[0].originFileObj);
    }

    try {
      response = await api.patch(`users/${user?._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { password, createdAt, updatedAt, isActive, ...result } =
        response.data.data;
      dispatch(login(result));
      setDisable(true);
      setFileList([]);
      toast.success("Update successfully");
    } catch (error: any) {
      toast.error(error.response?.data.error);
    }
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.paddingXL}px ${token.padding}px`,
      width: "380px",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
      textAlign: "center",
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    signup: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  useEffect(() => {
    handleGetUserById();
  }, []);
  return (
    <section style={styles.section}>
      {user && (
        <div style={styles.container}>
          <div style={styles.header}>
            <Title style={styles.title}>
              {user1._id === userId ? "My" : user1.name + "'s"} Profile
            </Title>
            <Avatar
              size={64}
              icon={<UserOutlined />}
              src={user?.avatarUrl}
              style={{ cursor: "pointer" }}
            />
          </div>
          <Form
            name="signup"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
            encType="multipart/form-data"
            initialValues={user}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please input your Name!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Name"
                disabled={disable}
              />
            </Form.Item>
            <Form.Item
              name="bio"
              label="Bio"
              rules={[
                {
                  required: true,
                  message: "Please input your bio",
                },
              ]}
            >
              <Input.TextArea rows={1} disabled={disable} />
            </Form.Item>
            {user1._id === userId ? (
              <Form.Item style={{ marginBottom: "0px" }}>
                <Button
                  block
                  onClick={() => {
                    setDisable(false);
                  }}
                  style={{ marginBottom: "20px" }}
                >
                  Edit
                </Button>
                <Button
                  block
                  type="primary"
                  onClick={() => {
                    setDisable(false);
                  }}
                  htmlType="submit"
                  disabled={disable}
                >
                  Save
                </Button>
              </Form.Item>
            ) : (
              <></>
            )}
          </Form>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>
      )}
    </section>
  );
}
