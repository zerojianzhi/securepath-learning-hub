const STAGES = [
  {
    id: "foundation",
    short: "01",
    title: "网络安全基础",
    subtitle: "从计算机与网络开始建立安全思维",
    color: "cyan",
    icon: "◈",
    description: "补齐操作系统、网络协议、脚本与实验环境，让后续工具和漏洞学习有可靠地基。",
  },
  {
    id: "web-vuln",
    short: "02",
    title: "Web 漏洞方向",
    subtitle: "理解请求、代码与漏洞产生的原因",
    color: "green",
    icon: "⌁",
    description: "围绕 Web 请求链路和常见漏洞进行理论学习、合法靶场练习与修复思考。",
  },
  {
    id: "pentest",
    short: "03",
    title: "渗透测试进阶",
    subtitle: "把知识串成可复用的测试流程",
    color: "orange",
    icon: "⌘",
    description: "练习授权范围确认、信息收集、验证、报告和不同技术栈的安全分析。",
  },
  {
    id: "defense",
    short: "04",
    title: "网络攻防进阶",
    subtitle: "从主机、内网到应急响应",
    color: "purple",
    icon: "△",
    description: "理解域环境、日志、应急和横向风险，形成面向岗位的综合视角。",
  },
];

const N = (id, stage, title, level, goal, task, mastery, tools = [], prerequisites = [], optional = false) => ({
  id,
  stage,
  title,
  level,
  goal,
  task,
  mastery,
  tools,
  prerequisites,
  track: optional ? "optional" : "core",
});

const NODES = [
  N("computer-basics", "foundation", "计算机组成与操作系统", "入门", "理解 CPU、内存、磁盘、进程和操作系统的基本职责。", "画出一次程序启动时的资源流转图。", "能解释进程、线程、文件和权限的区别。"),
  N("security-intro", "foundation", "网络安全概念与合规边界", "入门", "建立资产、威胁、漏洞、风险和授权测试意识。", "写一份个人靶场使用规范。", "能判断一个测试目标是否在授权范围内。"),
  N("network-model", "foundation", "OSI/TCP-IP 与常见协议", "基础", "掌握分层、封装、端口和常见协议的作用。", "用 Wireshark 观察 DNS、TCP、HTTP 握手。", "能根据抓包定位连接、解析和请求阶段。", ["wireshark"]),
  N("ip-subnet", "foundation", "IP、子网与路由", "基础", "理解 IPv4、子网掩码、网关、NAT 和路由表。", "为隔离靶场规划一张 NAT/Host-only 网络图。", "能读懂 ipconfig、ip route 与基础路由表。", ["virtualbox"]),
  N("dns-http", "foundation", "DNS、HTTP/HTTPS 基础", "基础", "理解域名解析、请求方法、状态码、Cookie 和 TLS 的位置。", "使用浏览器开发者工具拆解一次登录请求。", "能描述浏览器到服务端的一次完整请求。", ["browser-devtools"]),
  N("windows-basics", "foundation", "Windows 系统与权限", "基础", "熟悉用户、服务、进程、注册表、事件查看器和 ACL。", "创建低权限用户并记录权限差异。", "能定位常见进程、服务和安全日志。", ["sysinternals"]),
  N("linux-basics", "foundation", "Linux 命令行与目录结构", "基础", "掌握文件、用户、权限、进程、服务和包管理。", "在 Kali 中完成用户、文件权限和服务管理任务。", "能独立使用常见命令完成排障。", ["kali", "virtualbox"]),
  N("shell-scripting", "foundation", "Shell 与 PowerShell 入门", "基础", "用命令行完成批处理、日志筛选和系统信息采集。", "编写一个只在本机运行的日志统计脚本。", "能读懂并修改基础 Shell/PowerShell 脚本。", ["windows-terminal"]),
  N("python-basics", "foundation", "Python 安全脚本基础", "基础", "掌握变量、函数、文件、请求、JSON、异常和虚拟环境。", "写一个读取本地日志并输出统计结果的脚本。", "能独立编写小型网络/文件处理脚本。", ["python", "vscode"]),
  N("web-basics", "foundation", "HTML/CSS/JavaScript 与浏览器", "基础", "理解页面、DOM、脚本和浏览器安全边界。", "制作一个带表单校验的本地演示页面。", "能看懂常见前端代码和请求触发点。", ["vscode"]),
  N("php-java-overview", "foundation", "PHP/Java Web 技术栈概览", "基础", "理解服务端语言、框架、中间件与数据库如何协作。", "启动一个本地演示应用并标出请求链路。", "能定位代码、容器和中间件在架构中的位置。", ["docker"]),
  N("sql-database", "foundation", "SQL 与 MySQL 基础", "基础", "掌握表、查询、连接、权限和常见数据流。", "在本地数据库中创建用户表并完成查询练习。", "能读写基础 SQL 并理解参数化查询。", ["docker"]),
  N("virtual-lab", "foundation", "虚拟机、Docker 与靶场环境", "基础", "搭建隔离、可快照、可恢复的学习环境。", "导入 Kali 虚拟机并启动一个本地靶场。", "能恢复快照、查看网络模式并安全关闭环境。", ["virtualbox", "kali", "docker"]),
  N("security-devices", "foundation", "常见安全设备与安全运营概念", "选学", "了解防火墙、IDS/IPS、WAF、EDR、SIEM 的职责边界。", "将一次 Web 请求标注可能经过的安全设备。", "能说明设备负责检测、阻断还是分析。", [], [], true),

  N("web-request-flow", "web-vuln", "Web 请求与响应链路", "基础", "从 URL、请求头、Cookie 到响应体理解攻击面。", "用 Burp 捕获并重放本地靶场请求。", "能清晰描述一个参数从浏览器到数据库的路径。", ["burp"]),
  N("recon-directory", "web-vuln", "信息收集与目录探测", "基础", "在授权范围内识别域名、路径、技术栈和公开信息。", "对本地靶场做被动资产清单和目录记录。", "能区分被动收集、主动探测和越权行为。", ["nmap", "burp"]),
  N("sql-injection", "web-vuln", "SQL 注入", "进阶", "理解拼接 SQL、参数化查询和不同注入验证思路。", "在 DVWA/Juice Shop 等靶场完成基础题并写修复建议。", "能从代码和请求中识别风险并说明防护。", ["burp", "sqlmap"], ["web-request-flow", "sql-database"]),
  N("xss", "web-vuln", "XSS：反射、存储与 DOM", "进阶", "理解输出编码、上下文和浏览器执行边界。", "在本地靶场区分三种 XSS 并记录影响。", "能定位输入到输出的路径并给出修复方案。", ["burp"], ["web-basics", "web-request-flow"]),
  N("csrf", "web-vuln", "CSRF 与 Cookie 安全", "进阶", "理解跨站请求、SameSite、Token 和鉴权边界。", "在靶场复现一个无害的状态变更请求。", "能解释 CSRF 与 XSS 的差异和防护。", ["burp"], ["web-request-flow"]),
  N("upload", "web-vuln", "文件上传与文件解析", "进阶", "理解类型校验、存储位置、解析器和访问控制风险。", "在本地应用中设计安全上传策略。", "能发现常见验证缺陷并给出隔离方案。", ["burp"], ["web-request-flow"]),
  N("path-traversal", "web-vuln", "文件包含与路径遍历", "进阶", "理解路径拼接、规范化和最小权限。", "在授权靶场验证目录读取风险并写修复清单。", "能解释路径规范化和白名单策略。", ["burp"], ["web-request-flow"]),
  N("rce", "web-vuln", "命令执行与 RCE 原理", "高级", "理解不可信输入进入系统命令的风险链。", "只在本地靶场完成安全验证和防护改造。", "能从代码审计角度识别命令注入入口。", ["burp", "docker"], ["shell-scripting", "web-request-flow"]),
  N("ssrf", "web-vuln", "SSRF 与服务端请求", "高级", "理解服务端代发请求、内网边界和云元数据风险。", "在隔离实验中观察请求方向与访问控制。", "能提出 URL 白名单、网络隔离和出站控制方案。", ["burp"], ["web-request-flow"]),
  N("webshell", "web-vuln", "WebShell 风险与检测", "高级", "从防守角度理解落地、持久化和文件完整性风险。", "在本地示例中编写检测规则而非部署后门。", "能识别可疑文件行为并写出响应步骤。", ["docker"], ["upload", "rce"]),
  N("deserialization", "web-vuln", "反序列化漏洞", "高级", "理解对象序列化、类型边界和安全反序列化。", "分析安全示例代码中的危险入口。", "能说明反序列化风险的前置条件和修复。", ["burp"], ["php-java-overview"]),
  N("access-control", "web-vuln", "认证、授权与业务逻辑", "进阶", "区分认证、会话、权限和业务流程缺陷。", "在靶场测试水平/垂直越权并完成报告。", "能用测试矩阵验证权限边界。", ["burp"], ["web-request-flow"]),
  N("cms-framework", "web-vuln", "CMS、框架与中间件漏洞", "进阶", "理解版本识别、公开漏洞和补丁验证。", "为本地应用建立版本与风险清单。", "能阅读公开公告并判断版本风险，不盲目复制利用步骤。", ["burp", "nmap"], ["recon-directory"], false),

  N("pentest-method", "pentest", "授权测试流程与范围确认", "基础", "把目标、规则、证据、风险和交付物串成流程。", "为本地项目写一页测试范围和排除项。", "能在测试前明确授权、边界和停止条件。", [], ["security-intro"]),
  N("burp-workflow", "pentest", "Burp Suite 工作流", "进阶", "掌握 Proxy、Repeater、Decoder、Comparer 和作用域。", "完成官方/本地练习并保存请求证据。", "能用 Burp 独立分析一个 Web 功能。", ["burp"], ["web-request-flow"]),
  N("nmap-workflow", "pentest", "Nmap 与服务识别", "进阶", "理解端口、服务、版本和安全扫描边界。", "只扫描本机和靶场网络并记录结果。", "能把扫描结果转成下一步验证计划。", ["nmap"], ["network-model", "security-intro"]),
  N("wireshark-workflow", "pentest", "Wireshark 抓包分析", "进阶", "使用过滤器、流跟踪和协议字段定位问题。", "分析一次本地登录和 DNS 请求。", "能用抓包验证请求、响应和异常流量。", ["wireshark"], ["network-model"]),
  N("sqlmap-workflow", "pentest", "SQLMap 安全使用", "高级", "理解自动化工具的边界、参数和证据复核。", "只对本地靶场执行并人工复核结果。", "能解释工具结果而不是盲目相信输出。", ["sqlmap"], ["sql-injection"]),
  N("metasploit", "pentest", "Metasploit 框架基础", "高级", "理解模块、Payload、Session 和实验环境隔离。", "在靶场中完成一次可回滚的模块验证。", "能说明模块适用条件、风险和清理步骤。", ["metasploit", "kali"], ["virtual-lab", "pentest-method"]),
  N("code-audit", "pentest", "PHP/Java 代码审计", "高级", "从输入、处理、输出和权限角度定位漏洞。", "对教学代码完成一份审计笔记。", "能将代码问题映射到请求与修复方案。", ["vscode"], ["python-basics", "php-java-overview", "web-request-flow"]),
  N("middleware-security", "pentest", "Tomcat、WebLogic、Spring 安全", "高级", "理解组件边界、配置风险和补丁验证。", "为本地演示环境建立组件资产表。", "能阅读公告并判断是否影响当前版本。", ["docker"], ["cms-framework", "php-java-overview"]),
  N("docker-security", "pentest", "Docker 与容器安全", "进阶", "理解镜像、容器、网络、挂载和最小权限。", "加固一个本地教学容器并记录差异。", "能说明容器隔离边界和常见误区。", ["docker"], ["virtual-lab"]),
  N("redis-db-security", "pentest", "Redis 与数据库安全", "进阶", "理解默认配置、认证、网络暴露和备份风险。", "检查本地服务配置并生成加固清单。", "能提出访问控制、网络隔离和审计措施。", ["docker"], ["sql-database"]),
  N("reporting", "pentest", "漏洞报告与风险评级", "基础", "使用影响、复现、证据和修复建议描述漏洞。", "把一个靶场题写成一页报告。", "报告可被开发或运维直接理解和修复。", ["vscode"], ["pentest-method"]),
  N("capstone", "pentest", "综合靶场与作品项目", "进阶", "把环境、工具、漏洞、报告和复盘完整串联。", "完成一个只在本地靶场运行的综合项目。", "拥有可展示的授权范围、过程证据和修复建议。", ["kali", "burp", "docker"], ["reporting", "burp-workflow", "nmap-workflow"]),

  N("ad-basics", "defense", "Windows 域与 Active Directory", "高级", "理解域、用户、组、策略和信任关系。", "在本地域实验中画出资产和权限关系。", "能解释域认证和管理边界。", ["virtualbox"], ["windows-basics"]),
  N("powershell", "defense", "PowerShell 安全运维", "进阶", "使用 PowerShell 查询系统、日志和服务。", "写一个本机安全检查脚本。", "能阅读审计友好的 PowerShell。", ["windows-terminal"], ["shell-scripting"]),
  N("kerberos-ntlm", "defense", "Kerberos 与 NTLM", "高级", "理解域认证流程、票据和常见防守观测点。", "根据日志绘制一次认证流程。", "能解释异常认证与检测思路。", ["virtualbox"], ["ad-basics"]),
  N("exchange-security", "defense", "Exchange 与企业服务安全", "选学", "了解企业邮件服务、暴露面和补丁管理。", "为教学环境建立服务暴露清单。", "能识别配置与版本管理风险。", ["docker"], ["ad-basics"], true),
  N("privilege-escalation", "defense", "Windows/Linux 权限提升原理", "高级", "从错误配置、服务和权限角度理解提权风险。", "只在本地靶场做枚举与加固复盘。", "能从防守角度提出最小权限改进。", ["kali", "sysinternals"], ["linux-basics", "windows-basics"]),
  N("lateral-movement", "defense", "内网信息收集与横向风险", "高级", "理解网络分区、凭据暴露和横向路径。", "为虚拟实验网络绘制风险路径。", "能写出隔离、检测和凭据保护建议。", ["kali", "wireshark"], ["ad-basics", "privilege-escalation"]),
  N("incident-response", "defense", "应急响应与日志分析", "进阶", "掌握发现、遏制、取证、恢复与复盘流程。", "分析一组脱敏日志并完成事件时间线。", "能形成可执行的事件响应清单。", ["sysinternals", "wireshark"], ["powershell", "windows-basics"]),
  N("cobalt-strike-awareness", "defense", "团队协作工具与检测思路", "高级", "从蓝队角度认识商业协作工具产生的检测线索。", "在授权演示环境中整理检测点，不连接真实目标。", "能描述行为特征和防御/审计手段。", ["kali"], ["incident-response"], true),
  N("mobile-wireless", "defense", "移动端与无线安全扩展", "选学", "了解移动应用、无线协议和实验边界。", "只使用个人设备和隔离实验环境。", "能识别学习前置条件与合规风险。", ["kali"], ["network-model"], true),
];

const TOOLS = [
  { id: "python", name: "Python", category: "基础开发", stage: "foundation", purpose: "编写安全脚本、处理日志和自动化重复任务。", os: "Windows / Linux", type: "安装程序", pricing: "free", version: "3.x 稳定版", url: "https://www.python.org/downloads/windows/", docs: "https://docs.python.org/zh-cn/3/tutorial/", install: "下载 Windows x64 安装器；勾选 Add Python to PATH；安装后运行 python --version。", alternative: "无需替代" },
  { id: "vscode", name: "Visual Studio Code", category: "基础开发", stage: "foundation", purpose: "阅读代码、写 Python/Shell/HTML 和记录报告。", os: "Windows 10/11", type: "User Installer / ZIP", pricing: "free", version: "Stable", url: "https://code.visualstudio.com/download", docs: "https://code.visualstudio.com/docs/setup/windows", install: "优先选择 User Installer；无需管理员权限；安装后可用 code . 打开项目。", alternative: "Notepad++（免费）" },
  { id: "virtualbox", name: "Oracle VirtualBox", category: "实验环境", stage: "foundation", purpose: "运行 Kali 和本地靶场，支持快照与隔离网络。", os: "Windows x64", type: "安装程序", pricing: "free", version: "7.x", url: "https://www.virtualbox.org/wiki/Downloads", docs: "https://www.virtualbox.org/manual/UserManual.html", install: "安装主程序；根据需要安装扩展包；创建 NAT/Host-only 网络并保留快照。", alternative: "VMware Workstation（部分版本收费/需许可证）" },
  { id: "kali", name: "Kali Linux", category: "实验环境", stage: "foundation", purpose: "在隔离虚拟机中使用安全工具和教学靶场。", os: "VMware / VirtualBox", type: "预构建虚拟机镜像", pricing: "free", version: "Point release", url: "https://www.kali.org/get-kali/", docs: "https://www.kali.org/docs/", install: "下载官方 VMware 或 VirtualBox 镜像；导入后立即修改默认密码并创建快照。", alternative: "Ubuntu + 手动安装工具" },
  { id: "docker", name: "Docker Desktop", category: "实验环境", stage: "foundation", purpose: "启动 Juice Shop、DVWA 等本地教学服务。", os: "Windows 10/11", type: "安装程序", pricing: "freemium", version: "Stable", url: "https://www.docker.com/products/docker-desktop/", docs: "https://docs.docker.com/desktop/setup/install/windows-install/", install: "确认 WSL2/虚拟化已启用；安装 Docker Desktop；只运行本地教学容器。", alternative: "VirtualBox + 本地虚拟机" },
  { id: "wireshark", name: "Wireshark", category: "网络分析", stage: "foundation", purpose: "观察 DNS、TCP、HTTP 与异常流量。", os: "Windows x64", type: "安装程序", pricing: "free", version: "Stable", url: "https://www.wireshark.org/download/", docs: "https://www.wireshark.org/docs/", install: "安装 Windows x64 版本；按提示安装 Npcap；仅在自己的网络和实验环境抓包。", alternative: "tshark（命令行，免费）" },
  { id: "nmap", name: "Nmap", category: "网络分析", stage: "pentest", purpose: "在授权范围内识别主机、端口和服务。", os: "Windows / Kali", type: "安装程序 / 内置", pricing: "free", version: "Stable", url: "https://nmap.org/download.html", docs: "https://nmap.org/book/man.html", install: "Windows 使用官方安装器；Kali 可使用系统包管理器；先对 localhost 做练习。", alternative: "Masscan（免费，需更严格控制范围）" },
  { id: "burp", name: "Burp Suite Community", category: "Web 测试", stage: "pentest", purpose: "学习 HTTP 代理、Repeater、Decoder 和手工验证。", os: "Windows x64 / Linux", type: "安装程序", pricing: "freemium", version: "Community Edition", url: "https://portswigger.net/burp/downloads", docs: "https://portswigger.net/web-security", install: "下载官方安装器；选择 Community Edition；先配置浏览器代理并限定靶场范围。", alternative: "OWASP ZAP（免费开源）" },
  { id: "zap", name: "OWASP ZAP", category: "Web 测试", stage: "pentest", purpose: "使用开源工具学习代理、爬取和基础安全测试。", os: "Windows / Linux", type: "安装程序", pricing: "free", version: "Stable", url: "https://www.zaproxy.org/download/", docs: "https://www.zaproxy.org/docs/", install: "下载 Windows 安装器；启动后使用 Protected Mode 保护目标范围。", alternative: "Burp Suite Community" },
  { id: "sqlmap", name: "SQLMap", category: "Web 测试", stage: "web-vuln", purpose: "理解 SQL 注入自动化验证和证据复核。", os: "Kali / Python", type: "开源项目", pricing: "free", version: "GitHub/Kali", url: "https://github.com/sqlmapproject/sqlmap", docs: "https://github.com/sqlmapproject/sqlmap/wiki", install: "建议在 Kali 或 Python 虚拟环境中使用；仅对本地靶场执行。", alternative: "手工 Burp Repeater 验证" },
  { id: "metasploit", name: "Metasploit Framework", category: "授权靶场", stage: "pentest", purpose: "在回滚靶场中理解模块、Session 和验证流程。", os: "Kali / Windows", type: "内置 / 安装程序", pricing: "free", version: "Framework", url: "https://www.metasploit.com/", docs: "https://docs.metasploit.com/", install: "推荐随 Kali 使用；每次实验前创建快照并使用本地易受攻击靶机。", alternative: "手工验证与 OWASP 靶场" },
  { id: "sysinternals", name: "Microsoft Sysinternals", category: "主机分析", stage: "defense", purpose: "检查进程、服务、启动项和系统行为。", os: "Windows", type: "工具包", pricing: "free", version: "Suite", url: "https://learn.microsoft.com/sysinternals/", docs: "https://learn.microsoft.com/sysinternals/downloads/", install: "下载 Sysinternals Suite 并解压到工具目录；优先从 Process Explorer、Autoruns 开始。", alternative: "Windows 内置任务管理器/事件查看器" },
  { id: "windows-terminal", name: "Windows Terminal", category: "系统工具", stage: "foundation", purpose: "统一使用 PowerShell、CMD 和 WSL。", os: "Windows 10/11", type: "Microsoft Store / GitHub", pricing: "free", version: "Stable", url: "https://learn.microsoft.com/windows/terminal/", docs: "https://learn.microsoft.com/windows/terminal/get-started", install: "从 Microsoft Store 或官方发布页安装；配置 PowerShell 与 WSL 标签页。", alternative: "PowerShell / CMD" },
  { id: "browser-devtools", name: "浏览器开发者工具", category: "Web 基础", stage: "foundation", purpose: "观察 DOM、Network、Cookie 和前端脚本。", os: "Windows 浏览器", type: "内置", pricing: "free", version: "随浏览器", url: "https://developer.chrome.com/docs/devtools/", docs: "https://developer.chrome.com/docs/devtools/", install: "Chrome、Edge、Firefox 均内置，按 F12 打开；仅分析自己的站点和靶场。", alternative: "Firefox Developer Tools" },
  { id: "sevenzip", name: "7-Zip", category: "系统工具", stage: "foundation", purpose: "解压 ISO、虚拟机包和工具压缩文件。", os: "Windows x64", type: "安装程序", pricing: "free", version: "Stable", url: "https://www.7-zip.org/download.html", docs: "https://www.7-zip.org/faq.html", install: "下载 x64 安装器；安装后右键菜单可解压镜像和工具包。", alternative: "Windows 内置压缩工具" },
];

// 直达视频资源：B站分P使用真实播放器分页数据核验；抖音作品保留登录/App限制。
const VERIFIED_AT = "2026-07-29";
const SERIES_CATALOG = [
  { id: "s-sangfor", stage: "foundation", title: "深信服 2024 网络安全入门培训（54P）", platform: "哔哩哔哩", bvid: "BV1B2421N7Uu", creator: "网络安全基础入门", url: "https://www.bilibili.com/video/BV1B2421N7Uu/", summary: "官方入门课，覆盖安全概念、协议、操作系统、Web 与攻防。" },
  { id: "s-network", stage: "foundation", title: "网络安全基础网络课程（35P）", platform: "哔哩哔哩", bvid: "BV1Zj411W7sC", creator: "渗透菜瓜", url: "https://www.bilibili.com/video/BV1Zj411W7sC/", summary: "网络设备、OSI/TCP-IP、IP、DNS、TCP、路由与防火墙。" },
  { id: "s-woniu", stage: "foundation", title: "网络安全入门到精通完整体系（193P）", platform: "哔哩哔哩", bvid: "BV1SY411p7F9", creator: "蜗牛学苑", url: "https://www.bilibili.com/video/BV1SY411p7F9/", summary: "Windows、Linux、协议、域、设备、数据库和安全运维。" },
  { id: "s-web-burp", stage: "web-vuln", title: "Burp Suite 渗透测试实战（99P）", platform: "哔哩哔哩", bvid: "BV1WGp7eMEfR", creator: "网络安全七侠", url: "https://www.bilibili.com/video/BV1WGp7eMEfR/", summary: "从 HTTP、Burp 到 SQLi、XSS、上传、CSRF、RCE、SSRF。" },
  { id: "s-sqli", stage: "web-vuln", title: "SQL 注入漏洞攻防（100P）", platform: "哔哩哔哩", bvid: "BV1TZ421Y7XC", creator: "八方网域", url: "https://www.bilibili.com/video/BV1TZ421Y7XC/", summary: "SQL 注入原理、类型、SQLMap、XSS 与防御。" },
  { id: "s-web-route", stage: "web-vuln", title: "零基础 Web 渗透路线（100P）", platform: "哔哩哔哩", bvid: "BV1sC4y127fv", creator: "白帽小黑客", url: "https://www.bilibili.com/video/BV1sC4y127fv/", summary: "HTTP、信息收集、Burp、SQLMap、WebLogic、Fastjson、Redis。" },
  { id: "s-pentest", stage: "pentest", title: "网络安全 300 集：Web/渗透/代码审计（281P）", platform: "哔哩哔哩", bvid: "BV1Lf4y1t7Mc", creator: "网络安全_", url: "https://www.bilibili.com/video/BV1Lf4y1t7Mc/", summary: "覆盖网络基础、Web 漏洞、Linux、代码审计、提权和报告。" },
  { id: "s-pentest-route", stage: "pentest", title: "零基础全套渗透测试路线（100P）", platform: "哔哩哔哩", bvid: "BV1sC4y127fv", creator: "白帽小黑客", url: "https://www.bilibili.com/video/BV1sC4y127fv/", summary: "从环境准备、信息收集、工具到内网和提权。" },
  { id: "s-redteam", stage: "pentest", title: "网络安全全套进阶课程（87P）", platform: "哔哩哔哩", bvid: "BV1bwPFejEei", creator: "蚁景网络安全教学", url: "https://www.bilibili.com/video/BV1bwPFejEei/", summary: "Kali、Docker、信息收集、MSF、Cobalt Strike 与内网。" },
  { id: "s-emergency", stage: "defense", title: "网络安全应急响应精讲（7P）", platform: "哔哩哔哩", bvid: "BV11VGXzBE6d", creator: "黑客小野猫", url: "https://www.bilibili.com/video/BV11VGXzBE6d/", summary: "应急响应理论、流程和实操，适合蓝队复盘。" },
  { id: "s-domain", stage: "defense", title: "Windows 域与安全设备课程（193P）", platform: "哔哩哔哩", bvid: "BV1SY411p7F9", creator: "蜗牛学苑", url: "https://www.bilibili.com/video/BV1SY411p7F9/", summary: "AD 域、组策略、Windows/Linux、设备、日志与数据库安全。" },
  { id: "s-internal", stage: "defense", title: "内网、提权与横向移动课程（87P）", platform: "哔哩哔哩", bvid: "BV1bwPFejEei", creator: "蚁景网络安全教学", url: "https://www.bilibili.com/video/BV1bwPFejEei/", summary: "域环境、凭据、PowerShell、提权、横向和协作工具。" },
  { id: "s-docker", stage: "pentest", title: "Docker 容器入门到进阶（54P）", platform: "哔哩哔哩", bvid: "BV1Ab4y1h7hG", creator: "乐字节-程序猿有点呆", url: "https://www.bilibili.com/video/BV1Ab4y1h7hG/", summary: "容器、镜像、网络、挂载、Dockerfile 与 Redis 集群。" },
  { id: "s-mobile", stage: "defense", title: "移动安全新手教程（10P）", platform: "哔哩哔哩", bvid: "BV1at4y1W7Rw", creator: "网络安全移动安全", url: "https://www.bilibili.com/video/BV1at4y1W7Rw/", summary: "移动端安全扩展方向，需结合个人设备和授权环境。" },
];

const BILI_META = {
  "BV1B2421N7Uu": { creator: "网络安全基础入门", publishedAt: "2024-03-15" },
  "BV1WGp7eMEfR": { creator: "网络安全七侠", publishedAt: "2024-09-09" },
  "BV1TZ421Y7XC": { creator: "八方网域", publishedAt: "2024-03-08" },
  "BV1xh1TB5E2K": { creator: "哔哩网络安全官方账号", publishedAt: "2025-10-31" },
  "BV1Lf4y1t7Mc": { creator: "网络安全_", publishedAt: "2021-03-22" },
  "BV1sC4y127fv": { creator: "白帽小黑客", publishedAt: "2023-11-28" },
  "BV1CN4y1Y72m": { creator: "一只小黑帽er", publishedAt: "2023-12-04" },
  "BV1Zj411W7sC": { creator: "渗透菜瓜", publishedAt: "2023-12-11" },
  "BV1SY411p7F9": { creator: "蜗牛学苑", publishedAt: "2021-12-09" },
  "BV1bwPFejEei": { creator: "蚁景网络安全教学", publishedAt: "2025-02-21" },
  "BV11VGXzBE6d": { creator: "黑客小野猫", publishedAt: "2025-04-30" },
  "BV1Ab4y1h7hG": { creator: "乐字节-程序猿有点呆", publishedAt: "2021-10-16" },
  "BV1at4y1W7Rw": { creator: "网络安全移动安全", publishedAt: "2022-05-17" },
  "BV1x5411R7EE": { creator: "数据潜水员", publishedAt: "2022-05-20" },
};

const B = (id, nodeId, bvid, page, title, duration, level = "基础", summary = "对应路线节点的具体中文视频分P。") => {
  const meta = BILI_META[bvid] || { creator: "哔哩哔哩 UP 主", publishedAt: "" };
  const seriesUrl = `https://www.bilibili.com/video/${bvid}/`;
  const directUrl = `${seriesUrl}?p=${page}`;
  return { id, title, creator: meta.creator, platform: "哔哩哔哩", type: "视频", stage: nodeByIdForData(nodeId)?.stage || "foundation", nodeId, level, pricing: "free", lang: "中文", duration, episodeLabel: `第 ${page} P`, summary, url: directUrl, directUrl, seriesUrl, publishedAt: meta.publishedAt, verifiedAt: VERIFIED_AT, accessMode: "网页可播", requiresLogin: false, availability: "available", recommended: true, searchEntry: false };
};
const D = (id, nodeId, directUrl, title, creator, duration, publishedAt, level = "基础", summary = "抖音精选具体作品，可能需要登录或使用 App。") => ({ id, title, creator, platform: "抖音", type: "视频", stage: nodeByIdForData(nodeId)?.stage || "foundation", nodeId, level, pricing: "free", lang: "中文", duration, episodeLabel: "具体作品", summary, url: directUrl, directUrl, seriesUrl: "", publishedAt, verifiedAt: VERIFIED_AT, accessMode: "需登录", requiresLogin: true, availability: "available", recommended: false, searchEntry: false });
const nodeByIdForData = (id) => NODES.find((node) => node.id === id);

// 每个能力节点 3 条视频：前两条为核心直达分P，第三条为实操/复习或跨平台补充。
const VIDEO_RESOURCES = [
  B("v-computer-1", "computer-basics", "BV1x5411R7EE", 2, "计算机硬件与组成（1）", "21:51", "入门", "从硬件、系统和资源职责建立计算机底层认知。"), B("v-computer-2", "computer-basics", "BV1SY411p7F9", 21, "计算机网络概述", "72:37", "入门", "把计算机组成与网络通信放在同一张基础图中理解。"), D("v-computer-3", "computer-basics", "https://jingxuan.douyin.com/m/video/7648119562176695587", "普林斯顿计算机公开课：从硬件到通信", "玉米读书", "03:12", "2026-06-06", "入门", "短视频补充计算机硬件、软件和通信的整体视角。"),
  B("v-security-1", "security-intro", "BV1B2421N7Uu", 1, "信息安全：安全挑战与现状", "12:48", "入门", "认识资产、威胁、漏洞、风险及安全行业背景。"), B("v-security-2", "security-intro", "BV1B2421N7Uu", 2, "信息安全：安全概念及常见术语", "18:38", "入门", "建立后续学习统一的安全术语表。"), D("v-security-3", "security-intro", "https://jingxuan.douyin.com/m/video/7618795540100222249", "SRC 平台是什么：从 0 选择合规平台", "360智榜样网络安全（官方）", "03:23", "2026-03-19", "入门", "用平台选择和授权范围理解合法学习边界。"),
  B("v-network-1", "network-model", "BV1CN4y1Y72m", 4, "OSI 七层与 TCP/IP 五层模型", "48:58", "基础", "理解分层、封装与各层协议职责。"), B("v-network-2", "network-model", "BV1Zj411W7sC", 14, "TCP 三次握手", "40:32", "基础", "把抽象分层落到真实连接过程。"), B("v-network-3", "network-model", "BV1SY411p7F9", 74, "ARP 协议与抓包观察", "72:18", "进阶", "用抓包验证 DNS、TCP 和 HTTP 的分层证据。"),
  B("v-ip-1", "ip-subnet", "BV1Lf4y1t7Mc", 8, "IP 地址详解", "62:33", "基础", "掌握 IPv4 表示、分类和网络边界。"), B("v-ip-2", "ip-subnet", "BV1SY411p7F9", 28, "子网掩码", "35:16", "基础", "理解子网划分和隔离靶场地址规划。"), D("v-ip-3", "ip-subnet", "https://jingxuan.douyin.com/m/video/7484624956857306428", "电脑如何获取 IP：DHCP 协议详解", "网络工程师-波哥", "04:44", "2025-03-22", "基础", "补充 DHCP 分配地址、网关和 DNS 的完整过程。"),
  B("v-dns-1", "dns-http", "BV1Zj411W7sC", 8, "DNS 的定义和由来", "33:29", "基础", "理解域名、递归查询和解析结果。"), B("v-dns-2", "dns-http", "BV1SY411p7F9", 92, "HTTP 协议", "58:34", "基础", "从请求方法、头部和响应状态进入 Web。"), D("v-dns-3", "dns-http", "https://jingxuan.douyin.com/m/video/7542761848400137507", "在浏览器输入 URL 后发生了什么", "技术蛋老师", "未标注", "2025-08-26", "基础", "短视频串起 DNS、TCP、TLS、HTTP 和页面渲染。"),
  B("v-windows-1", "windows-basics", "BV1SY411p7F9", 11, "Windows 用户管理", "52:06", "基础", "创建用户并理解账户边界。"), B("v-windows-2", "windows-basics", "BV1SY411p7F9", 13, "NTFS 文件权限", "42:47", "基础", "掌握 ACL、继承和最小权限。"), B("v-windows-3", "windows-basics", "BV1SY411p7F9", 19, "Windows 注册表基础", "45:42", "进阶", "把进程、服务、注册表和审计线索联系起来。"),
  B("v-linux-1", "linux-basics", "BV1SY411p7F9", 124, "Linux 操作系统概述", "53:04", "基础", "了解内核、用户空间和发行版结构。"), B("v-linux-2", "linux-basics", "BV1SY411p7F9", 127, "Linux 文件系统", "52:47", "基础", "掌握目录、文件、挂载和权限入口。"), D("v-linux-3", "linux-basics", "https://jingxuan.douyin.com/m/video/7613641405314960667", "Linux 内核与用户空间的边界", "01熵", "18:00", "2026-03-05", "进阶", "从进程树和特权模式理解 Linux 安全边界。"),
  B("v-shell-1", "shell-scripting", "BV1SY411p7F9", 141, "Shell 环境与变量", "66:07", "基础", "掌握 Shell 变量、环境和命令组合。"), B("v-shell-2", "shell-scripting", "BV1SY411p7F9", 142, "Shell 脚本基础应用", "63:54", "基础", "用脚本完成本地批处理和日志筛选。"), B("v-shell-3", "shell-scripting", "BV1SY411p7F9", 147, "awk 与 sed 字符串处理", "66:50", "进阶", "把文本处理能力迁移到安全日志分析。"),
  B("v-python-1", "python-basics", "BV1Lf4y1t7Mc", 239, "Python 安装与使用", "31:29", "入门", "配置解释器和脚本运行环境。"), B("v-python-2", "python-basics", "BV1Lf4y1t7Mc", 240, "Python 输出", "29:54", "基础", "从输入输出和数据类型开始写安全小脚本。"), B("v-python-3", "python-basics", "BV1Lf4y1t7Mc", 241, "Python 输入", "22:29", "基础", "读取用户输入并练习校验与异常处理。"),
  B("v-webbasics-1", "web-basics", "BV1Lf4y1t7Mc", 260, "HTML 表单", "64:35", "基础", "理解表单输入、DOM 和浏览器提交。"), B("v-webbasics-2", "web-basics", "BV1Lf4y1t7Mc", 261, "HTML 与 CSS", "47:47", "基础", "认识页面结构、样式和前端边界。"), B("v-webbasics-3", "web-basics", "BV1Lf4y1t7Mc", 281, "HTML 常用标签", "57:06", "基础", "复习常见标签并观察 Network 请求。"),
  B("v-phpjava-1", "php-java-overview", "BV1Lf4y1t7Mc", 263, "PHP 基础与变量", "87:08", "基础", "从服务端语言理解请求处理。"), B("v-phpjava-2", "php-java-overview", "BV1Lf4y1t7Mc", 272, "PHP 与 MySQL 连接", "48:08", "基础", "看清应用、数据库和权限的协作关系。"), B("v-phpjava-3", "php-java-overview", "BV1SY411p7F9", 180, "Tomcat 配置应用", "58:35", "进阶", "补充 Java Web 容器在架构中的位置。"),
  B("v-sql-1", "sql-database", "BV1WGp7eMEfR", 69, "MySQL 基础", "57:55", "基础", "表、查询、权限与应用数据流入门。"), B("v-sql-2", "sql-database", "BV1sC4y127fv", 92, "数据库基础", "11:36", "基础", "用短课复习数据库对象和连接。"), B("v-sql-3", "sql-database", "BV1SY411p7F9", 168, "MySQL 补充知识", "70:22", "进阶", "补充生产数据库常见结构与安全注意点。"),
  B("v-lab-1", "virtual-lab", "BV1CN4y1Y72m", 20, "Kali 2023 系统安装", "20:38", "基础", "在虚拟机中安装 Kali 并保持网络隔离。"), B("v-lab-2", "virtual-lab", "BV1CN4y1Y72m", 21, "Kali 快照与实验说明", "02:50", "基础", "建立快照、回滚和靶场安全规则。"), B("v-lab-3", "virtual-lab", "BV1CN4y1Y72m", 22, "BWAPP 靶场搭建", "38:38", "基础", "启动本地 Web 靶场，不连接陌生目标。"),
  B("v-devices-1", "security-devices", "BV1Lf4y1t7Mc", 102, "防火墙基础", "40:39", "选学", "理解防火墙的检测、阻断和策略边界。"), B("v-devices-2", "security-devices", "BV1SY411p7F9", 121, "网络安全设备一", "54:56", "选学", "认识企业安全设备的部署位置。"), B("v-devices-3", "security-devices", "BV1SY411p7F9", 122, "网络安全设备二", "58:14", "选学", "从设备联动理解安全运营闭环。"),
  B("v-flow-1", "web-request-flow", "BV1WGp7eMEfR", 6, "网站运行原理", "12:01", "基础", "从浏览器到服务端拆解请求链路。"), B("v-flow-2", "web-request-flow", "BV1WGp7eMEfR", 7, "HTTP 协议介绍", "12:01", "基础", "理解请求行、请求头、正文与响应。"), B("v-flow-3", "web-request-flow", "BV1SY411p7F9", 93, "分析 HTTP 报文", "22:17", "进阶", "将请求链路落到抓包字段。"),
  B("v-recon-1", "recon-directory", "BV1sC4y127fv", 9, "域名信息收集", "48:22", "基础", "在授权范围内建立被动资产清单。"), B("v-recon-2", "recon-directory", "BV1sC4y127fv", 10, "IP 与端口信息收集", "60:16", "基础", "识别主机、端口并记录边界。"), B("v-recon-3", "recon-directory", "BV1bwPFejEei", 12, "子域名收集", "32:11", "进阶", "用公开信息补充资产地图，不越权探测。"),
  B("v-sqli-1", "sql-injection", "BV1TZ421Y7XC", 2, "SQL 注入基础：什么是 SQL 注入", "19:59", "进阶", "理解拼接 SQL、参数和漏洞成因。"), B("v-sqli-2", "sql-injection", "BV1TZ421Y7XC", 9, "SQL 注入演示", "20:00", "进阶", "在教学靶场观察注入输入如何影响查询。"), D("v-sqli-3", "sql-injection", "https://jingxuan.douyin.com/m/video/7565828487072845062", "SQL 注入案例全流程", "网安学习室", "34:17", "2025-10-27", "进阶", "抖音具体案例视频；仅在授权靶场复现。"),
  B("v-xss-1", "xss", "BV1TZ421Y7XC", 51, "XSS 跨站脚本攻击篇", "12:55", "进阶", "认识 XSS 的输入、输出和执行边界。"), B("v-xss-2", "xss", "BV1TZ421Y7XC", 55, "反射型与存储型 XSS", "19:59", "进阶", "对比不同 XSS 类型与影响。"), B("v-xss-3", "xss", "BV1sC4y127fv", 60, "存储型 XSS 原理", "14:19", "进阶", "在本地靶场分析存储型输入与防护。"),
  B("v-csrf-1", "csrf", "BV1WGp7eMEfR", 84, "CSRF 防御", "59:00", "进阶", "理解 Token、SameSite 和鉴权边界。"), B("v-csrf-2", "csrf", "BV1WGp7eMEfR", 85, "CSRF 实战", "69:46", "进阶", "在授权靶场验证状态变更请求。"), B("v-csrf-3", "csrf", "BV1Lf4y1t7Mc", 215, "CSRF", "67:28", "进阶", "用另一套课程复习 CSRF 防护思路。"),
  B("v-upload-1", "upload", "BV1WGp7eMEfR", 49, "文件上传漏洞", "02:44", "进阶", "理解上传入口、类型校验和存储风险。"), B("v-upload-2", "upload", "BV1WGp7eMEfR", 54, "文件上传防御", "03:57", "进阶", "从白名单、隔离和不可执行目录进行修复。"), B("v-upload-3", "upload", "BV1TZ421Y7XC", 89, "文件上传漏洞篇", "19:59", "进阶", "用 SQL 系列的 Web 漏洞章节补充上传基础。"),
  B("v-path-1", "path-traversal", "BV1WGp7eMEfR", 79, "文件包含", "85:37", "进阶", "理解路径拼接与包含入口。"), B("v-path-2", "path-traversal", "BV1WGp7eMEfR", 80, "文件包含漏洞", "61:22", "进阶", "练习规范化、白名单和最小权限修复。"), B("v-path-3", "path-traversal", "BV1Lf4y1t7Mc", 213, "文件包含", "64:19", "进阶", "从另一套课程复盘路径遍历风险。"),
  B("v-rce-1", "rce", "BV1WGp7eMEfR", 35, "命令执行漏洞详解", "05:24", "高级", "从不可信输入到系统命令的风险链。"), B("v-rce-2", "rce", "BV1WGp7eMEfR", 81, "命令执行简介与函数", "90:31", "高级", "在隔离靶场理解命令执行入口。"), B("v-rce-3", "rce", "BV1WGp7eMEfR", 82, "命令执行利用与防御", "102:45", "高级", "以修复为目标复核命令执行防护。"),
  B("v-ssrf-1", "ssrf", "BV1WGp7eMEfR", 95, "SSRF 简介", "105:16", "高级", "理解服务端代发请求和出站边界。"), B("v-ssrf-2", "ssrf", "BV1WGp7eMEfR", 96, "SSRF 利用与修改", "95:20", "高级", "在隔离环境观察请求方向和访问控制。"), B("v-ssrf-3", "ssrf", "BV1sC4y127fv", 89, "SSRF 漏洞利用", "19:41", "高级", "用第二套课程复习白名单和网络隔离。"),
  B("v-webshell-1", "webshell", "BV1WGp7eMEfR", 50, "WebShell 分类", "04:10", "高级", "从防守角度识别可疑脚本和落地风险。"), B("v-webshell-2", "webshell", "BV1WGp7eMEfR", 53, "WebShell 管理工具风险", "07:35", "高级", "理解文件完整性、检测与响应线索。"), B("v-webshell-3", "webshell", "BV1Lf4y1t7Mc", 207, "WebShell 介绍", "32:01", "高级", "建立 WebShell 检测和清理笔记。"),
  B("v-deser-1", "deserialization", "BV1sC4y127fv", 19, "Fastjson 反序列化", "21:12", "高级", "理解对象序列化和类型边界。"), B("v-deser-2", "deserialization", "BV1sC4y127fv", 20, "Shiro 反序列化", "49:34", "高级", "从 Java 技术栈观察反序列化前置条件。"), B("v-deser-3", "deserialization", "BV1Lf4y1t7Mc", 223, "反序列化漏洞", "71:06", "高级", "用代码审计角度总结安全反序列化。"),
  B("v-access-1", "access-control", "BV1WGp7eMEfR", 9, "短信验证码逻辑漏洞", "12:01", "进阶", "理解认证流程和业务逻辑边界。"), B("v-access-2", "access-control", "BV1WGp7eMEfR", 87, "逻辑漏洞简介", "52:18", "进阶", "区分认证、授权和业务流程问题。"), B("v-access-3", "access-control", "BV1WGp7eMEfR", 88, "逻辑漏洞讲解", "61:13", "进阶", "用测试矩阵复核水平/垂直权限。"),
  B("v-cms-1", "cms-framework", "BV1sC4y127fv", 73, "米拓 CMS 框架实战", "08:05", "进阶", "从版本识别和补丁验证理解中间件风险。"), B("v-cms-2", "cms-framework", "BV1sC4y127fv", 74, "易忧 CMS 框架实战", "02:07", "进阶", "认识框架版本、公告和本地验证边界。"), B("v-cms-3", "cms-framework", "BV1sC4y127fv", 75, "yzmCMS 框架实战上", "04:17", "进阶", "以授权 CMS 靶场建立版本风险清单。"),
  B("v-method-1", "pentest-method", "BV1CN4y1Y72m", 29, "渗透测试工作的授权说明", "13:20", "基础", "明确目标、授权书、停止条件和范围。"), B("v-method-2", "pentest-method", "BV1sC4y127fv", 8, "渗透测试工具环境准备", "52:23", "基础", "把环境准备放在正式测试之前。"), D("v-method-3", "pentest-method", "https://jingxuan.douyin.com/m/video/7645613848333962505", "零基础学挖漏洞的 5 个阶段", "网络安全黑卡", "05:27", "2026-05-30", "基础", "用短视频复习阶段依赖，但实操只在授权环境。"),
  B("v-burp-1", "burp-workflow", "BV1xh1TB5E2K", 2, "Burp 基本介绍", "07:39", "进阶", "认识代理、目标和请求编辑。"), B("v-burp-2", "burp-workflow", "BV1xh1TB5E2K", 7, "Burp 基本配置", "12:52", "进阶", "配置浏览器代理、证书和范围。"), B("v-burp-3", "burp-workflow", "BV1sC4y127fv", 13, "BurpSuite 工具介绍", "56:45", "进阶", "用另一套中文课程完成工作流复习。"),
  B("v-nmap-1", "nmap-workflow", "BV1CN4y1Y72m", 30, "Nmap 主机发现", "22:43", "进阶", "只对本机或靶场识别存活主机。"), B("v-nmap-2", "nmap-workflow", "BV1CN4y1Y72m", 31, "Nmap 端口扫描", "24:36", "进阶", "把端口结果转成服务验证计划。"), B("v-nmap-3", "nmap-workflow", "BV1CN4y1Y72m", 32, "Nmap 版本与漏洞扫描", "15:20", "高级", "理解扫描边界和人工复核。"),
  B("v-wire-1", "wireshark-workflow", "BV1SY411p7F9", 72, "Wireshark 捕获过滤器", "77:45", "进阶", "用过滤器缩小协议分析范围。"), B("v-wire-2", "wireshark-workflow", "BV1SY411p7F9", 73, "Wireshark 显示过滤器", "36:36", "进阶", "从字段和流跟踪定位请求。"), B("v-wire-3", "wireshark-workflow", "BV1CN4y1Y72m", 5, "端口与 Wireshark 抓包", "10:44", "进阶", "用短课复习端口和分层数据。"),
  B("v-sqlmap-1", "sqlmap-workflow", "BV1TZ421Y7XC", 37, "SQLMap 工具篇 01", "20:01", "高级", "理解自动化注入的适用范围。"), B("v-sqlmap-2", "sqlmap-workflow", "BV1TZ421Y7XC", 38, "SQLMap 工具篇 02", "20:00", "高级", "把工具输出与手工证据互相验证。"), B("v-sqlmap-3", "sqlmap-workflow", "BV1WGp7eMEfR", 45, "SQLMap 检测漏洞", "07:04", "高级", "在 DVWA 等本地靶场复核结果。"),
  B("v-msf-1", "metasploit", "BV1sC4y127fv", 24, "Metasploit 渗透基础", "45:20", "高级", "理解模块、Payload、Session 和清理。"), B("v-msf-2", "metasploit", "BV1sC4y127fv", 25, "Metasploit 攻击 Windows/Linux 实战", "74:38", "高级", "只在可回滚靶机中验证模块。"), B("v-msf-3", "metasploit", "BV1bwPFejEei", 19, "Metasploit 目录结构", "16:59", "高级", "从框架结构复习模块选择。"),
  B("v-audit-1", "code-audit", "BV1sC4y127fv", 71, "代码审计前后端关系", "03:10", "高级", "从输入、处理、输出建立审计视角。"), B("v-audit-2", "code-audit", "BV1Lf4y1t7Mc", 211, "文件上传代码审计", "59:21", "高级", "将代码问题映射到请求和修复方案。"), B("v-audit-3", "code-audit", "BV1Lf4y1t7Mc", 204, "PHP 代码注入", "62:01", "高级", "在教学代码中标记危险数据流。"),
  B("v-middleware-1", "middleware-security", "BV1sC4y127fv", 15, "WebLogic 漏洞", "26:34", "高级", "阅读公告、版本和补丁影响。"), B("v-middleware-2", "middleware-security", "BV1sC4y127fv", 16, "ThinkPHP5 技术栈漏洞", "17:06", "高级", "理解框架边界和版本风险。"), B("v-middleware-3", "middleware-security", "BV1SY411p7F9", 181, "Tomcat 下配置 HTTPS", "63:40", "高级", "用本地环境识别 Java 容器配置。"),
  B("v-docker-1", "docker-security", "BV1Ab4y1h7hG", 3, "容器与虚拟机比较", "02:42", "进阶", "理解隔离边界和常见误区。"), B("v-docker-2", "docker-security", "BV1Ab4y1h7hG", 21, "Docker 目录挂载", "09:01", "进阶", "从挂载、权限和数据面理解容器风险。"), B("v-docker-3", "docker-security", "BV1SY411p7F9", 155, "Docker 基础命令与应用", "61:18", "进阶", "把安全基线落到镜像、容器和网络。"),
  B("v-redis-1", "redis-db-security", "BV1sC4y127fv", 21, "Redis 未授权漏洞", "55:41", "进阶", "理解默认配置、认证和网络暴露。"), B("v-redis-2", "redis-db-security", "BV1SY411p7F9", 170, "Redis 配置与使用", "61:07", "进阶", "从服务配置和访问控制进行加固。"), B("v-redis-3", "redis-db-security", "BV1Ab4y1h7hG", 46, "搭建 Redis 集群环境准备", "05:44", "进阶", "在本地容器中观察 Redis 网络边界。"),
  B("v-report-1", "reporting", "BV1TZ421Y7XC", 97, "渗透测试报告编写", "19:59", "基础", "将范围、复现、证据、评级和修复写清楚。"), B("v-report-2", "reporting", "BV1sC4y127fv", 1, "网络安全系统学习路线与安全法", "09:39", "基础", "报告先写清授权与排除项。"), D("v-report-3", "reporting", "https://jingxuan.douyin.com/m/video/7592551985212149027", "漏洞挖掘学习路径", "网安学习室", "00:29", "2026-01-07", "基础", "从案例抽取证据、影响和修复建议。"),
  B("v-capstone-1", "capstone", "BV1sC4y127fv", 77, "认识 CTF", "06:43", "进阶", "建立靶场、CTF 和授权项目的练习边界。"), B("v-capstone-2", "capstone", "BV1sC4y127fv", 85, "DVWA 靶场搭建", "08:50", "进阶", "完成可回滚的综合 Web 实验。"), B("v-capstone-3", "capstone", "BV1WGp7eMEfR", 34, "DVWA 漏洞靶场搭建", "10:31", "进阶", "用第二套课程复盘环境和证据链。"),
  B("v-ad-1", "ad-basics", "BV1SY411p7F9", 99, "AD 域部署 Windows 域", "66:43", "高级", "在本地域实验中理解域、对象和认证边界。"), B("v-ad-2", "ad-basics", "BV1SY411p7F9", 100, "AD 域对象管理", "40:26", "高级", "掌握用户、组和计算机对象。"), B("v-ad-3", "ad-basics", "BV1SY411p7F9", 101, "AD 组策略应用", "45:26", "高级", "把策略和最小权限联系起来。"),
  B("v-ps-1", "powershell", "BV1SY411p7F9", 154, "Windows 配套命令", "45:03", "进阶", "用命令查询本机系统和安全配置。"), B("v-ps-2", "powershell", "BV1bwPFejEei", 61, "PowerShell 获取 RDP 连接记录", "21:01", "进阶", "在本机审计场景中读取日志线索。"), B("v-ps-3", "powershell", "BV1Lf4y1t7Mc", 167, "日志管理与应急分析", "18:45", "进阶", "把 PowerShell 输出用于事件时间线。"),
  B("v-kerb-1", "kerberos-ntlm", "BV1bwPFejEei", 47, "本地账号与域账号定位", "10:10", "高级", "用域部署视频建立 Kerberos/NTLM 前置知识。"), B("v-kerb-2", "kerberos-ntlm", "BV1bwPFejEei", 59, "Windows Hash 简介", "22:49", "高级", "从凭据材料理解域认证防守线索。"), B("v-kerb-3", "kerberos-ntlm", "BV1bwPFejEei", 57, "域内信息收集", "35:55", "高级", "只在实验域观察认证和权限关系。"),
  B("v-exchange-1", "exchange-security", "BV1SY411p7F9", 97, "邮件协议与邮件系统", "52:29", "选学", "了解企业邮件服务暴露面。"), B("v-exchange-2", "exchange-security", "BV1SY411p7F9", 98, "邮件流量分析", "74:16", "选学", "从流量和补丁管理角度分析 Exchange 类服务。"), B("v-exchange-3", "exchange-security", "BV1B2421N7Uu", 44, "接入认证技术", "14:21", "选学", "补充企业服务认证边界。"),
  B("v-privesc-1", "privilege-escalation", "BV1sC4y127fv", 39, "Windows 提权信息收集", "145:38", "高级", "只在本地靶场枚举错误配置并复盘加固。"), B("v-privesc-2", "privilege-escalation", "BV1sC4y127fv", 41, "Linux 提权", "242:36", "高级", "理解 Linux 权限、SUID 和服务风险。"), B("v-privesc-3", "privilege-escalation", "BV1bwPFejEei", 80, "Linux 内核漏洞提权", "59:58", "高级", "从防守视角识别内核与配置风险。"),
  B("v-lateral-1", "lateral-movement", "BV1bwPFejEei", 52, "内网机器 IP 配置与域环境调试", "19:54", "高级", "在虚拟实验网络绘制横向风险路径。"), B("v-lateral-2", "lateral-movement", "BV1sC4y127fv", 43, "内置工具横向移动", "99:23", "高级", "理解网络分区、凭据保护和检测点。"), B("v-lateral-3", "lateral-movement", "BV1bwPFejEei", 87, "内置工具横向移动", "82:02", "高级", "以蓝队视角复核横向行为与阻断。"),
  B("v-ir-1", "incident-response", "BV11VGXzBE6d", 1, "应急响应篇：上", "85:56", "进阶", "掌握发现、遏制、恢复和复盘的总流程。"), B("v-ir-2", "incident-response", "BV11VGXzBE6d", 4, "应急响应实操上", "106:31", "进阶", "用教学事件练习证据和时间线。"), B("v-ir-3", "incident-response", "BV11VGXzBE6d", 7, "应急响应实操续", "61:06", "进阶", "完成一份脱敏事件响应清单。"),
  B("v-cobalt-1", "cobalt-strike-awareness", "BV1bwPFejEei", 23, "Cobalt Strike 简介", "10:03", "高级", "从蓝队角度认识协作工具和检测线索。"), B("v-cobalt-2", "cobalt-strike-awareness", "BV1bwPFejEei", 24, "MSF 攻击 Windows 实例", "40:02", "高级", "只在授权演示环境分析行为链。"), B("v-cobalt-3", "cobalt-strike-awareness", "BV1bwPFejEei", 25, "Cobalt Strike 常用功能", "21:28", "高级", "记录审计点、网络特征和防御措施。"),
  B("v-mobile-1", "mobile-wireless", "BV1at4y1W7Rw", 1, "移动安全教程：第一集", "27:19", "选学", "了解移动端安全学习范围和测试授权。"), B("v-mobile-2", "mobile-wireless", "BV1at4y1W7Rw", 2, "移动安全教程：第二集", "33:03", "选学", "建立移动应用、设备和网络实验边界。"), D("v-mobile-3", "mobile-wireless", "https://www.douyin.com/video/7622699267018312987", "移动端安全科普", "抖音精选", "未标注", "2026-01-01", "选学", "抖音具体作品，需登录/App；仅使用个人设备练习。"),
];

// 搜索页只保留在“继续查找”区，不计入正式视频数量。
const DISCOVERY_RESOURCES = [
  { id: "d-bilibili", title: "哔哩哔哩：继续查找中文课程", platform: "哔哩哔哩", type: "检索", stage: "foundation", nodeId: "security-intro", level: "入门", pricing: "free", lang: "中文", duration: "按需", summary: "正式列表已优先放入具体作品；需要更多内容时再使用平台检索。", url: "https://search.bilibili.com/all?keyword=%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8", searchEntry: true },
  { id: "d-douyin", title: "抖音：继续查找安全短视频", platform: "抖音", type: "检索", stage: "foundation", nodeId: "security-intro", level: "入门", pricing: "free", lang: "中文", duration: "按需", summary: "抖音登录限制较多，正式视频仍使用具体作品页。", url: "https://www.douyin.com/search/%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8", searchEntry: true },
  { id: "d-xhs", title: "小红书：继续查找安全笔记", platform: "小红书", type: "检索", stage: "foundation", nodeId: "security-intro", level: "入门", pricing: "free", lang: "中文", duration: "按需", summary: "小红书笔记页通常要求登录；具体笔记核验后再加入正式列表。", url: "https://www.xiaohongshu.com/search_result?keyword=%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8", searchEntry: true },
  { id: "d-portswigger", title: "PortSwigger Web Security Academy", platform: "PortSwigger", type: "靶场", stage: "web-vuln", nodeId: "burp-workflow", level: "基础", pricing: "free", lang: "英文", duration: "按题", summary: "免费 Web 安全互动实验；正式视频之外的动手补充。", url: "https://portswigger.net/web-security", searchEntry: false },
  { id: "d-heetian", title: "合天网安实验室", platform: "在线靶场", type: "靶场", stage: "pentest", nodeId: "capstone", level: "基础", pricing: "freemium", lang: "中文", duration: "按题", summary: "中文在线实验平台，部分实验需要登录或购买。", url: "https://www.heetian.com/", searchEntry: false },
  { id: "d-yijing", title: "蚁景网安实验室", platform: "在线靶场", type: "靶场", stage: "web-vuln", nodeId: "sql-injection", level: "基础", pricing: "freemium", lang: "中文", duration: "按题", summary: "中文安全实验平台，按页面提示确认免费或收费实验。", url: "https://www.yijinglab.com/", searchEntry: false },
];

const RESOURCES = [...VIDEO_RESOURCES, ...DISCOVERY_RESOURCES];

// 靶场均为官方项目、公开训练平台或开源项目；只在个人隔离环境或平台授权范围内使用。
const LABS = [
  { id: "lab-pikachu", title: "Pikachu", category: "中文 Web 漏洞", stage: "web-vuln", nodeId: "sql-injection", level: "基础", pricing: "free", lang: "中文", deployment: "本地 · Docker / PHP", access: "开源项目", url: "https://github.com/zhuifengshaonianhanlu/pikachu", summary: "中文漏洞测试平台，适合 SQL 注入、XSS、CSRF、上传、SSRF、反序列化与越权入门。", safety: "仅部署在本地虚拟机或 Docker 网络中，不对公网开放。" },
  { id: "lab-portswigger", title: "PortSwigger Web Security Academy", category: "Web 漏洞专项", stage: "web-vuln", nodeId: "burp-workflow", level: "基础", pricing: "free", lang: "英文", deployment: "在线浏览器", access: "需注册", url: "https://portswigger.net/web-security", summary: "SQLi、XSS、CSRF、SSRF、访问控制等互动实验，和 Burp 学习最配套。", safety: "实验环境由平台授权提供；不要将练习方法用于未授权站点。" },
  { id: "lab-juice-shop", title: "OWASP Juice Shop", category: "现代 Web 综合", stage: "web-vuln", nodeId: "capstone", level: "基础", pricing: "free", lang: "英文", deployment: "在线 / Docker", access: "开源项目", url: "https://owasp.org/www-project-juice-shop/", summary: "现代购物网站靶场，覆盖 OWASP Top 10，适合作为 Web 综合项目。", safety: "优先使用官方演示或本地 Docker；本地实例保持隔离。" },
  { id: "lab-dvwa", title: "DVWA", category: "Web 漏洞入门", stage: "web-vuln", nodeId: "sql-injection", level: "基础", pricing: "free", lang: "英文", deployment: "本地 · Docker / PHP", access: "开源项目", url: "https://github.com/digininja/DVWA", summary: "经典 PHP/MariaDB 漏洞应用，适合 SQL 注入、XSS、命令执行与文件上传的基础练习。", safety: "项目故意包含漏洞，绝不能部署到公网服务器。" },
  { id: "lab-vulhub", title: "Vulhub", category: "CVE 与中间件", stage: "pentest", nodeId: "cms-framework", level: "进阶", pricing: "free", lang: "中文", deployment: "本地 · Docker Compose", access: "开源项目", url: "https://github.com/vulhub/vulhub", summary: "大量可复现的 Docker 漏洞环境，适合中间件、框架和公开 CVE 的本地验证。", safety: "启动前确认 Docker 网络隔离；实验结束执行清理并关闭容器。" },
  { id: "lab-webgoat", title: "OWASP WebGoat", category: "Java Web 安全", stage: "web-vuln", nodeId: "web-basics", level: "基础", pricing: "free", lang: "英文", deployment: "本地 · Java / Docker", access: "开源项目", url: "https://owasp.org/www-project-webgoat/", summary: "以课程形式讲解漏洞原理、练习与修复，适合 Java、Tomcat 方向。", safety: "仅在本地实验系统运行，并保留快照以便回滚。" },
  { id: "lab-tryhackme", title: "TryHackMe", category: "引导式综合学习", stage: "foundation", nodeId: "security-intro", level: "入门", pricing: "freemium", lang: "英文", deployment: "在线浏览器", access: "需注册", url: "https://tryhackme.com/beginner-path", summary: "从网络、Linux、Web 到防守的引导式房间，适合零基础建立练习节奏。", safety: "只使用平台房间和个人 VPN/AttackBox，不扫描外部目标。" },
  { id: "lab-htb", title: "Hack The Box Academy", category: "进阶攻防路径", stage: "pentest", nodeId: "pentest-method", level: "进阶", pricing: "freemium", lang: "英文", deployment: "在线浏览器 / VPN", access: "需注册", url: "https://academy.hackthebox.com/", summary: "模块化学习与真实感靶机，适合掌握基础后的系统提升。", safety: "仅连接 HTB 明确分配的靶机与 VPN 网络。" },
  { id: "lab-metasploitable", title: "Metasploitable 3", category: "网络与主机渗透", stage: "pentest", nodeId: "metasploit", level: "进阶", pricing: "free", lang: "英文", deployment: "本地 · 虚拟机", access: "开源项目", url: "https://github.com/rapid7/metasploitable3", summary: "Rapid7 提供的故意脆弱虚拟机，适合 Nmap、服务枚举和 Metasploit 练习。", safety: "使用 Host-only 或 NAT 网络，严禁桥接到真实办公网络。" },
  { id: "lab-vulnhub", title: "VulnHub", category: "完整渗透与提权", stage: "pentest", nodeId: "privilege-escalation", level: "进阶", pricing: "free", lang: "英文", deployment: "本地 · 虚拟机", access: "下载靶机", url: "https://www.vulnhub.com/", summary: "可下载漏洞虚拟机集合，适合从信息收集到提权的完整流程练习。", safety: "导入未知靶机前创建独立网络与快照，不接入局域网。" },
  { id: "lab-cyberdefenders", title: "CyberDefenders", category: "蓝队与应急响应", stage: "defense", nodeId: "incident-response", level: "进阶", pricing: "freemium", lang: "英文", deployment: "在线浏览器", access: "需注册", url: "https://cyberdefenders.org/blue-team-labs/", summary: "聚焦 DFIR、威胁狩猎、恶意软件和日志分析的蓝队实验。", safety: "仅分析平台提供的样本、日志和数据集，遵守平台规则。" },
  { id: "lab-shepherd", title: "OWASP Security Shepherd", category: "Web / 移动安全", stage: "web-vuln", nodeId: "access-control", level: "进阶", pricing: "free", lang: "英文", deployment: "本地 · Docker / VM", access: "开源项目", url: "https://owasp.org/www-project-security-shepherd/", summary: "面向 Web 与移动应用安全的课程和挑战，适合继续扩展手工测试能力。", safety: "按官方文档部署在隔离主机中，不连接互联网暴露端口。" },
];

const PRACTICES = [
  { id: "p-env", title: "搭建隔离实验环境", stage: "foundation", nodeId: "virtual-lab", level: "基础", outcome: "Kali 虚拟机 + 本地靶场 + 可恢复快照", safety: "只使用 NAT/Host-only 网络，不连接陌生目标。" },
  { id: "p-packet", title: "抓包解释一次登录请求", stage: "foundation", nodeId: "network-model", level: "基础", outcome: "标注 DNS、TCP、HTTP、Cookie 与响应状态", safety: "只分析本机或授权实验流量。" },
  { id: "p-burp", title: "使用 Burp 完成请求重放", stage: "pentest", nodeId: "burp-workflow", level: "基础", outcome: "保存一份请求、响应和验证说明", safety: "将 Target scope 限制在本地靶场。" },
  { id: "p-sqli", title: "完成 SQL 注入靶场题", stage: "web-vuln", nodeId: "sql-injection", level: "进阶", outcome: "写出漏洞原因、影响与参数化修复方案", safety: "仅使用 DVWA/Juice Shop 等授权环境。" },
  { id: "p-report", title: "完成一页漏洞报告", stage: "pentest", nodeId: "reporting", level: "基础", outcome: "范围、复现、证据、风险和修复齐全", safety: "不包含真实目标敏感信息。" },
  { id: "p-incident", title: "从日志还原事件时间线", stage: "defense", nodeId: "incident-response", level: "进阶", outcome: "输出发现、遏制、恢复和复盘清单", safety: "使用脱敏教学日志。" },
];

window.SECUREPATH_DATA = { STAGES, NODES, TOOLS, RESOURCES, LABS, PRACTICES, SERIES_CATALOG, VIDEO_RESOURCES, DISCOVERY_RESOURCES };
