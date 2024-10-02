import { Button, Flex, Form, Image, Input } from "antd";
import logo from "../../img/logo-color.png";
import Title from "antd/es/typography/Title";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { logout } from "../../redux/features/userSlice";
import axios from "axios";
export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [isLoadingResetPassword, setIsLoadingResetPassword] = useState(false);
  const handleSubmitResetPassword = async (
    token: string,
    newPassword: string
  ) => {
    try {
      setIsLoadingResetPassword(true);
      if (!token) {
        toast.error("Token not found");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users/resetPassword/${token}`,
        { newPassword}
      );
      toast.success(response.data.message + " Redirecting to login page...");
      setTimeout(() => {
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data.error);
    } finally {
      setIsLoadingResetPassword(false);
    }
  };

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      gap={20}
      style={{ height: "100vh", width: "40vw", margin: "-150px auto" }}
    >
      <Image src={logo} width={350} preview={false} />
      <Title level={2}>Reset Password</Title>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
        style={{ width: "80%" }}
        onFinish={(values) => {
          if (token) {
            handleSubmitResetPassword(token, values.newPassword);
          } else {
            toast.error("Token not found");
          }
        }}
      >
        <Form.Item
          label="New Password"
          name={"newPassword"}
          rules={[
            { required: true, message: "Please input your new password" },
            () => ({
              validator(_, value) {
                if (
                  value.length < 6 ||
                  !/[A-Z]/.test(value) ||
                  !/[a-z]/.test(value) ||
                  !/[0-9]/.test(value) ||
                  !/[!@#$%^&*]/.test(value)
                ) {
                  return Promise.reject(
                    new Error(
                      "Password must be at least 8 characters and include at least a number, symbol, UPPERCASE & lowercase letter"
                    )
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name={"confirmPassword"}
          rules={[
            {
              required: true,
              message: "Please confirm your password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value === getFieldValue("newPassword")) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                }
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoadingResetPassword}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}
