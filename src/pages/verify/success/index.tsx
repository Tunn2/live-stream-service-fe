import { Button, Flex, Image } from "antd";
import logo from "../../../img/logo-color.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { logout } from "../../../redux/features/userSlice";
export default function VerifySuccess() {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user !== null) {
      dispatch(logout());
      localStorage.removeItem("token");
    }
  });
  return (
    <Flex
      vertical
      justify="center"
      align="center"
      gap={20}
      style={{ height: "100vh", width: "40vw", margin: "-150px auto" }}
    >
      <Image src={logo} width={350} preview={false} />
      <h1>Verify your email successfully</h1>
      <p>
        Thank you, your email has been <strong>verified</strong>. Your account
        is now active.
      </p>
      <p>Please use the link below to login to your account</p>
      <Button
        type="primary"
        size="large"
        style={{ backgroundColor: "purple" }}
        onClick={() => {
          navigate("/login");
        }}
      >
        Login to your account
      </Button>
    </Flex>
  );
}
