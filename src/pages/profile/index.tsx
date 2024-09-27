import React, { useEffect, useState, useRef } from "react";
import {
  Avatar,
  Button,
  Flex,
  Col,
  Form,
  Grid,
  Image,
  Input,
  Row,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  LikeFilled,
  LoadingOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./profile.css";
import { Bounce, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/features/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../configs/axios";
import { blue } from "@ant-design/colors";
import { EyeOutlined, LikeOutlined } from "@ant-design/icons";
const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Title } = Typography;

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
  const [form] = Form.useForm(); // For resetting form
  const fileInputRef = useRef(null); // Ref for the file input
  const dispatch = useDispatch();
  const { userId } = useParams();
  const user1 = useSelector((store) => store.user);

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newFileList = [
        {
          uid: files[0].name,
          name: files[0].name,
          status: "done",
          url: URL.createObjectURL(files[0]),
          originFileObj: files[0],
        },
      ];
      setFileList(newFileList);
    }
  };

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
      const { password, updatedAt, ...result } = response.data.data;
      const likeResponse = await api.get(`users/totalLikes?userId=${userId}`);
      const full = {
        ...result,
        totalLikes: likeResponse.data.totalLikes,
      };
      setUser(full);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));

    if (fileList.length > 0) {
      formData.append("avatar", fileList[0].originFileObj); // Add image if uploaded
    }

    try {
      setLoading(true);
      const response = await api.patch(`users/${user?._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { password, createdAt, updatedAt, isActive, ...result } =
        response.data.data;
      dispatch(login(result)); // Update user in Redux store
      setDisable(true);
      setFileList([]);
      toast.success("Update successfully");
    } catch (error) {
      toast.error(error.response?.data.error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form
    setFileList([]); // Clear file list
    setDisable(true); // Disable editing
  };

  useEffect(() => {
    handleGetUserById();
  }, [userId]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        bio: user.bio,
      });
    }
  }, [user, form]);

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.paddingXL}px ${token.padding}px`,
      width: "380px",
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
  };
  const toaster = () => {
    if (user1._id == userId && disable === true) {
      toast.warn("You must enable edit to change your profile");
    } else {
      console.log("user: ", user1 === userId);
      console.log("status: ", disable === true);
      toast.error("You can not change other people profile");
    }
  };
  const formatJoinDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };
  return (
    <section>
      {user && (
        <div className="name-container">
          <span className="name-gradient">
            {user1._id === userId ? "Your" : `${user.name}'s`} Profile
          </span>
        </div>
      )}
      {user && (
        <div className="profile-container-someone">
          <div className="Other-image">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileInputChange}
            />
            <Avatar
              size={300}
              icon={<UserOutlined />}
              src={fileList.length > 0 ? fileList[0].url : user?.avatarUrl}
              className="Other-image-inside"
              onClick={() => {
                user1._id === userId && disable === false
                  ? fileInputRef.current.click()
                  : toaster();
              }} // Trigger file input
            />
          </div>
          <Form
            form={form}
            name="signup"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
            encType="multipart/form-data"
            initialValues={user}
            className="someone-form"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input your  Name!" }]}
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
              rules={[{ required: true, message: "Please input your bio" }]}
            >
              <Input.TextArea rows={1} disabled={disable} />
            </Form.Item>

            <>
              <h3>
                Status:{" "}
                <span
                  className={
                    user.isActive === true ? "Active-User" : "Inactive-User"
                  }
                >
                  {user.isActive === true ? "Active User" : "Inactive User"}
                </span>
              </h3>
              <h4 className="join-date">
                {user1._id === userId ? "You have" : "This user has"} joined
                since {formatJoinDate(user.createdAt)}
              </h4>
              <br />

              <div>
                <Row>
                  <Col span={12}>
                    <div
                      className="box"
                      onClick={() => {
                        toast(
                          `${
                            user1._id === userId ? "You have" : "This user has"
                          } ${user.totalLikes || 0} likes from all of ${
                            user1._id === userId ? "your" : "their"
                          } streams`,
                          {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
                          }
                        );
                      }}
                    >
                      <>
                        <h2 style={{ textAlign: "center" }}>Likes: </h2>
                        <h2 style={{ fontSize: 30, textAlign: "center" }}>
                          {user.totalLikes || 0} <LikeFilled />
                        </h2>
                      </>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      className="box"
                      onClick={() => {
                        toast(
                          `${
                            user1._id === userId ? "You have" : "This user has"
                          } ${user.formDatallower || 0} followers`,
                          {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
                          }
                        );
                      }}
                    >
                      <>
                        <h2 style={{ textAlign: "center" }}>Followers: </h2>{" "}
                        <h2 style={{ fontSize: 30, textAlign: "center" }}>
                          {user.follower || 0} <UsergroupAddOutlined />
                        </h2>
                      </>
                    </div>
                  </Col>
                </Row>
              </div>
            </>

            {user1._id === userId && (
              <>
                <Form.Item>
                  <Row
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Col span={8} style={{ padding: "0px 20px" }}>
                      <Button
                        block
                        onClick={() => setDisable(false)}
                        style={{ margin: "10px 0px" }}
                      >
                        Edit
                      </Button>
                    </Col>
                    <Col span={8} style={{ padding: "0px 20px" }}>
                      <Button
                        block
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={disable || loading}
                        style={{ margin: "10px 0px" }}
                      >
                        Save
                      </Button>
                    </Col>
                    <Col span={8} style={{ padding: "0px 20px" }}>
                      <Button
                        block
                        danger
                        onClick={handleCancel}
                        disabled={disable || loading}
                        style={{ margin: "10px 0px" }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </>
            )}
          </Form>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
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
