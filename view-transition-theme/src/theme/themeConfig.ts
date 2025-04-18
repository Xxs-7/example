import type { ThemeConfig } from "antd";

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#6a5acd", // 主蓝紫色
    colorInfo: "#5B7FFF", // 信息蓝色
    colorSuccess: "#52C41A", // 成功绿色
    colorWarning: "#FAAD14", // 警告橙色
    colorError: "#FF4D4F", // 错误红色
    colorInfoBg: "#f0f5ff", // 信息状态背景色
    colorSuccessBg: "#f6ffed", // 成功状态背景色
    colorWarningBg: "#fffbe6", // 警告状态背景色
    colorErrorBg: "#fff2f0", // 错误状态背景色

    colorBgContainer: "#FFF", // 浅紫色背景
    colorBgElevated: "#ffffff", // 白色浮层背景
    colorBorder: "#c1b3ff", // 浅紫边框
    colorBorderSecondary: "#e8e4ff", // 更浅的二级边框

    colorText: "#000", // 深紫灰色文字
    colorTextSecondary: "#655d8d", // 次级紫灰色
    colorTextTertiary: "#938db5", // 三级浅紫灰
    colorTextQuaternary: "#c3bfd9", // 最浅辅助文本
  },
  components: {
    Button: {
      primaryShadow: "none",
      // colorPrimaryHover: "#8474d4", // 悬浮加深
      // colorPrimaryActive: "#5044a3", // 点击更深
      // colorBgContainer: "#ffffff", // 默认按钮背景色
      // colorPrimary: "#6a5acd", // 主按钮背景色
      // defaultActiveColor: "#f8f9ff",
      // defaultActiveBorderColor: "#c1b3ff",
      // defaultActiveBg: "#e8e4ff",
    },
    Menu: {
      // colorItemBgHover: "#f0edff", // 菜单悬浮背景
      // colorItemBgSelected: "#e6e1ff", // 菜单选中背景
    },
    Card: {
      // colorBgContainer: "#f8f9ff", // 卡片背景色
    },
  },
  // cssVar: {
  //   prefix: "x-",
  // },
  cssVar: true,
  hashed: false,
};

export const darkTheme: ThemeConfig = {
  token: {
    // seed token
    colorPrimary: "#8474d4", // 稍亮的蓝紫色
    colorInfo: "#597EFF", // 暗色主题下的信息蓝
    colorSuccess: "#49AA19", // 暗色主题下的成功绿
    colorWarning: "#D89614", // 暗色主题下的警告橙
    colorError: "#DC4446", // 暗色主题下的错误红
    colorInfoBg: "#111d2c", // 暗色主题下的信息背景
    colorSuccessBg: "#162312", // 暗色主题下的成功背景
    colorWarningBg: "#2b2111", // 暗色主题下的警告背景
    colorErrorBg: "#2a1215", // 暗色主题下的错误背景

    colorBgContainer: "#000", // 深紫色背景
    colorBgElevated: "#2a2748", // 浮层深紫
    colorBorder: "#4a4573", // 紫色边框
    colorBorderSecondary: "#363359", // 深紫边框

    colorText: "#FFF", // 浅紫灰色文字
    colorTextSecondary: "#a8a3cc", // 次级灰紫
    colorTextTertiary: "#7873a3", // 三级中灰紫
    colorTextQuaternary: "#4d4973", // 最暗辅助文本
  },
  components: {
    Button: {
      primaryShadow: "none",

      // colorPrimaryHover: "#9c8dff", // 悬浮变亮
      // colorPrimaryActive: "#6a5acd", // 点击恢复基础色
      // // primaryShadow: "0 2px 0 #8474d4", // 移除主按钮阴影
      // defaultActiveColor: "#6a5acd",
      // defaultActiveBorderColor: "#8474d4",
      // defaultActiveBg: "#f0edff",
    },
    // Menu: {
    //   colorItemBgHover: "#2f2c4d", // 深色悬浮背景
    //   colorItemBgSelected: "#3a3666", // 深色选中背景
    // },
    // Card: {
    //   colorBgContainer: "#211d3d", // 深色卡片背景色
    //   colorBorderSecondary: "#363359", // 卡片边框色
    // },
  },
  cssVar: true,
  hashed: false,
};
