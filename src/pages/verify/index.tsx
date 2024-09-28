import { Button, Flex, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../../img/logo-color.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { logout } from "../../redux/features/userSlice";
import Title from "antd/es/typography/Title";
import { User } from "../../model/user";
import { toast } from "react-toastify";
import { RollbackOutlined } from "@ant-design/icons";

export default function Verify() {
  const locationState = useLocation()?.state || {};
  const { email } = locationState;
  const user = useSelector((store: { user: User }) => store.user);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resendEmail = (email: string) => {
    axios
      .get(`http://localhost:4000/api/auth/verify/resend?email=${email}`)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err.response.data.error);
        toast.error(err.response.data.error);
      });
    setIsButtonDisabled(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isButtonDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsButtonDisabled(false);
            return 30;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isButtonDisabled]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const handleGoBack = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      gap={20}
      style={{ height: "100vh", width: "40vw", margin: "-150px auto" }}
    >
      <Button
        type="primary"
        style={{
          position: "absolute",
          top: 20,
          left: 20,
        }}
        onClick={handleGoBack}
      >
        <RollbackOutlined/>
        Go back to login
      </Button>

      <Image src={logo} width={350} preview={false} />
      <Title level={2}>Verify your email</Title>
      <p>
        We've sent a verification link to your email address. The link in the
        email will expire in 24 hours.
      </p>
      <p style={{ color: "grey" }}>
        Please check your spam folder if you don't see the email immediately.
      </p>
      <Button
        type="dashed"
        size="large"
        onClick={() => {
          window.open("https://gmail.com");
        }}
      >
        <Image
          width={20}
          src="https://cdn-icons-png.flaticon.com/512/5968/5968534.png"
        />
        Go to Gmail
      </Button>
      <Button
        onClick={() => {
          resendEmail(email ?? user?.email);
        }}
        disabled={isButtonDisabled}
      >
        Resend verification email {isButtonDisabled ? `(${timer})` : ""}
      </Button>
    </Flex>
  );
}
