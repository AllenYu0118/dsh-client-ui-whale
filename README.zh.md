# dsh-client-ui-whale

一个给 DeepSeek Harness（DSH）Web UI 用的小客户端插件：在对话列右侧放一只
DeepSeek 鲸鱼 logo，喷水的高度、水滴数量与大小会随当前会话的 token **消耗速度**
（tokens/秒）变化——token 流得越快，鲸鱼喷得越高越猛。

> 鲸鱼是官方 DeepSeek logo 形状（取自随附的 favicon），填充品牌蓝。
> DeepSeek 是 DeepSeek 的商标；本插件是独立的非官方爱好者项目。

## 演示

![鲸鱼喷水演示](docs/whale-demo.gif)

喷水高度、水滴数量与水滴大小都随实时 token 消耗速度变化：空闲时不喷水，
流式生成越快，喷得越高越宽。

## 特性

- **悬浮鲸鱼**：紧贴对话列右侧（空间不足时回退到视口角落）。
- **速度驱动喷水**：喷水高度、水滴数量、水滴大小都随实时 token 消耗速度
  （tokens/秒）缩放，从 `tokenUsage` 投影每 400ms 采样并做指数平滑。
- **实时 token 徽章**：鲸鱼下方显示当前 token 数，方便核对联动。
- 支持深色模式徽章、零构建步骤、无运行时依赖。

## 工作原理

DSH 用客户端插件组合 UI。本包是双面插件：

- `lib/index.js` — Node 侧：空 `apply()`，让包成为已启用的 Loader 条目。
- `lib/client.js` — 浏览器侧：通过客户端模块系统
  （`window.__ModuleLoader__.load`）加载，往 `conversation.session.header.actions`
  slot（session 作用域，因此标准套件携带 `useProjection`）注册一个条目，
  读取 `useProjection("tokenUsage")`，并把鲸鱼 portal 到 `document.body`。

token 数据来自 `@deepseek-ai/dsh-token-meter` 的 `tokenUsage` 投影
（互斥分桶：`uncachedInputTokens`、`outputTokens`、`cacheReadTokens`、
`cacheWriteTokens`）。

## 安装

这是源码级客户端插件：需要能被目标 profile 解析，并加为 Loader 行。

### 方式 A — 符号链接 + patch（最快，无需 pnpm）

```sh
PROFILE="$DSH_HOME/profiles/web"          # 或你的 profile 目录
mkdir -p "$PROFILE/node_modules/@deepseek-ai"
ln -sfn "$(pwd)" "$PROFILE/node_modules/@deepseek-ai/dsh-client-ui-whale"
```

然后在 `$PROFILE/cordis.patch.yml` 追加：

```yaml
- insert:
    - id: ui-whale
      name: '@deepseek-ai/dsh-client-ui-whale'
```

### 方式 B — file 依赖 + pnpm

在 profile 的 `package.json` 里加：

```json
"dependencies": { "@deepseek-ai/dsh-client-ui-whale": "file:/path/to/dsh-client-ui-whale" }
```

然后在 profile 目录跑 `pnpm install`，并加上同样的 patch 行。

重启 `dsh web` 并刷新——插件集合的变更只在重启后生效。

## 配置

目前没有配置面；直接改 `lib/client.js`：

- **位置 / 间距**：`useWhalePosition()`（间距为 `16`，回退角落 `right: 28`，
  窄屏回退 `right: 12`）。
- **喷水曲线**：`TokenWhale` 里的 `level` 表达式，当前是
  `Math.min(1, Math.sqrt(rate / 50))`，约 50 tokens/秒时饱和；速率在
  `useTokenRate()` 里每 400ms 采样一次并做指数平滑。
- **尺寸**：`spoutH`（8–80px）、`dropCount`（2–6）、`dropSize`（3–6px）。
- **颜色**：`.whale-drop` / `.whale-svg` / `.whale-count` 的 CSS 规则。

停用：给 `ui-whale` 行加 `disabled: true`（或删除该行）并重启。

## 开发

```sh
npm run check   # 对两个 half 做 node --check
```

`lib/client.js` 是手写的纯 JavaScript，形状正好符合 DSH 客户端模块加载器的
要求；刻意不引入构建步骤。

## 许可证

[MIT](LICENSE)。DeepSeek logo 仅用于标识。
