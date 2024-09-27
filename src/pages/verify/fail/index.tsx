import { Flex, Image } from "antd";
import logo from "../../../img/logo-color.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { logout } from "../../../redux/features/userSlice";
import Title from "antd/es/typography/Title";
export default function VerifyFail() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user !== null) {
      dispatch(logout());
      localStorage.removeItem("token");
    }
  }, []);
  return (
    <Flex
      vertical
      justify="center"
      align="center"
      gap={20}
      style={{ height: "100vh", width: "40vw", margin: "-150px auto" }}
    >
      <Image src={logo} width={350} preview={false} />
      <Title level={2}>Verify your email failed</Title>
      <p>Sorry, we couldn't verify your email. Please try again later.</p>
    </Flex>
  );
}
