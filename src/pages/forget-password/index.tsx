import { Flex, Form, Image, Input, Button } from "antd";
import React, { useEffect, useState } from "react";
import logo from "../../img/logo-color.png";
import Title from "antd/es/typography/Title";
import { MailOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
export default function ForgetPassword() {
  const [isLoadingResetPassword, setIsLoadingResetPassword] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleSendResetPasswordLink = async (email: string) => {
    try {
      setIsLoadingResetPassword(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users/resetPassword`,
        { email }
      );
      toast.success(response.data.message + " Please check your email");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setIsLoadingResetPassword(false);
      setIsButtonDisabled(true);
    }
  };
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isButtonDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            return 30;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isButtonDisabled]);

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      gap={20}
      style={{ height: "100vh", width: "40vw", margin: "-150px auto" }}
    >
      <Image src={logo} width={350} preview={false} />
      <Title level={2}>Forget your password?</Title>
      <p>
        Please fill in your <strong>email address</strong> for us to send you
        the reset password link
      </p>
      <Form
        style={{ width: "300px" }}
        onFinish={(values) => {
          handleSendResetPasswordLink(values.email);
        }}
      >
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <center>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoadingResetPassword}
              disabled={isButtonDisabled}
            >
              Send reset password link {isButtonDisabled ? `(${timer})` : ""}
            </Button>
          </Form.Item>
        </center>
      </Form>
    </Flex>
  );
}
