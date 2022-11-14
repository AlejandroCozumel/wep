import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

import logo from "../../assets/images/logo.png";

import sidebar_items from "../../assets/JsonData/sidebar_routes.json";

const SidebarItems = (props) => {
  const active = props.active ? "active" : "";
  return (
    <div className="sidebar__item">
      <Link href={props.route}>
        <div
          onClick={props.icon.includes("menu") ? props.onClick : null}
          className={`sidebar__item-inner ${active}`}
        >
          <i className={props.icon}></i>
          <span>{props.title}</span>
        </div>
      </Link>
    </div>
  );
};

const Sidebar = () => {
  const router = useRouter();

  const activeItem = sidebar_items.findIndex(
    (item) => item.route === router.pathname
  );
  return (
    <>
      <div className='sidebar'>
        <div className="sidebar__logo">
          <Link href="/profile">
            <Image src={logo} alt="company logo" />
          </Link>
        </div>
        {sidebar_items.map((item, index) => (
          <SidebarItems
            key={index}
            title={item.display_name}
            icon={item.icon}
            active={index === activeItem}
            route={item.route}
          />
        ))}
      </div>
    </>
  );
};

export default Sidebar;
