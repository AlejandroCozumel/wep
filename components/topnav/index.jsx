import React from "react";
import Link from "next/link";
import { myAxios } from "../../utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Dropdown from "../drop";
import ThemeMenu from "../thememenu";
import Badge from "../badge";

import notifications from "../../assets/JsonData/notification.json";
import user_image from "../../assets/images/tuat.png";
import user_menu from "../../assets/JsonData/user_menus.json";
import Image from "next/image";

const curr_user = {
  display_name: "Mr Tomato",
  image: user_image,
};

const renderNotificationItem = (item, index) => (
  <div className="notification-item" key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const renderUserToggle = (user) => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__image">
      <Image src={user.image} alt="" />
    </div>
    <div className="topnav__right-user__name">{user.display_name}</div>
  </div>
);

const renderUserMenu = (item, index) => (
  <Link href="/" key={index}>
    <div className="notification-item">
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  </Link>
);

const TopNav = () => {
  const peticionGetIsOpen = async () => {
    const { data } = await myAxios({
      method: "get",
      url: `/isOpen`,
    });
    return data;
  };

  const peticionUpdateIsOpen = async () => {
    const { data } = await myAxios({
      method: "put",
      url: `/isOpen`,
      data: { isOpen: true },
    });
    return data;
  };

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    data: isOpen,
    error,
  } = useQuery(["isopen"], peticionGetIsOpen);

  const UpdateIsOpenProductMutation = useMutation(peticionUpdateIsOpen, {
    onSuccess: () => {
      queryClient.invalidateQueries("isopen");
    },
  });

  const handleIsOpen = () => {
    alert("hola");
    // UpdateIsOpenProductMutation.mutate();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="topnav">
      <div>
        {isOpen.isOpen ? (
          <div onClick={handleIsOpen}>
            <Badge type="success" content="Abierto" />
          </div>
        ) : (
          <div onClick={handleIsOpen}>
            <Badge type="danger" content="Cerrado" />
          </div>
        )}
      </div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          {/* dropdown here */}
          <Dropdown
            customToggle={() => renderUserToggle(curr_user)}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index)}
          />
        </div>
        <div className="topnav__right-item">
          <Dropdown
            icon="bx bx-bell"
            badge={10}
            contentData={notifications}
            renderItems={(item, index) => renderNotificationItem(item, index)}
            renderFooter={() => <Link href="/">View All</Link>}
          />
          {/* dropdown here */}
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
