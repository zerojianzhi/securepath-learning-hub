# SECUREPATH · 网络安全能力库

基于第一张网络安全成长路线图整理的中文优先学习资源库。项目使用原生 HTML、CSS 和 JavaScript，无构建步骤，可直接部署到 GitHub Pages。

## 设计

- 深色科技感首页：参考安全平台类首页，用于展示目标岗位、能力进度和下一步建议。
- 浅色管理界面：参考后台权限/数据页，用于浏览路线节点、资源、工具和学习状态。
- 第一张路线图负责“学什么”，四阶段节点全部收录；第二、三张图只负责视觉方向。

## 能力路线

1. 网络安全基础
2. Web 漏洞方向
3. 渗透测试进阶
4. 网络攻防进阶

路线不按周推进，支持直接从“我不会 Linux”“我想学 Burp”“我想练 SQL 注入”“我想准备求职”等需求入口进入对应模块。

## 本地运行

直接双击 `index.html` 可以浏览大部分页面。推荐使用本地静态服务器，以便测试外部链接和浏览器行为：

```powershell
cd D:\PythonProject\cyber-learning-hub
python -m http.server 5173
```

然后打开 <http://localhost:5173>。

## GitHub Pages

项目包含 `.github/workflows/pages.yml`，推送到 GitHub 后可以在仓库的 Settings → Pages 中选择 GitHub Actions，工作流会自动发布当前目录。

也可以使用 GitHub CLI：

```powershell
gh repo create securepath-learning-hub --public --source . --remote origin --push
```

如果不使用 GitHub CLI，也可以在 GitHub 新建空仓库后执行：

```powershell
git init
git add .
git commit -m "feat: add securepath learning hub"
git branch -M main
git remote add origin https://github.com/<你的用户名>/securepath-learning-hub.git
git push -u origin main
```

## 数据与费用

- 进度、收藏、笔记、自定义资源保存在浏览器 `localStorage`。
- 资源库支持 JSON 导出和导入，便于备份或迁移。
- 工具和资源均标注免费、部分免费、试用、收费、订阅制、需要许可证、需要注册或费用未知。
- 版本、费用和下载地址可能变化，使用前请以官方页面为准。

## 安全边界

本项目只提供学习路线、官方工具下载入口、合法靶场和本地实验建议。所有攻防工具只能在个人设备、隔离实验环境或明确授权的测试范围内使用。
