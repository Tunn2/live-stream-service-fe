import { Button, Form, Image, Input, Modal, Select, Upload } from "antd";
import "./index.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import {
  LoadingOutlined,
  PlusOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import logo from "../../img/logo-color.png";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import api from "../../configs/axios";
import { login, logout } from "../../redux/features/userSlice";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function Header() {
  const [isOpenSignUp, setIsOpenSignUp] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenLive, setIsOpenLive] = useState(false);
  const [form] = useForm();
  const [loginForm] = useForm();
  const [liveForm] = useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

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

  const handleCloseSignUp = () => {
    form.resetFields();
    setIsOpenSignUp(false);
  };

  const handleCloseLogin = () => {
    loginForm.resetFields();
    setIsOpenLogin(false);
  };

  const handleCloseCreateStream = () => {
    liveForm.resetFields();
    setIsOpenLive(false);
  };

  const handleLoginForm = async (value) => {
    let response = null;
    try {
      response = await api.post("auth/login", value);
      const token = response.data?.accessToken;
      localStorage.setItem("token", token);
      const { _id } = jwtDecode(token);
      const result = await api.get(`users/${_id}`);
      const { password, createdAt, updatedAt, isActive, ...user } =
        result.data.data;
      dispatch(login(user));
      handleCloseLogin();
    } catch (error) {
      toast.error("Email or password is incorrect");
    }
  };

  const handleSubmitForm = async (value) => {
    let response = null;
    const formData = new FormData();
    Object.keys(value).forEach((key) => {
      formData.append(key, value[key]);
    });

    // Append the file to the FormData object
    if (fileList.length > 0) {
      formData.append("avatar", fileList[0].originFileObj);
    }

    try {
      response = await axios.post(
        "http://localhost:4000/api/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFileList([]);
      toast.success("Sign up successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data.error);
    }
    handleCloseSignUp();
  };

  const handleLiveForm = async (value) => {
    setLoading(true);
    let response = null;
    const formData = new FormData();
    Object.keys(value).forEach((key) => {
      formData.append(key, value[key]);
    });
    if (fileList.length > 0) {
      formData.append("thumbnail", fileList[0].originFileObj);
    }
    formData.append("userId", user._id);
    try {
      response = await axios.post(
        "http://localhost:4000/api/streams/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFileList([]);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data.error);
    }
    setLoading(false);
    handleCloseCreateStream();
    const stream = response?.data.data;
    navigate(`room/${stream._id}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
  };

  return (
    <div className="header">
      <div className="header__left">
        <Link to="">
          <img src={logo} alt="" />
        </Link>
      </div>
      <div className="header__right">
        {user === null ? (
          <>
            <button
              onClick={() => {
                setIsOpenLogin(true);
              }}
            >
              Log in
            </button>
            <button onClick={() => setIsOpenSignUp(true)}>Sign up</button>
          </>
        ) : (
          <>
            <button style={{ width: 76 }} onClick={() => setIsOpenLive(true)}>
              <VideoCameraOutlined />
            </button>
            <button onClick={handleLogout}>Log out</button>
          </>
        )}
      </div>

      <Modal
        open={isOpenSignUp}
        title="Sign Up"
        onCancel={handleCloseSignUp}
        onClose={handleCloseSignUp}
        footer={
          <>
            <Button
              type="primary"
              onClick={() => {
                form.submit();
              }}
            >
              Sign Up
            </Button>
          </>
        }
      >
        <Form
          form={form}
          onFinish={handleSubmitForm}
          labelCol={{ span: 24 }}
          encType="multipart/form-data"
        >
          <FormItem
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                message: "Please input your valid email",
              },
              {
                required: true,
                message: "Please input your email",
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please input your username",
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </FormItem>
          <FormItem
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </FormItem>
          <FormItem
            name="bio"
            label="Bio"
            rules={[
              {
                required: true,
                message: "Please input your bio",
              },
            ]}
          >
            <Input.TextArea rows={5} />
          </FormItem>
          <FormItem name="avatar" label="Avatar">
            <Upload
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              maxCount={1}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </FormItem>
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
      </Modal>

      <Modal
        title="Login"
        open={isOpenLogin}
        onCancel={handleCloseLogin}
        onClose={handleCloseLogin}
        footer={
          <>
            <Button
              type="primary"
              onClick={() => {
                loginForm.submit();
              }}
            >
              Login
            </Button>
          </>
        }
      >
        <Form
          form={loginForm}
          onFinish={handleLoginForm}
          labelCol={{ span: 24 }}
        >
          <Form.Item name="login" hidden></Form.Item>
          <FormItem
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                message: "Please input your valid email",
              },
              {
                required: true,
                message: "Please input your email",
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </FormItem>
        </Form>
      </Modal>

      <Modal
        open={isOpenLive}
        title="Create a live"
        onCancel={() => setIsOpenLive(false)}
        footer={
          <>
            <Button
              type="primary"
              onClick={() => {
                liveForm.submit();
              }}
              loading={loading}
            >
              Go Live
            </Button>
          </>
        }
      >
        <Form
          form={liveForm}
          onFinish={handleLiveForm}
          labelCol={{ span: 24 }}
          encType="multipart/form-data"
        >
          <FormItem name="title" label="Title">
            <Input />
          </FormItem>
          <FormItem name="description" label="Description">
            <Input />
          </FormItem>
          <FormItem name="categories" label="Category">
            <Select
              options={[
                {
                  label: "LOL",
                  value: "lol",
                },
                {
                  label: "PUBG",
                  value: "pubg",
                },
                {
                  label: "CSGO",
                  value: "csgo",
                },
                {
                  label: "Valorant",
                  value: "valorant",
                },
              ]}
            />
          </FormItem>
          <FormItem name="thumbnail" label="Thumbnail">
            <Upload
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              maxCount={1}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default Header;
