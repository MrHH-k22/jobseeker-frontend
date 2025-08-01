import { useState, useEffect } from "react";
import {
  CodeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  RiseOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from "antd";
import { Menu, ConfigProvider } from "antd";
import styles from "@/styles/client.module.scss";
import { isMobile } from "react-device-detect";
import { FaReact } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { callLogout } from "@/config/api";
import { setLogoutAction } from "@/redux/slice/accountSlide";

const Header = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

  const [current, setCurrent] = useState("home");
  const location = useLocation();

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const items: MenuProps["items"] = [
    {
      label: <Link to={"/"}>Trang Chủ</Link>,
      key: "/",
      icon: <TwitterOutlined />,
    },
    {
      label: <Link to={"/job"}>Việc Làm IT</Link>,
      key: "/job",
      icon: <CodeOutlined />,
    },
    {
      label: <Link to={"/company"}>Top Công ty IT</Link>,
      key: "/company",
      icon: <RiseOutlined />,
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && +res.statusCode === 200) {
      dispatch(setLogoutAction({}));
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  const handleDashBoard = () => {
    navigate("/admin");
  };

  const itemsDropdown = [
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined />,
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleDashBoard()}>
          Dashboard
        </label>
      ),
      key: "dashboard",
      icon: <RiseOutlined />,
    },
  ];

  const itemsMobiles = [...items, ...itemsDropdown];

  return (
    <>
      <div className={styles["header-section"]}>
        <div className={styles["container"]}>
          {!isMobile ? (
            <div style={{ display: "flex", gap: 30 }}>
              <div className={styles["brand"]}>
                <FaReact onClick={() => navigate("/")} title="Hỏi Dân IT" />
              </div>
              <div className={styles["top-menu"]}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#fff",
                      colorBgContainer: "#222831",
                      colorText: "#a7a7a7",
                    },
                  }}
                >
                  <Menu
                    // onClick={onClick}
                    selectedKeys={[current]}
                    mode="horizontal"
                    items={items}
                  />
                </ConfigProvider>
                <div className={styles["extra"]}>
                  {isAuthenticated === false ? (
                    <Link to={"/login"}>Đăng Nhập</Link>
                  ) : (
                    <Dropdown
                      menu={{ items: itemsDropdown }}
                      trigger={["click"]}
                    >
                      <Space style={{ cursor: "pointer" }}>
                        <span>Welcome {user?.name}</span>
                        <Avatar>
                          {" "}
                          {user?.name?.substring(0, 2)?.toUpperCase()}{" "}
                        </Avatar>
                      </Space>
                    </Dropdown>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles["header-mobile"]}>
              <span>Your APP</span>
              <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
            </div>
          )}
        </div>
      </div>
      <Drawer
        title="Chức năng"
        placement="right"
        onClose={() => setOpenMobileMenu(false)}
        open={openMobileMenu}
      >
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="vertical"
          items={itemsMobiles}
        />
      </Drawer>
    </>
  );
};

export default Header;
