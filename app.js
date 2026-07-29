(function () {
  const DATA = window.SECUREPATH_DATA;
  const app = document.getElementById("app");
  const toast = document.getElementById("toast");
  const modal = document.getElementById("resource-modal");
  const importFile = document.getElementById("import-file");
  const STORAGE_KEY = "securepath-learning-state-v1";

  const pricingLabels = {
    free: "免费",
    freemium: "部分免费",
    trial: "免费试用",
    paid: "收费",
    subscription: "订阅制",
    license: "需要许可证",
    register: "需要注册",
    unknown: "费用未知",
  };

  const needs = [
    { id: "foundation", title: "我不会基础", detail: "网络 · Linux · Python", nodeId: "network-model" },
    { id: "tools", title: "我想学工具", detail: "Burp · Nmap · Wireshark", nodeId: "burp-workflow" },
    { id: "web", title: "我想练漏洞", detail: "SQLi · XSS · 文件上传", nodeId: "sql-injection" },
    { id: "lab", title: "我想搭环境", detail: "Kali · Docker · 靶场", nodeId: "virtual-lab" },
    { id: "job", title: "我想准备求职", detail: "报告 · 项目 · 面试", nodeId: "reporting" },
    { id: "defense", title: "我想学攻防", detail: "域 · 应急 · 日志", nodeId: "incident-response" },
  ];

  let state = loadState();
  let toastTimer;

  function defaultState() {
    return {
      screen: "home",
      search: "",
      resourceFilters: { kind: "video", stage: "all", platform: "all", access: "all", availability: "all", type: "all", pricing: "all", level: "all", lang: "all", status: "all" },
      toolFilters: { stage: "all", pricing: "all", search: "" },
      activeNode: null,
      activeResource: null,
      expandedStages: { foundation: true, "web-vuln": true, pentest: false, defense: false },
      completedNodes: {},
      completedPractices: {},
      favorites: {},
      notes: {},
      hiddenResources: {},
      customResources: [],
      profile: { level: "零基础", target: "渗透测试/安全服务", need: "补基础与工具" },
      noteNode: null,
    };
  }

  function loadState() {
    const base = defaultState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      const saved = JSON.parse(raw);
      return {
        ...base,
        ...saved,
        resourceFilters: { ...base.resourceFilters, ...(saved.resourceFilters || {}) },
        toolFilters: { ...base.toolFilters, ...(saved.toolFilters || {}) },
        expandedStages: { ...base.expandedStages, ...(saved.expandedStages || {}) },
        profile: { ...base.profile, ...(saved.profile || {}) },
      };
    } catch {
      return base;
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function stageById(id) { return DATA.STAGES.find((stage) => stage.id === id); }
  function nodeById(id) { return DATA.NODES.find((node) => node.id === id); }
  function toolById(id) { return DATA.TOOLS.find((tool) => tool.id === id); }
  function stageNodes(stageId) { return DATA.NODES.filter((node) => node.stage === stageId); }

  function resources() {
    const map = new Map(DATA.RESOURCES.map((resource) => [resource.id, resource]));
    state.customResources.forEach((resource) => map.set(resource.id, resource));
    return [...map.values()];
  }

  function visibleResources() { return resources().filter((resource) => !state.hiddenResources[resource.id]); }
  function isDone(id) { return Boolean(state.completedNodes[id]); }

  function stageProgress(stageId) {
    const nodes = stageNodes(stageId);
    const done = nodes.filter((node) => isDone(node.id)).length;
    return { done, total: nodes.length, percent: nodes.length ? Math.round((done / nodes.length) * 100) : 0 };
  }

  function totals() {
    const nodesDone = DATA.NODES.filter((node) => isDone(node.id)).length;
    const practicesDone = DATA.PRACTICES.filter((practice) => state.completedPractices[practice.id]).length;
    const favorites = Object.values(state.favorites).filter(Boolean).length;
    return { nodesDone, nodesTotal: DATA.NODES.length, practicesDone, practicesTotal: DATA.PRACTICES.length, favorites };
  }

  function recommendedNode() {
    const pending = DATA.NODES.filter((node) => !isDone(node.id));
    const blocked = pending.find((node) => node.track === "core" && node.prerequisites.some((id) => !isDone(id)));
    if (blocked) {
      return nodeById(blocked.prerequisites.find((id) => !isDone(id))) || blocked;
    }
    return pending.find((node) => node.track === "core") || pending[0] || DATA.NODES[0];
  }

  function progressBar(percent, className = "") {
    return `<div class="progress-line ${className}"><span style="width:${percent}%"></span></div>`;
  }

  function pricingBadge(pricing) {
    const value = pricing || "unknown";
    return `<span class="badge badge-${value}">${pricingLabels[value] || pricingLabels.unknown}</span>`;
  }

  function accessBadge(resource) {
    const access = resource.accessMode || (resource.directUrl ? "网页可播" : "网页直达");
    const tone = access === "网页可播" ? "ok" : access === "需登录" ? "login" : access === "建议App打开" ? "app" : "muted";
    return `<span class="access-badge access-${tone}">${access}</span>`;
  }

  function availabilityBadge(resource) {
    const labels = { available: "链接已核验", unavailable: "链接失效", pending: "待核验" };
    const value = resource.availability || "pending";
    return `<span class="availability availability-${value}">${labels[value] || value}</span>`;
  }

  function stageColor(stageId) { return stageById(stageId)?.color || "green"; }

  function renderTopbar() {
    const nav = [
      ["home", "首页"],
      ["roadmap", "能力地图"],
      ["resources", "资源库"],
      ["tools", "工具中心"],
      ["practice", "实战任务"],
      ["notes", "我的学习"],
    ];
    return `<header class="topbar">
      <button class="brand" data-action="navigate" data-screen="home" aria-label="回到首页">
        <span class="brand-mark">⌁</span><span class="brand-copy"><strong>SECUREPATH</strong><span>网络安全能力库</span></span>
      </button>
      <nav class="topnav" aria-label="主导航">${nav.map(([id, label]) => `<button class="nav-item ${state.screen === id ? "active" : ""}" data-action="navigate" data-screen="${id}">${label}</button>`).join("")}</nav>
      <div class="topbar-tools">
        <label class="top-search"><span class="search-glyph">⌕</span><input data-input="global-search" value="${escapeAttr(state.search)}" placeholder="搜索节点、资源或工具" /></label>
        <span class="avatar">SP</span>
      </div>
    </header>`;
  }

  function renderHome() {
    const stats = totals();
    const recommendation = recommendedNode();
    const recommendationStage = stageById(recommendation.stage);
    return `<main class="home-page">
      <section class="home-hero">
        <div class="hero-copy">
          <span class="eyebrow">个人安全成长路线 · ${state.profile.target}</span>
          <h1>按你的需求，<br /><em>逐步成为安全工程师</em></h1>
          <p>把第一张路线图拆成可执行的能力节点。先补眼前的缺口，再沿着前置关系继续深入；中文资源、合法靶场、工具下载与求职成果都集中在这里。</p>
          <div class="hero-actions">
            <button class="button button-primary" data-action="go-need" data-node-id="${recommendation.id}">继续学习 ${recommendation.title} <span>→</span></button>
            <button class="button button-dark" data-action="navigate" data-screen="roadmap">查看完整能力地图</button>
          </div>
        </div>
        <div class="hero-orbit" aria-hidden="true">
          <svg viewBox="0 0 600 500" role="img">
            <defs><radialGradient id="sphereGlow"><stop offset="0" stop-color="#0ccfa5" stop-opacity=".5"/><stop offset=".62" stop-color="#087c78" stop-opacity=".24"/><stop offset="1" stop-color="#0b2a36" stop-opacity=".05"/></radialGradient></defs>
            <ellipse class="orbit-sphere" cx="345" cy="262" rx="185" ry="145" />
            <path class="orbit-line" d="M162 284 C226 62 461 69 523 241 C467 431 212 445 162 284Z" />
            <path class="orbit-line" d="M160 242 C282 170 426 188 523 292" />
            <path class="orbit-line" d="M217 119 C271 274 371 361 475 396" />
            <path class="orbit-line" d="M163 322 C285 261 390 216 481 108" />
            <path class="orbit-line" d="M276 77 C323 186 334 327 315 416" />
            <circle class="orbit-node" cx="162" cy="284" r="5"/><circle class="orbit-node" cx="276" cy="77" r="4"/><circle class="orbit-node" cx="523" cy="241" r="5"/><circle class="orbit-node" cx="315" cy="416" r="4"/><circle class="orbit-node" cx="390" cy="212" r="5"/><circle class="orbit-node" cx="217" cy="119" r="4"/>
            <text class="orbit-label" x="175" y="278">LOCAL LAB</text><text class="orbit-label" x="427" y="231">AUTHORIZED</text><text class="orbit-label" x="285" y="62">TCP / HTTP</text><text class="orbit-label" x="382" y="414">LOG / TRACE</text>
          </svg>
        </div>
      </section>
      <section class="metrics-band">
        <div class="metric"><span class="metric-label">路线节点</span><span class="metric-value">${stats.nodesDone}<span class="unit">/ ${stats.nodesTotal}</span></span><span class="metric-hint">已掌握能力</span></div>
        <div class="metric"><span class="metric-label">阶段完成度</span><span class="metric-value">${Math.round((stats.nodesDone / stats.nodesTotal) * 100)}<span class="unit">%</span></span><span class="metric-hint">按能力而非天数计算</span></div>
        <div class="metric"><span class="metric-label">实战任务</span><span class="metric-value">${stats.practicesDone}<span class="unit">/ ${stats.practicesTotal}</span></span><span class="metric-hint">可提交学习成果</span></div>
        <div class="metric"><span class="metric-label">我的收藏</span><span class="metric-value">${stats.favorites}<span class="unit">条</span></span><span class="metric-hint">资源与工具</span></div>
      </section>
      <section class="home-content">
        <div class="section-heading"><div><h2>我现在需要什么</h2><p>点击一个需求，直接跳到对应的模块与资源。</p></div><button class="button button-ghost button-small" data-action="navigate" data-screen="resources">浏览全部资源 →</button></div>
        <div class="home-grid">
          <div class="surface needs-card"><div class="needs-grid">${needs.map((need) => `<button class="need-chip" data-action="go-need" data-node-id="${need.nodeId}"><span><strong>${need.title}</strong><span>${need.detail}</span></span><span class="chip-arrow">›</span></button>`).join("")}</div></div>
          <div class="next-card"><span class="eyebrow">推荐下一步 · ${recommendationStage.title}</span><h3>${recommendation.title}</h3><p>${recommendation.goal}</p><div class="next-meta"><span class="badge badge-free">${recommendation.track === "core" ? "必学主线" : "选学补充"}</span><span class="badge badge-unknown">${recommendation.level}</span></div><button class="button button-primary button-small" data-action="go-need" data-node-id="${recommendation.id}">打开节点详情</button></div>
        </div>
        <div class="section-heading" style="margin-top:36px"><div><h2>四阶段路线概览</h2><p>第一张路线图的内容主干，所有细分节点均可进入能力地图。</p></div><button class="button button-ghost button-small" data-action="navigate" data-screen="roadmap">展开路线图 →</button></div>
        <div class="stage-grid">${DATA.STAGES.map(renderStageCard).join("")}</div>
      </section>
    </main>`;
  }

  function renderStageCard(stage) {
    const progress = stageProgress(stage.id);
    return `<article class="stage-card ${stage.color}" data-action="go-stage" data-stage-id="${stage.id}"><span class="stage-index">PHASE ${stage.short}</span><span class="stage-icon">${stage.icon}</span><h3>${stage.title}</h3><p>${stage.subtitle}</p>${progressBar(progress.percent)}<div class="stage-progress"><span>${progress.done}/${progress.total} 节点</span><span>${progress.percent}%</span></div></article>`;
  }

  function renderSidebar() {
    return `<aside class="sidebar">
      <div class="sidebar-top"><strong>能力导航</strong><p>第一张路线图 · ${DATA.NODES.length} 个细分节点</p><label class="sidebar-search"><span>⌕</span><input data-input="sidebar-search" value="${escapeAttr(state.search)}" placeholder="筛选节点" /></label></div>
      <div class="stage-nav">${DATA.STAGES.map((stage) => {
        const progress = stageProgress(stage.id);
        const open = Boolean(state.expandedStages[stage.id]);
        return `<details ${open ? "open" : ""} data-stage-details="${stage.id}"><summary><span class="stage-dot" style="color:var(--${stage.color === "cyan" ? "cyan" : stage.color})"></span><span>${stage.title}</span><span class="stage-count">${progress.done}/${progress.total}</span></summary><div class="node-nav">${stageNodes(stage.id).filter((node) => !state.search || node.title.toLowerCase().includes(state.search.toLowerCase())).map((node) => `<button class="${state.activeNode === node.id ? "active" : ""}" data-action="select-node" data-node-id="${node.id}">${isDone(node.id) ? "✓ " : ""}${node.title}</button>`).join("")}</div></details>`;
      }).join("")}</div>
    </aside>`;
  }

  function resourceMatches(resource) {
    const filter = state.resourceFilters;
    const q = state.search.trim().toLowerCase();
    const node = resource.nodeId ? nodeById(resource.nodeId) : null;
    if (filter.kind === "video" && !(resource.type === "视频" && resource.directUrl && !resource.searchEntry)) return false;
    if (filter.kind === "discovery" && !resource.searchEntry) return false;
    if (filter.platform !== "all" && resource.platform !== filter.platform) return false;
    if (filter.access !== "all" && (resource.accessMode || "网页直达") !== filter.access) return false;
    if (filter.availability !== "all" && (resource.availability || "pending") !== filter.availability) return false;
    if (q && ![resource.title, resource.summary, resource.creator, resource.platform, resource.type, resource.lang, resource.episodeLabel, resource.accessMode, node?.title].filter(Boolean).join(" ").toLowerCase().includes(q)) return false;
    if (filter.stage !== "all" && resource.stage !== filter.stage) return false;
    if (filter.type !== "all" && resource.type !== filter.type) return false;
    if (filter.pricing !== "all" && resource.pricing !== filter.pricing) return false;
    if (filter.level !== "all" && resource.level !== filter.level) return false;
    if (filter.lang !== "all" && resource.lang !== filter.lang) return false;
    if (filter.status === "done" && !state.completedNodes[resource.nodeId]) return false;
    if (filter.status === "todo" && state.completedNodes[resource.nodeId]) return false;
    if (state.activeNode && resource.nodeId !== state.activeNode) return false;
    return true;
  }

  function renderResourceRow(resource) {
    const node = resource.nodeId ? nodeById(resource.nodeId) : null;
    const favorite = Boolean(state.favorites[resource.id]);
    const done = Boolean(resource.nodeId && state.completedNodes[resource.nodeId]);
    const initial = (resource.platform || "资").slice(0, 1);
    const url = safeExternalUrl(resource.directUrl || resource.url);
    const meta = [resource.creator, resource.duration, resource.episodeLabel, node?.title].filter(Boolean).join(" · ");
    return `<article class="resource-row ${resource.searchEntry ? "discovery-row" : ""}" data-resource-id="${resource.id}"><div class="resource-title"><span class="resource-icon">${initial}</span><div><a class="resource-link" href="${url}" target="_blank" rel="noreferrer">${resource.title} <span aria-hidden="true">↗</span></a><small>${meta || resource.summary || "个人收录资源"}</small><div class="resource-status-line">${accessBadge(resource)} ${availabilityBadge(resource)} ${resource.seriesUrl ? `<a class="series-link" href="${safeExternalUrl(resource.seriesUrl)}" target="_blank" rel="noreferrer">看完整合集 ↗</a>` : ""}</div></div></div><span class="platform">${resource.platform}</span><span class="level">${resource.episodeLabel || resource.level || "基础"}</span><span>${pricingBadge(resource.pricing)}</span><button class="status-button ${done ? "done" : ""}" data-action="toggle-node" data-node-id="${resource.nodeId || ""}" ${resource.nodeId ? "" : "disabled"}><span class="status-dot"></span>${done ? "已掌握" : "未掌握"}</button><div class="row-actions"><button class="row-action ${favorite ? "active" : ""}" data-action="toggle-favorite" data-resource-id="${resource.id}" title="收藏">${favorite ? "★" : "☆"}</button><a class="row-action row-open" href="${url}" target="_blank" rel="noreferrer" title="立即观看">立即观看 ↗</a><button class="row-action" data-action="open-resource" data-resource-id="${resource.id}" title="查看详情">详情</button></div></article>`;
  }

  function renderLibrary() {
    const list = visibleResources().filter(resourceMatches);
    const nodeLabel = state.activeNode ? nodeById(state.activeNode)?.title : "全部节点";
    const directTotal = visibleResources().filter((resource) => resource.type === "视频" && resource.directUrl && !resource.searchEntry).length;
    const discoveryTotal = visibleResources().filter((resource) => resource.searchEntry).length;
    const platforms = [...new Set(visibleResources().filter((resource) => resource.type === "视频" && resource.directUrl && !resource.searchEntry).map((resource) => resource.platform))];
    const allSeries = DATA.SERIES_CATALOG || [];
    const series = state.resourceFilters.stage === "all"
      ? DATA.STAGES.map((stage) => allSeries.find((item) => item.stage === stage.id)).filter(Boolean)
      : allSeries.filter((item) => item.stage === state.resourceFilters.stage);
    return `<main class="workspace-page"><div class="workspace-heading"><div><span class="eyebrow">RESOURCE LIBRARY · DIRECT VIDEO</span><h1>学习资源库</h1><p>${state.activeNode ? `当前节点：${nodeLabel}` : "默认显示具体视频直达链接；搜索页已移入独立的继续查找区"}</p></div><div class="workspace-actions"><button class="button button-ghost button-small" data-action="import-data">导入数据</button><button class="button button-ghost button-small" data-action="export-data">导出数据</button><button class="button button-primary button-small" data-action="open-add-resource">＋ 新增资源</button></div></div><div class="video-summary"><div><strong>${directTotal}</strong><span>条具体视频</span></div><div><strong>${DATA.NODES.length}</strong><span>个能力节点 · 每节点 3 条</span></div><div><strong>${platforms.length}</strong><span>个平台</span></div><button class="button button-ghost button-small" data-action="show-discovery">继续查找（${discoveryTotal}）</button></div><div class="workspace-layout">${renderSidebar()}<section class="library-main"><div class="surface filter-bar"><label class="search-control"><span>⌕</span><input data-input="resource-search" value="${escapeAttr(state.search)}" placeholder="搜索视频、UP主、知识点、分P" /></label><select data-filter="kind"><option value="video" ${state.resourceFilters.kind === "video" ? "selected" : ""}>直达视频</option><option value="all" ${state.resourceFilters.kind === "all" ? "selected" : ""}>全部资源</option><option value="discovery" ${state.resourceFilters.kind === "discovery" ? "selected" : ""}>继续查找</option></select><select data-filter="stage"><option value="all">全部阶段</option>${DATA.STAGES.map((stage) => `<option value="${stage.id}" ${state.resourceFilters.stage === stage.id ? "selected" : ""}>${stage.short} · ${stage.title}</option>`).join("")}</select><select data-filter="platform"><option value="all">全部平台</option>${platforms.map((platform) => `<option value="${platform}" ${state.resourceFilters.platform === platform ? "selected" : ""}>${platform}</option>`).join("")}</select><select data-filter="access"><option value="all">全部访问方式</option>${["网页可播", "需登录", "建议App打开", "网页直达"].map((access) => `<option value="${access}" ${state.resourceFilters.access === access ? "selected" : ""}>${access}</option>`).join("")}</select><select data-filter="availability"><option value="all">全部链接状态</option><option value="available" ${state.resourceFilters.availability === "available" ? "selected" : ""}>链接已核验</option><option value="unavailable" ${state.resourceFilters.availability === "unavailable" ? "selected" : ""}>链接失效</option><option value="pending" ${state.resourceFilters.availability === "pending" ? "selected" : ""}>待核验</option></select><select data-filter="pricing"><option value="all">全部费用</option>${Object.entries(pricingLabels).map(([key, label]) => `<option value="${key}" ${state.resourceFilters.pricing === key ? "selected" : ""}>${label}</option>`).join("")}</select><select data-filter="level"><option value="all">全部难度</option>${["入门", "基础", "进阶", "高级"].map((level) => `<option value="${level}" ${state.resourceFilters.level === level ? "selected" : ""}>${level}</option>`).join("")}</select><select data-filter="status"><option value="all">全部状态</option><option value="todo" ${state.resourceFilters.status === "todo" ? "selected" : ""}>待学习</option><option value="done" ${state.resourceFilters.status === "done" ? "selected" : ""}>已掌握</option></select><div class="filter-summary"><span>显示 <strong>${list.length}</strong> 条${state.resourceFilters.kind === "video" ? "直达视频" : "资源"}${state.activeNode ? " · 点击左侧节点可切换" : ""}</span><button class="button button-ghost button-small" data-action="reset-filters">重置筛选</button></div></div><div class="surface series-strip"><div class="section-heading compact"><div><h2>完整系列课程</h2><p>点击合集名进入原平台系列页；节点视频仍使用具体分P直达。</p></div></div><div class="series-grid">${series.map((item) => `<a class="series-card" href="${safeExternalUrl(item.url)}" target="_blank" rel="noreferrer"><span class="series-platform">${item.platform} · ${item.bvid || "系列"}</span><strong>${item.title}</strong><small>${item.creator} · ${item.summary}</small><span>打开完整合集 ↗</span></a>`).join("")}</div></div><div class="surface resource-list">${list.length ? `<div class="list-head"><span>视频 / 作品</span><span>平台</span><span>分P / 难度</span><span>费用</span><span>学习状态</span><span></span></div>${list.map(renderResourceRow).join("")}` : `<div class="empty-state"><strong>没有匹配的资源</strong><span>试试清空筛选，或换一个平台、访问方式或节点。</span></div>`}</div></section></div>${state.activeResource ? renderDrawer() : ""}</main>`;
  }

  function renderRoadmap() {
    const stats = totals();
    return `<main class="roadmap-page"><div class="roadmap-wrap"><div class="roadmap-header"><div><span class="eyebrow">CAPABILITY MAP · ${stats.nodesDone}/${stats.nodesTotal} 已掌握</span><h1>第一张路线图 · 完整能力节点</h1><p>不按周推进，按前置关系和实际需求解锁；绿色节点代表已掌握。</p></div><button class="button button-dark button-small" data-action="navigate" data-screen="resources">打开资源库 →</button></div><div class="roadmap-line">${DATA.STAGES.map((stage) => { const progress = stageProgress(stage.id); return `<section class="roadmap-stage"><div class="roadmap-stage-index">${stage.short}</div><div class="roadmap-stage-card"><div class="roadmap-stage-head"><div><h2>${stage.title}</h2><p>${stage.description}</p></div><div class="stage-progress"><strong>${progress.percent}%</strong>${progress.done}/${progress.total} 节点</div></div><div class="roadmap-nodes">${stageNodes(stage.id).map((node) => `<button class="roadmap-node" data-action="select-node" data-node-id="${node.id}"><strong>${isDone(node.id) ? "✓ " : ""}${node.title}</strong><small>${node.goal}</small><span class="node-state">${node.track === "core" ? "必学主线" : "选学/进阶"}${isDone(node.id) ? " · 已掌握" : ""}</span></button>`).join("")}</div></div></section>`; }).join("")}</div></div></main>`;
  }

  function toolMatches(tool) {
    const q = state.toolFilters.search.trim().toLowerCase();
    if (q && ![tool.name, tool.category, tool.purpose, tool.os].join(" ").toLowerCase().includes(q)) return false;
    if (state.toolFilters.stage !== "all" && tool.stage !== state.toolFilters.stage) return false;
    if (state.toolFilters.pricing !== "all" && tool.pricing !== state.toolFilters.pricing) return false;
    return true;
  }

  function renderTools() {
    const list = DATA.TOOLS.filter(toolMatches);
    return `<main class="tools-page"><div class="workspace-heading"><div><span class="eyebrow">TOOL CENTER · WINDOWS 10/11 x64</span><h1>工具与安装包</h1><p>官方地址、安装说明、版本信息和费用状态集中查看。</p></div><div class="workspace-actions"><button class="button button-ghost button-small" data-action="navigate" data-screen="resources">返回资源库</button></div></div><div class="workspace-layout" style="display:block"><div class="surface filter-bar"><label class="search-control"><span>⌕</span><input data-input="tool-search" value="${escapeAttr(state.toolFilters.search)}" placeholder="搜索工具、用途或类别" /></label><select data-tool-filter="stage"><option value="all">全部阶段</option>${DATA.STAGES.map((stage) => `<option value="${stage.id}" ${state.toolFilters.stage === stage.id ? "selected" : ""}>${stage.short} · ${stage.title}</option>`).join("")}</select><select data-tool-filter="pricing"><option value="all">全部费用</option>${Object.entries(pricingLabels).map(([key, label]) => `<option value="${key}" ${state.toolFilters.pricing === key ? "selected" : ""}>${label}</option>`).join("")}</select><div class="filter-summary"><span>显示 <strong>${list.length}</strong> 个工具</span><span>下载前请核对官方版本和 SHA-256</span></div></div><div class="tools-grid">${list.map(renderToolCard).join("")}</div></div></main>`;
  }

  function renderToolCard(tool) {
    return `<article class="tool-card"><div class="tool-top"><div class="tool-title"><span class="tool-logo">${tool.name.slice(0,1)}</span><div><h3>${tool.name}</h3><small>${tool.category} · ${tool.version}</small></div></div>${pricingBadge(tool.pricing)}</div><p>${tool.purpose}</p><div class="tool-meta"><span>${tool.os}</span><span>${tool.type}</span><span>官方来源</span></div><div class="tool-links"><a class="button button-primary button-small" href="${tool.url}" target="_blank" rel="noreferrer">官方下载 ↗</a><a class="button button-ghost button-small" href="${tool.docs}" target="_blank" rel="noreferrer">安装文档</a></div><div class="install-note"><strong>安装提示：</strong>${tool.install}<br /><span class="alternative">替代方案：${tool.alternative}</span></div></article>`;
  }

  function renderPractice() {
    return `<main class="practice-page"><div class="workspace-heading"><div><span class="eyebrow">AUTHORIZED LABS · PRACTICE</span><h1>实战任务</h1><p>每个任务都有明确成果，只在个人设备、隔离靶场或明确授权项目中练习。</p></div><button class="button button-primary button-small" data-action="go-need" data-node-id="virtual-lab">先搭建实验环境</button></div><div class="practice-grid">${DATA.PRACTICES.map((practice) => `<article class="practice-card"><div class="eyebrow">${stageById(practice.stage).short} · ${practice.level}</div><h3>${practice.title}</h3><p>完成标准：${practice.outcome}</p><div class="practice-outcome">产出：${practice.outcome}</div><div class="safety-note">⚠ ${practice.safety}</div><button class="status-button ${state.completedPractices[practice.id] ? "done" : ""}" data-action="toggle-practice" data-practice-id="${practice.id}"><span class="status-dot"></span>${state.completedPractices[practice.id] ? "已完成任务" : "标记为完成"}</button></article>`).join("")}</div></main>`;
  }

  function renderNotes() {
    const noteNodes = DATA.NODES.filter((node) => state.notes[node.id] || state.noteNode === node.id);
    const selected = state.noteNode || noteNodes[0]?.id || DATA.NODES[0].id;
    const selectedNode = nodeById(selected);
    return `<main class="notes-page"><div class="workspace-heading"><div><span class="eyebrow">MY LEARNING · NOTES</span><h1>我的学习</h1><p>记录每个能力节点的理解、命令、踩坑和可展示成果。</p></div><button class="button button-ghost button-small" data-action="export-data">导出我的数据</button></div><div class="notes-layout"><section class="notes-list"><h3>节点笔记</h3>${noteNodes.length ? noteNodes.map((node) => `<div class="note-item ${selected === node.id ? "active" : ""}" data-action="select-note" data-node-id="${node.id}"><strong>${isDone(node.id) ? "✓ " : ""}${node.title}</strong><small>${(state.notes[node.id] || "还没有内容").slice(0, 68)}</small></div>`).join("") : `<div class="empty-state" style="padding:30px 8px"><strong>还没有笔记</strong><span>从能力地图打开一个节点即可开始记录。</span></div>`}</section><section class="note-editor"><h3>${selectedNode.title}</h3><p style="color:var(--muted);font-size:11px;line-height:1.6">掌握标准：${selectedNode.mastery}</p><textarea data-input="note-editor" data-node-id="${selectedNode.id}" placeholder="记录你的理解、命令、截图说明、错误和下一步…">${escapeHtml(state.notes[selectedNode.id] || "")}</textarea><div style="display:flex;justify-content:flex-end;margin-top:10px"><button class="button button-primary button-small" data-action="save-note" data-node-id="${selectedNode.id}">保存笔记</button></div></section></div></main>`;
  }

  function renderDrawer() {
    const resource = resources().find((item) => item.id === state.activeResource);
    if (!resource) return "";
    const node = resource.nodeId ? nodeById(resource.nodeId) : null;
    const tools = node ? node.tools.map(toolById).filter(Boolean) : [];
    const url = safeExternalUrl(resource.directUrl || resource.url);
    return `<div class="drawer" data-action="close-drawer"><aside class="drawer-panel" data-drawer-panel="true"><div class="drawer-header"><div><span class="eyebrow">RESOURCE DETAIL · ${resource.platform}</span><h2>${resource.title}</h2><p>${resource.summary || "个人收录资源"}</p></div><button class="icon-button" data-action="close-drawer" aria-label="关闭">×</button></div><div class="detail-block"><h4>视频信息</h4><div class="detail-chips">${pricingBadge(resource.pricing)}${accessBadge(resource)}${availabilityBadge(resource)}<span class="detail-chip">${resource.lang || "中文"}</span><span class="detail-chip">${resource.level || "基础"}</span><span class="detail-chip">${resource.duration || "时长未标注"}</span><span class="detail-chip">${resource.episodeLabel || "具体作品"}</span></div>${resource.creator ? `<p class="detail-meta">作者：${resource.creator} · 发布：${resource.publishedAt || "未标注"} · 核验：${resource.verifiedAt || "未标注"}</p>` : ""}${resource.seriesUrl ? `<p class="detail-meta"><a href="${safeExternalUrl(resource.seriesUrl)}" target="_blank" rel="noreferrer">打开完整合集 ↗</a></p>` : ""}</div>${node ? `<div class="detail-block"><h4>对应能力节点</h4><p><strong>${node.title}</strong><br />${node.goal}<br /><br />练习：${node.task}<br />掌握标准：${node.mastery}</p></div>` : ""}${tools.length ? `<div class="detail-block"><h4>所需工具</h4><div class="detail-chips">${tools.map((tool) => `<span class="detail-chip">${tool.name}</span>`).join("")}</div></div>` : ""}<div class="detail-actions"><a class="button button-primary" href="${url}" target="_blank" rel="noreferrer">立即观看 ↗</a>${node ? `<button class="button button-ghost" data-action="toggle-node" data-node-id="${node.id}">${isDone(node.id) ? "取消已掌握" : "标记为已掌握"}</button>` : ""}<button class="button button-ghost" data-action="toggle-favorite" data-resource-id="${resource.id}">${state.favorites[resource.id] ? "取消收藏" : "加入收藏"}</button><button class="button button-ghost" data-action="edit-resource" data-resource-id="${resource.id}">编辑资源</button><button class="button button-ghost" data-action="hide-resource" data-resource-id="${resource.id}">隐藏资源</button></div><div class="detail-block"><h4>安全提醒</h4><p>仅在个人设备、隔离靶场或明确授权的测试范围内使用相关知识与工具。任何真实目标都应先获得书面授权。</p></div></aside></div>`;
  }

  function renderApp() {
    const view = state.screen === "home" ? renderHome() : state.screen === "roadmap" ? renderRoadmap() : state.screen === "resources" ? renderLibrary() : state.screen === "tools" ? renderTools() : state.screen === "practice" ? renderPractice() : renderNotes();
    app.innerHTML = renderTopbar() + view;
    fillStageOptions();
  }

  function fillStageOptions() {
    const select = document.getElementById("resource-stage");
    if (!select) return;
    select.innerHTML = DATA.STAGES.map((stage) => `<option value="${stage.id}">${stage.title}</option>`).join("");
  }

  function navigate(screen) {
    state.screen = screen;
    if (screen !== "resources") state.activeResource = null;
    renderApp();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToNode(nodeId) {
    const node = nodeById(nodeId);
    if (!node) return;
    state.activeNode = nodeId;
    state.resourceFilters = { ...state.resourceFilters, kind: "video", stage: "all", platform: "all", access: "all", availability: "all", type: "all", pricing: "all", level: "all", lang: "all", status: "all" };
    state.screen = "resources";
    state.expandedStages[node.stage] = true;
    renderApp();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetFilters() {
    state.search = "";
    state.activeNode = null;
    state.resourceFilters = { kind: "video", stage: "all", platform: "all", access: "all", availability: "all", type: "all", pricing: "all", level: "all", lang: "all", status: "all" };
    state.toolFilters = { stage: "all", pricing: "all", search: "" };
    renderApp();
  }

  function openResourceModal(resourceId = null) {
    const form = document.getElementById("resource-form");
    if (!form) return;
    const resource = resourceId ? resources().find((item) => item.id === resourceId) : null;
    document.getElementById("modal-title").textContent = resource ? "编辑资源" : "新增资源";
    document.getElementById("resource-id").value = resource?.id || "";
    document.getElementById("resource-title").value = resource?.title || "";
    document.getElementById("resource-platform").value = resource?.platform || "个人资源";
    document.getElementById("resource-stage").value = resource?.stage || "foundation";
    document.getElementById("resource-type").value = resource?.type || "文档";
    document.getElementById("resource-pricing").value = resource?.pricing || "free";
    document.getElementById("resource-level").value = resource?.level || "入门";
    document.getElementById("resource-url").value = resource?.url || "";
    document.getElementById("resource-summary").value = resource?.summary || "";
    modal.hidden = false;
    document.getElementById("resource-title").focus();
  }

  function closeModal() { modal.hidden = true; }

  function submitResource(event) {
    event.preventDefault();
    const id = document.getElementById("resource-id").value || `custom-${Date.now()}`;
    const existing = resources().find((resource) => resource.id === id);
    const resource = {
      ...(existing || {}),
      id,
      title: document.getElementById("resource-title").value.trim(),
      platform: document.getElementById("resource-platform").value,
      stage: document.getElementById("resource-stage").value,
      type: document.getElementById("resource-type").value,
      pricing: document.getElementById("resource-pricing").value,
      level: document.getElementById("resource-level").value,
      lang: existing?.lang || "中文",
      duration: existing?.duration || "按需",
      url: document.getElementById("resource-url").value.trim(),
      directUrl: document.getElementById("resource-type").value === "视频" ? document.getElementById("resource-url").value.trim() : (existing?.directUrl || ""),
      accessMode: existing?.accessMode || (document.getElementById("resource-type").value === "视频" ? "网页直达" : ""),
      availability: existing?.availability || "pending",
      verifiedAt: existing?.verifiedAt || "",
      summary: document.getElementById("resource-summary").value.trim(),
      custom: true,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    state.customResources = [...state.customResources.filter((item) => item.id !== id), resource];
    persist();
    closeModal();
    renderApp();
    showToast(existing ? "资源已更新" : "资源已添加");
  }

  function exportData() {
    const payload = { app: "SECUREPATH", version: 1, exportedAt: new Date().toISOString(), state };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `securepath-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("已导出学习数据");
  }

  function importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed.state || typeof parsed.state !== "object") throw new Error("invalid");
        state = { ...defaultState(), ...parsed.state, resourceFilters: { ...defaultState().resourceFilters, ...(parsed.state.resourceFilters || {}) }, toolFilters: { ...defaultState().toolFilters, ...(parsed.state.toolFilters || {}) }, profile: { ...defaultState().profile, ...(parsed.state.profile || {}) } };
        persist();
        renderApp();
        showToast("学习数据已导入");
      } catch { showToast("导入失败：文件格式不正确"); }
      importFile.value = "";
    };
    reader.readAsText(file);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
  function escapeAttr(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }
  function safeExternalUrl(value) {
    try {
      const url = new URL(String(value || ""), window.location.href);
      return ["http:", "https:"].includes(url.protocol) ? escapeAttr(url.href) : "#";
    } catch {
      return "#";
    }
  }

  function handleClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    if (action === "navigate") navigate(target.dataset.screen);
    if (action === "go-need" || action === "go-stage") {
      if (action === "go-need") goToNode(target.dataset.nodeId);
      else { state.activeNode = null; state.resourceFilters.stage = target.dataset.stageId; state.screen = "resources"; state.expandedStages[target.dataset.stageId] = true; renderApp(); }
    }
    if (action === "select-node") goToNode(target.dataset.nodeId);
    if (action === "toggle-node") {
      const id = target.dataset.nodeId;
      if (!id) return;
      state.completedNodes[id] = !state.completedNodes[id];
      persist(); renderApp(); showToast(state.completedNodes[id] ? "已标记为掌握" : "已取消掌握标记");
    }
    if (action === "toggle-practice") {
      const id = target.dataset.practiceId;
      state.completedPractices[id] = !state.completedPractices[id];
      persist(); renderApp(); showToast(state.completedPractices[id] ? "实战任务已完成" : "已取消完成标记");
    }
    if (action === "toggle-favorite") {
      const id = target.dataset.resourceId;
      state.favorites[id] = !state.favorites[id];
      persist(); renderApp(); showToast(state.favorites[id] ? "已加入收藏" : "已取消收藏");
    }
    if (action === "open-resource") { state.activeResource = target.dataset.resourceId; renderApp(); }
    if (action === "show-discovery") { state.resourceFilters = { ...state.resourceFilters, kind: "discovery" }; state.screen = "resources"; renderApp(); }
    if (action === "close-drawer" && (!target.closest("[data-drawer-panel]") || target.tagName === "BUTTON")) { state.activeResource = null; renderApp(); }
    if (action === "close-modal") closeModal();
    if (action === "open-add-resource") openResourceModal();
    if (action === "edit-resource") openResourceModal(target.dataset.resourceId);
    if (action === "hide-resource") {
      state.hiddenResources[target.dataset.resourceId] = true; state.activeResource = null; persist(); renderApp(); showToast("资源已隐藏，可在备份数据中恢复");
    }
    if (action === "reset-filters") resetFilters();
    if (action === "export-data") exportData();
    if (action === "import-data") importFile.click();
    if (action === "select-note") { state.noteNode = target.dataset.nodeId; renderApp(); }
    if (action === "save-note") {
      const editor = document.querySelector(`[data-input="note-editor"][data-node-id="${target.dataset.nodeId}"]`);
      state.notes[target.dataset.nodeId] = editor?.value || ""; state.noteNode = target.dataset.nodeId; persist(); renderApp(); showToast("笔记已保存");
    }
  }

  function handleChange(event) {
    const target = event.target;
    if (target.matches("[data-filter]")) { state.resourceFilters[target.dataset.filter] = target.value; renderApp(); }
    if (target.matches("[data-tool-filter]")) { state.toolFilters[target.dataset.toolFilter] = target.value; renderApp(); }
  }

  function refreshInput(target, value, kind) {
    const selection = target.selectionStart;
    if (kind === "tool") state.toolFilters.search = value;
    else state.search = value;
    renderApp();
    const selector = kind === "tool" ? '[data-input="tool-search"]' : target.dataset.input === "sidebar-search" ? '[data-input="sidebar-search"]' : '[data-input="resource-search"]';
    const next = document.querySelector(selector);
    if (next) { next.focus(); next.setSelectionRange(selection, selection); }
  }

  function handleInput(event) {
    const target = event.target;
    if (target.matches('[data-input="global-search"]')) {
      state.search = target.value;
      if (target.value && state.screen !== "resources") { state.screen = "resources"; }
      renderApp();
      const next = document.querySelector('[data-input="resource-search"]');
      if (next) { next.focus(); next.setSelectionRange(target.value.length, target.value.length); }
    }
    if (target.matches('[data-input="resource-search"], [data-input="sidebar-search"]')) refreshInput(target, target.value, "resource");
    if (target.matches('[data-input="tool-search"]')) refreshInput(target, target.value, "tool");
  }

  document.addEventListener("click", handleClick);
  document.addEventListener("change", handleChange);
  document.addEventListener("input", handleInput);
  document.getElementById("resource-form").addEventListener("submit", submitResource);
  importFile.addEventListener("change", () => importData(importFile.files[0]));
  modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { if (!modal.hidden) closeModal(); else if (state.activeResource) { state.activeResource = null; renderApp(); } } });

  renderApp();
})();
