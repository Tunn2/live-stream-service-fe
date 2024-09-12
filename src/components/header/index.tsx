import { Button, Form, Image, Input, Modal, Upload } from "antd";
import "./index.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
import "react-toastify/dist/ReactToastify.css";
import handleFileUpload from "../../utils/upload";
import axios from "axios";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

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

  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

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
    form.resetFields();
    setIsOpenLogin(false);
  };

  const handleSubmitForm = async (value) => {
    // Create a FormData object to handle file uploads
    const formData = new FormData();

    // Append regular form fields
    Object.keys(value).forEach((key) => {
      formData.append(key, value[key]);
    });

    // Append the file to the FormData object
    if (fileList.length > 0) {
      formData.append("avatar", fileList[0].originFileObj);
    }

    let response = null;
    try {
      response = await axios.post(
        "http://localhost:4000/api/auth/signup",
        formData, // Pass the FormData object instead of value
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const token = response.data?.accessToken;
      localStorage.setItem("token", token);
      const result = jwtDecode(token);
      console.log(result);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data.error);
    }

    handleCloseSignUp();
  };

  // Function to handle the file upload
  // const handleUpload = async (file) => {
  //   setLoading(true);

  //   const uniqueFileName = `${Date.now()}-${file.name}`; // Generate a unique file name

  //   try {
  //     // Upload to BunnyCDN
  //     const response = await axios.put(
  //       `https://storage.bunnycdn.com/live-stream-service/${uniqueFileName}`,
  //       file,
  //       {
  //         headers: {
  //           AccessKey: "e68740b8-e7b2-4df2-82b616b8ab35-77e2-42d6", // Replace with your actual access key
  //           "Content-Type": file.type, // The file's MIME type
  //         },
  //       }
  //     );

  //     if (response.status === 201) {
  //       console.log("File uploaded successfully:", response);
  //       return `https://live-stream-service.b-cdn.net/${uniqueFileName}`; // Your CDN URL for the file
  //     } else {
  //       console.error("Failed to upload the file");
  //     }
  //   } catch (error) {
  //     console.error("Error uploading the file:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
          labelCol={{ span: 24 }}
          onFinish={handleSubmitForm}
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
              // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
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
