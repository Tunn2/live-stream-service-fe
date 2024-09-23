import {
  Avatar,
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Upload,
} from "antd";
import "./index.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import {
  LoadingOutlined,
  PlusOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import logo from "../../img/logo-color.png";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function Header() {
  const [isOpenLive, setIsOpenLive] = useState(false);
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

  const handleCloseCreateStream = () => {
    liveForm.resetFields();
    setIsOpenLive(false);
  };

  const handleLiveForm = async (value) => {
    setLoading(true);
    let response = null;
    const formData = new FormData();
    Object.keys(value).forEach((key) => {
      formData.append(key, value[key]);
    });
    console.log(user.email);
    formData.append("email", user.email);
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
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="header__left">
        <Link to="/">
          <img src={logo} alt="" />
        </Link>
        <button style={{ width: 76 }} onClick={() => setIsOpenLive(true)}>
          <VideoCameraOutlined />
        </button>
      </div>
      <div className="header__right">
        <Avatar size={"large"} icon={<UserOutlined />} src={user?.avatarUrl} />
        <button onClick={handleLogout}>Log out</button>
      </div>

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
    </div>
  );
}

export default Header;
