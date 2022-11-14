const setMode = (mode) => {
  return {
    type: "SET_MODE",
    payload: mode,
  };
};

const setColor = (color) => {
  return {
    type: "SET_COLOR",
    payload: color,
  };
};

const setNavbar = (isActive) => {
  return {
    type: "SET_NAVBAR",
    payload: isActive,
  };
};

const getTheme = () => {
  return {
    type: "GET_THEME",
  };
};

const exportDefault = {
  setColor,
  setMode,
  getTheme,
  setNavbar,
};

export default exportDefault;
