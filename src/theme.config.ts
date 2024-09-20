const PRIMARY_TEXT = "#bfa75d"; // gold
const PRIMARY_BG = "#670404"; // red
const PRIMARY_GRAY = "#9e9e9e";

const THEME_CONFIG = {
  token: {
    colorPrimary: PRIMARY_TEXT,
    colorBorder: PRIMARY_TEXT,
    colorBorderSecondary: PRIMARY_TEXT,
    colorText: PRIMARY_TEXT,
  },
  components: {
    Button: {
      colorPrimary: PRIMARY_BG,
      colorBorder: PRIMARY_TEXT,
      colorPrimaryBgHover: PRIMARY_BG,
      colorPrimaryHover: PRIMARY_BG,
      colorText: PRIMARY_TEXT,
      defaultBorderColor: PRIMARY_TEXT,
      defaultColor: PRIMARY_TEXT,
    },
    Input: {
      colorPrimary: PRIMARY_BG,
      colorBorder: PRIMARY_GRAY,
      colorPrimaryBgHover: PRIMARY_BG,
      colorPrimaryHover: PRIMARY_BG,
      colorText: PRIMARY_BG,
      defaultBorderColor: PRIMARY_TEXT,
      defaultColor: PRIMARY_BG,
    },
    Select: {
      colorPrimary: PRIMARY_BG,
      colorBorder: PRIMARY_GRAY,
      colorPrimaryBgHover: PRIMARY_BG,
      colorPrimaryHover: PRIMARY_BG,
      colorText: PRIMARY_BG,
      defaultBorderColor: PRIMARY_BG,
      defaultColor: PRIMARY_BG,
    },
    Modal: {
        colorPrimary: PRIMARY_BG,
        colorBorder: PRIMARY_TEXT,
        colorPrimaryBgHover: PRIMARY_BG,
        colorPrimaryHover: PRIMARY_BG,
        colorText: PRIMARY_TEXT,
        defaultBorderColor: PRIMARY_TEXT,
        defaultColor: PRIMARY_TEXT,
      }
  },
};

export default THEME_CONFIG;
