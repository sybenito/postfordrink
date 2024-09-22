const PRIMARY_TEXT = "#bfa75d"; // gold
const PRIMARY_BG = "#670404"; // red
const PRIMARY_GRAY = "#9e9e9e";
const PRIMARY_BLACK = "#1e1e1e";

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
      colorPrimary: PRIMARY_TEXT,
      colorBorder: PRIMARY_TEXT,
      colorPrimaryBgHover: PRIMARY_BG,
      colorPrimaryHover: PRIMARY_BG,
      colorText: PRIMARY_TEXT,
      defaultBorderColor: PRIMARY_TEXT,
      defaultColor: PRIMARY_BG,
      colorBgContainer: PRIMARY_BLACK,
      colorTextPlaceholder: PRIMARY_TEXT,
    },
    Select: {
      colorPrimary: PRIMARY_TEXT,
      colorBorder: PRIMARY_TEXT,
      colorPrimaryBgHover: PRIMARY_BG,
      colorPrimaryHover: PRIMARY_BG,
      colorText: PRIMARY_TEXT,
      defaultBorderColor: PRIMARY_TEXT,
      defaultColor: PRIMARY_BG,
      colorBgContainer: PRIMARY_BLACK,
      colorTextPlaceholder: PRIMARY_TEXT,
      optionSelectedColor: PRIMARY_TEXT,
    },
    Modal: {
        colorPrimary: PRIMARY_BG,
        colorBorder: PRIMARY_TEXT,
        colorPrimaryBgHover: PRIMARY_BG,
        colorPrimaryHover: PRIMARY_BG,
        colorText: PRIMARY_TEXT,
        defaultBorderColor: PRIMARY_TEXT,
        defaultColor: PRIMARY_TEXT,
        contentBg: PRIMARY_BLACK,
        footerBg: PRIMARY_BLACK,
        headerBg: PRIMARY_BLACK,
      }
  },
};

export default THEME_CONFIG;
