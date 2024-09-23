import React, { useEffect, useState, useRef } from "react";
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
import {
  UserOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/features/userSlice";

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
  const [loading, setLoading] = useState(false); // Loading state for save button
  const [disable, setDisable] = useState(true);
  const [form] = Form.useForm(); // Form instance for reset
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null); // Ref for file input

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newFileList = [{
        uid: files[0].name,
        name: files[0].name,
        status: 'done',
        url: URL.createObjectURL(files[0]),
        originFileObj: files[0],
      }];
      setFileList(newFileList);
    }
  };

  const onFinish = async (values) => {
    let response = null;

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    if (fileList.length > 0) {
      formData.append("avatar", fileList[0].originFileObj); // Add the new image
    }

    try {
      setLoading(true); // Set loading state to true
      response = await api.patch(`users/${user?._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { password, createdAt, updatedAt, isActive, ...result } =
        response.data.data;
      dispatch(login(result)); // Update user data in userSlice
      setDisable(true);
      setFileList([]);
      toast.success("Update successfully");
    } catch (error) {
      toast.error(error.response?.data.error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form fields
    setFileList([]); // Reset uploaded file list
    setDisable(true); // Disable form editing
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md ? `${token.paddingXL}px` : `${token.paddingXL}px ${token.padding}px`,
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

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title>Your Information</Title>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileInputChange}
          />
          <Avatar
            size={64}
            icon={<UserOutlined />}
            src={fileList.length > 0 ? fileList[0].url : user?.avatarUrl}
            style={{ cursor: "pointer" }}
            onClick={() => fileInputRef.current.click()} // Trigger file input
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
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" disabled={disable} />
          </Form.Item>
          <Form.Item
            name="bio"
            label="Bio"
            rules={[{ required: true, message: "Please input your bio" }]}
          >
            <Input.TextArea rows={1} disabled={disable} />
          </Form.Item>
          <Form.Item>
            <Button block onClick={() => setDisable(false)} style={{ marginBottom: "20px" }} disabled={loading}>
              Edit
            </Button>
            <Button block type="primary" htmlType="submit" loading={loading} disabled={disable || loading} style={{ marginBottom: "20px" }}>
              Save
            </Button>
            <Button block danger onClick={handleCancel} disabled={disable || loading}>
              Cancel
            </Button>
          </Form.Item>
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
    </section>
  );
}
