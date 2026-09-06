/**
 * English -> Simplified Chinese translation dictionary used by the deep
 * translation engine. Keys are canonical English UI strings; values are their
 * Simplified Chinese equivalents.
 *
 * This dictionary powers DOM-level deep translation so the entire reconstructed
 * renderer (including byte-injected surfaces such as the Router settings panel)
 * can show Simplified Chinese when the Electron system language is Chinese.
 */
import type { AppLanguage } from "./locale";

export type TranslationDictionary = Readonly<Record<string, string>>;

export const ZH_TRANSLATIONS: TranslationDictionary = {
  // ---- Welcome / no-login (injected) ----
  "Continue without signing in": "在不登录的情况下继续",
  "Finish 9Router setup": "完成 9Router 设置",
  "Configure 9Router": "配置 9Router",
  "Local 9Router is ready. Continue without signing in.": "本地 9Router 已就绪，可以跳过登录继续使用。",
  "Checking your local 9Router workspace…": "正在检查本地 9Router 工作区…",
  "Finish the Local 9Router setup to continue without signing in.": "请先完成本地 9Router 设置，再跳过登录继续使用。",
  "Finish the local 9Router setup to continue without signing in.": "请先完成本地 9Router 设置，再跳过登录继续使用。",
  "OpenAI-compatible / 9Router": "OpenAI 兼容 / 9Router",
  "Route through local 9Router at 127.0.0.1:20128 or another reviewed OpenAI-compatible endpoint.": "通过本机 127.0.0.1:20128 的 9Router 或其他经过审核的 OpenAI 兼容端点路由。",
  "Your local 9Router workspace": "你的本地 9Router 工作区",
  "Router": "路由",

  // ---- Top-level navigation / chrome ----
  "Settings": "设置",
  "Account": "账户",
  "About": "关于",
  "Help Center": "帮助中心",
  "Plugins": "插件",
  "Updates": "更新",
  "Usage & Billing": "用量与账单",
  "General": "常规",
  "Search": "搜索",
  "New chat": "新建会话",
  "No chats yet": "还没有会话",

  // ---- Auth / sign in ----
  "Sign in": "登录",
  "Sign out": "退出登录",
  "Sign out?": "确定退出登录？",
  "Continue in your browser": "在浏览器中继续",
  "Reopen link": "重新打开链接",
  "Cancel": "取消",
  "Close": "关闭",
  "Use your signed-in Cursor account.": "使用已登录的 Cursor 账户。",
  "Use your existing Claude Code sign-in and Grok Bot's connected plugins.": "使用已有的 Claude Code 登录状态以及 Grok Bot 已连接的插件。",
  "Use your existing ChatGPT sign-in from Codex with Grok Bot's connected plugins.": "使用 Codex 中已有的 ChatGPT 登录状态，并配合 Grok Bot 已连接的插件。",
  "Route through your OpenRouter account and selected model.": "通过你的 OpenRouter 账户和所选模型进行路由。",

  // ---- Feedback ----
  "Send Feedback": "发送反馈",
  "Copied": "已复制",
  "Copy version info": "复制版本信息",

  // ---- Account / sidebar ----
  "Hidden Bots": "隐藏的机器人",
  "Log out": "退出登录",
  "Weekly usage": "每周用量",
  "Spend this cycle": "本周期花费",
  "On-demand": "按需",
  "Included": "已包含",
  "Change limit": "更改限额",
  "Get Grok Bot for iOS": "获取 iOS 版 Grok Bot",
};

export const EMPTY_TRANSLATION: Readonly<Record<AppLanguage, TranslationDictionary>> = {
  en: {},
  zh: ZH_TRANSLATIONS,
};