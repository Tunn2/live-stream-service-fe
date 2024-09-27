import { Button, Flex, Image } from "antd";
import { useLocation } from "react-router-dom";
import logo from "../../img/logo-color.png";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
export default function Verify() {
  const locationState = useLocation()?.state || {};
  const { email } = locationState;
  const user = useSelector((store) => store.user);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(30);

  const resendEmail = (email) => {
    axios.get(`http://localhost:4000/api/auth/verify/resend?email=${email}`);
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

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      gap={20}
      style={{ height: "100vh", width: "40vw", margin: "-150px auto" }}
    >
      <Image src={logo} width={350} preview={false} />
      <h1>Verify your email</h1>
      <p>
        We've sent an verification link your email address and activate your
        account. The link in the email will expire in 24 hours.{" "}
      </p>
      <p style={{ color: "grey" }}>
        Please check your spam folder if you don't see the email immediately
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
