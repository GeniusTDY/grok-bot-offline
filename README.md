# Grok Bot 0.18 —— 重建与扩展版

对公开发布的 Grok Bot 0.18.0 桌面应用的非官方、面向源码重建。支持 macOS arm64 与未签名的 Windows x64 便携目录。

Windows 便携版提供**免登录 Local 9Router 工作区**：9Router 提供模型推理，本地 Docker 虚拟机提供 agent/shell/文件/电脑能力，不创建或模拟 Cursor 会话。

> 这是研究与破解项目，非 Anysphere 官方代码，也不是官方发行版。仅重建固定 0.18.0 版本。

## 主要特性

- **推理路由器**：`Settings → Router` 切换后端
  - Cursor（默认）、Claude Code、Codex：复用各自本地登录
  - OpenRouter：API key
  - OpenAI 兼容 / 9Router（内部 ID `cli-proxy`）:专用加密 key
- **本地 Docker 沙箱**：用自有本地容器替代远端箱子（`Use local Docker VM`）
- 免登录本地工作区、路由推理用量统计、重建设置界面

### 9Router / OpenAI 兼容设置

1. 在登录界面选 **Configure 9Router**（或 `Settings → Router`）。
2. 提供方选 **OpenAI-compatible / 9Router**。
3. 填 Base URL（如 `http://100.112.10.8:20128/v1`）、proxy/client API key、模型 ID，保存。
4. 连接本地/远端模型端点时只走已认证的 `/v1`；loopback 外默认拒绝明文 HTTP，Tailscale IP 需单独开关。
5. 免登录工作区需启用 `Use local Docker VM`，且需 Docker Desktop 运行。

## 环境要求

- Node.js 26.5.x + Git LFS
- macOS 打包：Apple Silicon + Xcode CLT
- Windows 打包：Windows 10/11 x64；Docker Desktop（仅本地 Docker 工作区需要）

## 保留的原始安装程序

存放于 `research-archives/original/0.18.0/`。

| 平台 | 文件 | SHA-256 |
| --- | --- | --- |
| macOS arm64 | `macos-arm64/Grok_Bot_0.18.0.dmg` | `a253ccd8aab01e083f9812a0264354c5034d8ba7f0610bbb557e82ae77d203eb` |
| Windows x64 | `windows-x64/Grok_Bot_0.18.0_Setup.exe` | `464079a15ef5fa8b61ccea8fffcc78f63cfcf6df65fb0ad5e725d8b95f7e437e` |

### 获取 Windows Setup.exe

Setup.exe 是 GitHub Release 资产（不在 git 中，勿用 `git lfs pull`）。一次性下载并放置到：

`research-archives/original/0.18.0/windows-x64/Grok_Bot_0.18.0_Setup.exe`

```
https://github.com/GeniusTDY/grok-bot-offline/releases/download/v0.18.0-offline/Grok_Bot_0.18.0_Setup.exe
```

```sh
sha256sum Grok_Bot_0.18.0_Setup.exe
# 464079a15ef5fa8b61ccea8fffcc78f63cfcf6df65fb0ad5e725d8b95f7e437e
```

## 离线 / 完全断网构建（端到端一键部署）

共三步，仅 Setup.exe 下载和第 2 步需要联网：

1. **准备 Setup.exe**：下载并放置到上述路径。
2. **生成离线快照**（联网 Windows 机器，一次性）：`online-fetch.cmd` → 产出 `offline/cache/node_modules-snapshot.tar.gz` 和 `tree-sitter-node-cache.tar.gz`（唯一联网步）。
3. **离线机器一键构建**：把整个仓库（含 `offline/`、`research-archives/`）拷到无网、无 Node 的机器，运行 `offline-build.cmd`。产物：`dist/Grok Bot 0.18 Reconstructed-win32-x64/`（完全离线自包含）。

> 若快照随仓库一起分发，可跳过第 2 步。若快照缺失，`offline-build.cmd` 会先 `restore` 恢复。

## macOS 快速构建

```sh
git clone <repo-url> && cd grok-bot-0.18-reconstructed
git lfs install && git lfs pull
npm ci && npm run bootstrap && npm run check && npm run package
open "dist/Grok Bot 0.18 Reconstructed.app"
```

## Windows x64 便携构建（联网开发机）

校验 Setup 校验和 → 用固定 `7zip-bin` 解包（不执行 NSIS）→ 替换为重建负载 → 输出目录。

```powershell
git lfs install
git lfs pull --include="research-archives/original/0.18.0/windows-x64/Grok_Bot_0.18.0_Setup.exe" --exclude=""
npm ci
npm run bootstrap:windows
npm run typecheck
npm run source:typecheck
npm run test:windows
npm run package:windows
npm run verify:windows
npm run smoke:windows
```

产物：`dist/Grok Bot 0.18 Reconstructed-win32-x64/Grok Bot 0.18 Reconstructed.exe`

## 架构

```mermaid
flowchart TD
    UI["Renderer"] --> Main["Electron main"]
    Main --> Coordinator["Coordinator"]
    Coordinator --> Host["Local Docker host"]
    Host --> Router["9Router over Tailscale"]
    Host --> Tools["Agents, shell, files, computer"]
```

主要目录：

- `source/electron-main/` 桌面生命周期/设置/认证/协调器
- `source/electron-preload/` 可信 UI 桥
- `source/host/` 推理/工具/MCP/回合
- `source/shared/` 共享契约
- `frontend/` 可读渲染器重建
- `scripts/` 引导/编译/打包/签名/校验
- `tests/` 回归测试

## 主要命令

```sh
npm test                  # 回归测试
npm run typecheck         # 渲染器 TS
npm run source:typecheck  # 运行时 TS
npm run package           # 构建/签名/校验 macOS 应用
npm run package:windows   # Windows x64 便携目录
npm run verify:windows    # 校验该目录
npm run smoke:windows     # 打包后启动 smoke
```

## 项目状态

应用可启动，路由推理、插件与本地 Docker 沙箱可用。仍为实验性重建，不承诺与未来版本兼容。

其他文档：[CONTRIBUTING.md](CONTRIBUTING.md) · [docs/PUBLISHING.md](docs/PUBLISHING.md) · [PROVENANCE.md](PROVENANCE.md) · [NOTICE.md](NOTICE.md)