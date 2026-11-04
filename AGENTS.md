# AGENTS.md｜captainrex0428.github.io 协作说明

本文件是 Codex / DeepSeek 等代理进入本仓库时的入口约定。仓库本身只放**站点代码与内容**，能力资产（agents、skills、政策、注册表）一律来自机构控制面，用链接接入、不入库。

- 站点：https://captainrex0428.github.io
- 定位：负责人个人技术主页（个人第一人称技术身份），可链接机构，但不承担机构主站职能
- 部署：推 `master` → GitHub Actions → GitHub Pages，**推送即上线**

## 0. 开工前检查（换机、重新克隆、隔了一段时间没碰，必做）

能力的母版在同步盘的中控里，仓库里只有链接。**换了机器或重新克隆，链接是不存在的**，必须先接上再动手，否则你会以为"没有规范"而自己另起一套。

```powershell
# 1) 先看是否已接上（缺失会返回非零，并列出缺哪几个）
pwsh -File "E:\BaiduSync\BaiduSyncdisk\RestArtEducation\.codex\tools\link-dev-bridges.ps1" `
  -Action Verify -ProjectPath "<本仓库路径>" -WithControlPlane

# 2) 返回非零就接上（幂等，可重复执行）
pwsh -File "E:\BaiduSync\BaiduSyncdisk\RestArtEducation\.codex\tools\link-dev-bridges.ps1" `
  -Action Link -ProjectPath "<本仓库路径>" -WithControlPlane

# 3) 再接不上，说明同步盘没同步到本机或路径变了 —— 停下来问负责人，不要复制一份正文过来
```

判断标准：`-Action Verify` 输出「全部联接正常」才可以开始改代码。只看到 warning、或者退出码非零，都算没接上。

## 1. 能力从哪里来（链接，不是副本）

| 路径 | 类型 | 指向 |
|---|---|---|
| `.codex/` | 目录联接（junction） | `E:\BaiduSync\BaiduSyncdisk\RestArtEducation\.codex` |
| `.agents/skills/local-session-capture/` | 目录联接（junction） | `…\RestArtEducation\.agents\skills\local-session-capture` |
| `.agents/skills/design-taste-frontend/` | 本地文件（未入库） | 本机随仓库带来的第三方 skill |

- 这些路径**已被 `.gitignore` 忽略**，不会出现在公开仓库里。
- 联接只是"发现入口"，**唯一母版永远在控制面**。要改 skill / 政策 / 注册表，回控制面改，不要在这里改 —— 改了会直接改到母版，也会绕过登记门禁。
- 联接失效（换机、路径变动、重新克隆）时，**不要复制正文**，跑控制面的重建脚本即可：

```powershell
pwsh -File "E:\BaiduSync\BaiduSyncdisk\RestArtEducation\.codex\tools\link-dev-bridges.ps1" `
  -Action Link -ProjectPath "<本仓库路径>" -WithControlPlane
```

  校验用 `-Action Verify`（缺失会返回非零并提示）；移除用 `-Action Remove`（只删联接，不动母版）。

## 2. 先读什么

| 场景 | 先读 |
|---|---|
| 改视觉、动效、卡片 | `docs/DESIGN_SYSTEM.md` |
| 新增/修改文章、作品、合集 | `docs/CONTENT_GUIDE.md` |
| 修 bug、踩环境坑之后 | `docs/DEV_EXPERIENCE.md`（四段式：现象 / 根因 / 修法 / 边界，**修完当场追加**） |
| 判断这页该做什么、不该做什么 | 本文件第 5 节 |

## 3. 验证与推送

```powershell
npm run build                                    # 必须 exit 0
powershell -File .codex\tools\check-worktree-integrity.ps1 -Repo "<本仓库>"
git -c http.proxy=http://127.0.0.1:7890 push origin master   # 本机需走 7890 代理
```

**推送前必须过完整性闸门**：它检查未跟踪的源码文件、悬空 import、`node --check` 语法。不过不许推。

视觉/布局改动额外要求：本地 `npm run preview` 抽查，并在 390px 宽度确认 `scrollWidth === clientWidth`。

## 4. 提交约定

- 提交信息用中文，带 scope：`content(blog): …`、`fix(works): …`、`refactor(blog): …`
- 一次提交只做一类事，不混内容与样式
- 署名沿用仓库本地配置 `Rex <rvo0428@163.com>`，不改全局 git 配置

## 5. 边界（别越线）

- **作品区 3 个示例 demo 保持现状**：负责人 2026-11-04 明确"短期内不做"，等真实项目再替换，不要顺手改造
- 首页/关于文案负责人判定"不太需要"，不主动重写
- 内容里的技术结论、日期、作者身份属于事实，不得推测补全；缺数据就问
- 新建中文文案（摘要、说明、引导语）属对外文案，需走机构 Humanizer 与复核流程
- 生成的公开文件里不得出现内部编号（DEC/OP）、内网路径、注册表路径

## 6. 外部抓取

需要抓被反爬/登录墙挡住的页面时，用 `.agents/skills/local-session-capture/`（已通过联接可用）。它只做只读抓取与本地落图，登录态/Cookie/CDP 属 P2 单次授权；授权判断走 `web-access` 门。不要自行复制浏览器 profile 或导出 cookie。
