import { Form, Input, message, Modal, Upload } from "antd";
import "./index.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header() {
  const [isOpenSignUp, setIsOpenSignUp] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);

  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
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

  const handleCloseSignUp = () => {
    form.resetFields();
    setIsOpenSignUp(false);
  };

  const handleCloseLogin = () => {
    form.resetFields();
    setIsOpenLogin(false);
  };

  return (
    <div className="header">
      <div className="header__left">
        <Link to="">
          <img src={logo} alt="" />
        </Link>
      </div>
      <div className="header__right">
        <button
          onClick={() => {
            setIsOpenLogin(true);
          }}
        >
          Log in
        </button>
        <button
          onClick={() => {
            setIsOpenSignUp(true);
          }}
        >
          Sign up
        </button>
      </div>

      <Modal
        open={isOpenSignUp}
        title="Sign Up"
        onCancel={handleCloseSignUp}
        onClose={handleCloseSignUp}
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          onFinish={(values) => {
            console.log("Success:", values);
          }}
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
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </FormItem>
        </Form>
      </Modal>

      <Modal
        title="Login"
        open={isOpenLogin}
        onCancel={handleCloseLogin}
        onClose={handleCloseLogin}
      >
        <Form form={form} labelCol={{ span: 24 }}>
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
    </div>
  );
}

export default Header;
