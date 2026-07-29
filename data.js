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

const RESOURCES = [
  { id: "r-python", title: "Python 中文教程", platform: "官方文档", type: "文档", stage: "foundation", nodeId: "python-basics", level: "入门", pricing: "free", lang: "中文", duration: "按需", summary: "适合从语法、文件、异常和标准库开始建立脚本能力。", url: "https://docs.python.org/zh-cn/3/tutorial/", recommended: true },
  { id: "r-linux", title: "Linux 教程与命令参考", platform: "菜鸟教程", type: "图文", stage: "foundation", nodeId: "linux-basics", level: "入门", pricing: "free", lang: "中文", duration: "按需", summary: "覆盖目录、权限、用户、服务、Shell 与常用命令。", url: "https://www.runoob.com/linux/linux-tutorial.html", recommended: true },
  { id: "r-websec-notes", title: "Web 安全学习笔记", platform: "Read the Docs", type: "文档", stage: "web-vuln", nodeId: "web-request-flow", level: "基础", pricing: "free", lang: "中文", duration: "按需", summary: "按漏洞类型整理 Web 安全基础与进阶笔记。", url: "https://websec.readthedocs.io/zh/latest/", recommended: true },
  { id: "r-heetian", title: "合天网安实验室", platform: "在线靶场", type: "靶场", stage: "pentest", nodeId: "capstone", level: "基础", pricing: "freemium", lang: "中文", duration: "按题", summary: "中文在线实验和靶场平台，适合把模块知识转成动手任务。", url: "https://www.heetian.com/", recommended: true },
  { id: "r-yijing", title: "蚁景网安实验室", platform: "在线靶场", type: "靶场", stage: "web-vuln", nodeId: "sql-injection", level: "基础", pricing: "freemium", lang: "中文", duration: "按题", summary: "提供文件上传、Fastjson、无线安全等安全实验。", url: "https://www.yijinglab.com/", recommended: true },
  { id: "r-portswigger", title: "Web Security Academy", platform: "PortSwigger", type: "靶场", stage: "web-vuln", nodeId: "burp-workflow", level: "基础", pricing: "free", lang: "英文", duration: "按题", summary: "免费互动 Web 安全课程与实验，适合 SQLi、XSS、认证等主题。", url: "https://portswigger.net/web-security", recommended: true },
  { id: "r-bilibili-network", title: "网络安全基础与 Kali 入门合集", platform: "哔哩哔哩", type: "视频", stage: "foundation", nodeId: "virtual-lab", level: "入门", pricing: "free", lang: "中文", duration: "按合集", summary: "从环境搭建、Linux、网络到常用工具的中文视频入口。", url: "https://search.bilibili.com/all?keyword=%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8%20Kali%20%E5%85%A5%E9%97%A8", recommended: true },
  { id: "r-bilibili-web", title: "Web 漏洞与渗透测试视频检索", platform: "哔哩哔哩", type: "视频", stage: "web-vuln", nodeId: "sql-injection", level: "基础", pricing: "free", lang: "中文", duration: "按合集", summary: "按 SQL 注入、XSS、文件上传等关键词进入站内搜索。", url: "https://search.bilibili.com/all?keyword=Web%E6%B8%97%E9%80%8F%20SQL%E6%B3%A8%E5%85%A5%20XSS", recommended: false },
  { id: "r-douyin", title: "抖音安全学习关键词入口", platform: "抖音", type: "视频", stage: "foundation", nodeId: "security-intro", level: "入门", pricing: "free", lang: "中文", duration: "按需", summary: "通过网络安全、Linux、Kali、Web 安全等关键词检索短视频。", url: "https://www.douyin.com/search/%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8", recommended: false },
  { id: "r-xhs", title: "小红书学习笔记关键词入口", platform: "小红书", type: "图文", stage: "foundation", nodeId: "linux-basics", level: "入门", pricing: "free", lang: "中文", duration: "按需", summary: "通过 Linux、Python、网络安全、面试整理等关键词检索笔记。", url: "https://www.xiaohongshu.com/search_result?keyword=%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8", recommended: false },
  { id: "r-aliyun-security", title: "阿里云安全中心实践教程", platform: "阿里云", type: "文档", stage: "defense", nodeId: "security-devices", level: "进阶", pricing: "free", lang: "中文", duration: "按需", summary: "了解云上资产、配置核查、主动防御与安全运营闭环。", url: "https://help.aliyun.com/zh/security-center/use-cases/", recommended: false },
  { id: "r-cisa-report", title: "漏洞报告与复现记录模板", platform: "个人资源", type: "文档", stage: "pentest", nodeId: "reporting", level: "基础", pricing: "free", lang: "中文", duration: "30 分钟", summary: "用于记录范围、复现步骤、影响、证据和修复建议。", url: "https://github.com/topics/security-report-template", recommended: true },
  { id: "r-vuln-search", title: "网络安全视频与图文检索入口", platform: "多平台", type: "课程", stage: "pentest", nodeId: "capstone", level: "基础", pricing: "free", lang: "中文", duration: "按需", summary: "从多个中文平台按知识点检索课程、笔记与项目复盘。", url: "https://www.zhihu.com/search?type=content&q=%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95", recommended: false },
];

// 为路线图中尚未配置直链的节点补充中文平台检索入口，确保每个节点都有可开始的资源。
const searchPlatforms = [
  { name: "哔哩哔哩", type: "视频", base: "https://search.bilibili.com/all?keyword=" },
  { name: "抖音", type: "视频", base: "https://www.douyin.com/search/" },
  { name: "小红书", type: "图文", base: "https://www.xiaohongshu.com/search_result?keyword=" },
  { name: "知乎", type: "图文", base: "https://www.zhihu.com/search?type=content&q=" },
  { name: "CSDN", type: "图文", base: "https://so.csdn.net/so/search?q=" },
];
const configuredNodeIds = new Set(RESOURCES.map((resource) => resource.nodeId));
NODES.filter((node) => !configuredNodeIds.has(node.id)).forEach((node, index) => {
  const platform = searchPlatforms[index % searchPlatforms.length];
  const keyword = `${node.title} 网络安全`;
  RESOURCES.push({
    id: `search-${node.id}`,
    title: `${node.title} · 中文学习入口`,
    platform: platform.name,
    type: platform.type,
    stage: node.stage,
    nodeId: node.id,
    level: node.level,
    pricing: "free",
    lang: "中文",
    duration: "按需",
    summary: `通过${platform.name}检索“${keyword}”，先完成知识目标，再回到节点练习。`,
    url: `${platform.base}${encodeURIComponent(keyword)}`,
    recommended: node.track === "core",
    searchEntry: true,
  });
});

const PRACTICES = [
  { id: "p-env", title: "搭建隔离实验环境", stage: "foundation", nodeId: "virtual-lab", level: "基础", outcome: "Kali 虚拟机 + 本地靶场 + 可恢复快照", safety: "只使用 NAT/Host-only 网络，不连接陌生目标。" },
  { id: "p-packet", title: "抓包解释一次登录请求", stage: "foundation", nodeId: "network-model", level: "基础", outcome: "标注 DNS、TCP、HTTP、Cookie 与响应状态", safety: "只分析本机或授权实验流量。" },
  { id: "p-burp", title: "使用 Burp 完成请求重放", stage: "pentest", nodeId: "burp-workflow", level: "基础", outcome: "保存一份请求、响应和验证说明", safety: "将 Target scope 限制在本地靶场。" },
  { id: "p-sqli", title: "完成 SQL 注入靶场题", stage: "web-vuln", nodeId: "sql-injection", level: "进阶", outcome: "写出漏洞原因、影响与参数化修复方案", safety: "仅使用 DVWA/Juice Shop 等授权环境。" },
  { id: "p-report", title: "完成一页漏洞报告", stage: "pentest", nodeId: "reporting", level: "基础", outcome: "范围、复现、证据、风险和修复齐全", safety: "不包含真实目标敏感信息。" },
  { id: "p-incident", title: "从日志还原事件时间线", stage: "defense", nodeId: "incident-response", level: "进阶", outcome: "输出发现、遏制、恢复和复盘清单", safety: "使用脱敏教学日志。" },
];

window.SECUREPATH_DATA = { STAGES, NODES, TOOLS, RESOURCES, PRACTICES };
