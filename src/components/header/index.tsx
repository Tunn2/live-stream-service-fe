import {
  Alert,
  Avatar,
  Button,
  Flex,
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
  SearchOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import logoColor from "../../img/logo-color.png";
import logoWhite from "../../img/logo-white.png";
import SearchStreamer from "../Search/streamers";
import SearchStream from "../Search/streams";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import api from "../../configs/axios";
import Search from "antd/es/input/Search";

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
  const [categories, setCategories] = useState([]);
  const [inputValue, setInputValue] = useState(""); // New state for input
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
    formData.append("email", user.email);
    <Alert message="Informational Notes" type="info" showIcon />;
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
      toast.success(
        `Link RTMP: rtmp://localhost:1935/live\nStream key: ${user.email}`
      );
      setFileList([]);
      setLoading(false);
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

  // Handle input change and update state
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="header">
      <div className="header__left">
        <Link to="/">
          <Image src={logoWhite} width={200} preview={false} />
        </Link>
        <button
          onClick={async () => {
            const response = await api.get("streams/categories");
            setCategories(response.data.data);
            setIsOpenLive(true);
          }}
        >
          <Flex justify="space-around" align="center" gap={10}>
            <VideoCameraOutlined />
            Go Live
          </Flex>
        </button>
      </div>
      <div className="header__center">
        <Input
          placeholder="Search input"
          value={inputValue}
          onChange={handleInputChange} // Listen for input change
        />
        <button
          className="Search-button"
          onClick={() => {
            navigate(`/search/${inputValue}`);
            setInputValue("");
          }}
        >
          <SearchOutlined />
        </button>
        <button
          className="advance-search-button"
          onClick={() => {
            navigate("/advance-search");
          }}
        >
          Advance search
        </button>

        {/* Overlay, rendered when inputValue is not empty */}
        {inputValue.trim() !== "" && (
          <div className="overlay">
            <h2 className="preview-header">Streams</h2>
            <SearchStream
              searchQuery={inputValue}
              setSearchQuery={setInputValue}
            />
            <h2 className="preview-header">Streamers</h2>
            <SearchStreamer
              searchQuery={inputValue}
              setSearchQuery={setInputValue}
            />
          </div>
        )}
      </div>
      <div className="header__right">
        <Avatar
          size={"large"}
          icon={<UserOutlined />}
          src={user?.avatarUrl}
          onClick={() => {
            navigate(`/profile/${user?._id}`);
          }}
          style={{ cursor: "pointer" }}
        />
        <button
          style={{ color: "white", backgroundColor: "red" }}
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>

      <Modal
        open={isOpenLive}
        title="Create a live"
        onCancel={() => setIsOpenLive(false)}
        footer={
          <>
            <Button
              type="text"
              className="go-live-btn"
              onClick={() => {
                liveForm.submit();
              }}
              loading={loading}
            >
              Go Live
            </Button>
          </>
        }
        zIndex={1000}
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
          <FormItem name="categories" label="Category">
            <Select
              defaultValue={"N/A"}
              options={categories.map((category) => {
                return { value: category.name, label: category.name };
              })}
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
