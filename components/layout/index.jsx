import React, { useEffect } from "react";

import TopNav from "../topnav";
import Sidebar from "../sidebar";

import { useSelector, useDispatch } from "react-redux";
import ThemeAction from "../../redux/actions/ThemeAction";

const Layout = ({ children, ...props }) => {
  const themeReducer = useSelector((state) => state.ThemeReducer);
  console.log("themeReducer", themeReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    const themeClass = localStorage.getItem("themeMode", "theme-mode-light");
    const colorClass = localStorage.getItem("colorMode", "theme-mode-light");

    dispatch(ThemeAction.setMode(themeClass));
    dispatch(ThemeAction.setColor(colorClass));
  }, [dispatch]);

  return (
    <>
      <div className={`layout ${themeReducer.mode} ${themeReducer.color} `}>
        <Sidebar {...props} />
        <div className={`layout__content ${themeReducer?.isActive ? "" : "sidebar-width-none"}`}>
          <TopNav />
          <div className="layout__content-main">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
