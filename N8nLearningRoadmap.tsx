"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock3,
  Code2,
  ExternalLink,
  GraduationCap,
  Layers3,
  Lightbulb,
  Link2,
  LockKeyhole,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Target,
  Webhook,
  Workflow,
  Zap,
  AlertTriangle,
  BrainCircuit,
  Puzzle,
  PanelTop,
  ChevronRight,
  ClipboardCheck,
  Info,
  Globe,
} from "lucide-react";

type TopicLink = {
  label: string;
  href: string;
  kind: "video" | "docs" | "tutorial" | "guide" | "quick-ref" | "environment";
};

type Topic = {
  id: string;
  title: string;
  kind: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  whyItMatters: string;
  notes: string[];
  tips: string[];
  links: TopicLink[];
  thumbnail?: string;
  featured?: boolean;
};

type Phase = {
  id: string;
  title: string;
  week: string;
  icon: typeof Rocket;
  accent: string;
  background: string;
  summary: string;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  whyThisMatters: string;
  tips: string[];
  topics: Topic[];
};

type ProgressState = Record<string, boolean>;

type Locale = "en" | "ar";

type LocalizedText = Record<Locale, string>;

type LocalizedTopicMeta = {
  title: string;
  kind: string;
  estimatedTime: string;
  whyItMatters: string;
};

type LocalizedPhaseMeta = {
  title: string;
  week: string;
  summary: string;
  estimatedTime: string;
  whyThisMatters: string;
  tips: string[];
};

type SidebarCard = {
  title: string;
  description: string;
  href: string;
  accent: string;
};

type QuickReferenceSection = {
  title: string;
  items: string[];
};

type McpFundamentalsSection = {
  intro: {
    title: string;
    simple: string;
    problem: string;
    analogy: string;
  };
  whyNow: {
    title: string;
    text: string;
  };
  video: {
    title: string;
    link: string;
    name: string;
    duration: string;
    description: string;
  };
  keyPoints: {
    title: string;
    points: Array<{
      title: string;
      text: string;
    }>;
  };
};

type RoadmapProps = {
  learnerName?: string;
  n8nUrl?: string;
  mcpUrl?: string;
  className?: string;
};

type HeroEarthGlobeProps = {
  n8nUrl: string;
  isArabic: boolean;
  className?: string;
};

const STORAGE_KEY = "n8n-roadmap-progress-v1";
const LOCALE_KEY = "n8n-roadmap-locale-v1";

const copy = {
  en: {
    premiumBadge: "Premium learning roadmap",
    heroTitlePrefix: "n8n roadmap for",
    heroSubtitle:
      "A structured, interactive path from first principles to production-ready automation. Built for a technical learner who wants to move fast, understand deeply, and ship real workflows.",
    selfHostedFriendly: "Self-hosted friendly",
    mcpReady: "MCP-ready",
    productionFocused: "Production-focused",
    overallProgress: "Overall progress",
    progressStored: "Completed topics are stored locally in this browser.",
    currentFocus: "Current focus",
    nextStep: "Next step",
    phases: "Phases",
    environment: "Environment",
    openEnvironment: "Open environment",
    openN8n: "Open n8n",
    openMcp: "Open MCP",
    markComplete: "Done ✔️",
    completed: "Done ✔️",
    readyToReview: "Nice, wrapped",
    tapToExpand: "Open",
    whyThisMatters: "Why this matters",
    notes: "Notes",
    tips: "Tips",
    resources: "Resources",
    phaseTips: "Quick tips",
    learningGuidance: "Learning guidance",
    quickReference: "Quick reference",
    resourcesSidebar: "Resources sidebar",
    openResource: "Open resource",
    progressOverview: "Progress overview",
    language: "Language",
    english: "English",
    arabic: "العربية",
    completion: "Completion",
    featured: "Featured",
    environmentInstance: "n8n instance",
    environmentServer: "MCP server",
    guidanceParagraphs: [
      "Use this roadmap in order. n8n rewards pattern recognition, and the fastest way to build that is to ship tiny examples often.",
      "If you get stuck, inspect the execution data and payload shape before searching for a bigger solution. Most issues are data-shape issues.",
    ],
    resourcesCards: [
      {
        title: "Official docs",
        description: "The cleanest place to check node behavior, credentials, expressions, and runtime details.",
        href: "https://docs.n8n.io/",
        accent: "from-[#FF6D5A] to-[#FF9B8A]",
      },
      {
        title: "Community forum",
        description: "Good for patterns, troubleshooting, and real workflows people actually use.",
        href: "https://community.n8n.io/",
        accent: "from-[#7B61FF] to-[#A594FF]",
      },
      {
        title: "Template gallery",
        description: "Helpful when you want to see how experienced builders structure their workflows.",
        href: "https://n8n.io/workflows",
        accent: "from-[#00D4AA] to-[#7CF0DA]",
      },
      {
        title: "MCP environment",
        description: "Your target integration endpoint for the advanced protocol work in this roadmap.",
        href: "https://mcp.muhjah.com",
        accent: "from-[#F59E0B] to-[#FCD34D]",
      },
    ],
    quickReferenceSections: [
      {
        title: "Common patterns",
        items: [
          "Trigger -> Validate -> Transform -> Route -> Notify",
          "Webhook -> Auth -> Enrich -> Persist",
          "Schedule -> Fetch -> Compare -> Act",
          "Error workflow -> Alert -> Retry -> Recovery",
        ],
      },
      {
        title: "Workflow habits",
        items: [
          "Name nodes by intent, not by type alone",
          "Inspect execution data after every non-trivial change",
          "Keep credentials separate from logic",
          "Use Set nodes to make payload shape explicit",
        ],
      },
      {
        title: "Keyboard shortcuts",
        items: [
          "Cmd/Ctrl + S: save the workflow",
          "Cmd/Ctrl + Enter: check your instance shortcut settings for execution",
          "Use the node search and command palette for fast navigation",
          "Shortcut mappings can vary by version and custom configuration",
        ],
      },
    ],
    mcpFundamentals: {
      intro: {
        title: "What is MCP?",
        simple:
          "MCP is like a USB-C port for AI. It is a standard way to connect AI tools (like Claude or ChatGPT) to external apps and data.",
        problem:
          "Without MCP, every time you want to connect AI to a new tool, you need custom code. MCP fixes this with one universal connection.",
        analogy:
          "Think of it like this: instead of having different chargers for every device, USB-C works for everything. That is what MCP does for AI.",
      },
      whyNow: {
        title: "Why Learn This Now?",
        text: "You have an MCP server at mcp.muhjah.com ready to use. Understanding MCP first makes the setup make sense.",
      },
      video: {
        title: "Watch This First",
        link: "https://www.youtube.com/watch?v=dyt-bhxrrbk",
        name: "MCP in 10 Minutes",
        duration: "10 min",
        description: "Quick explanation of what MCP is and why it exists",
      },
      keyPoints: {
        title: "Key Things to Understand",
        points: [
          {
            title: "Universal Standard",
            text: "One way to connect AI to tools, databases, and APIs instead of custom code each time.",
          },
          {
            title: "Three Parts",
            text: "Host (like n8n), Client (connector), and Server (the tool or data source).",
          },
          {
            title: "What It Does",
            text: "Lets AI access real-time data, run actions, and use tools instead of only answering from training.",
          },
          {
            title: "Why It Matters for n8n",
            text: "Makes your workflows smarter. AI can read files, query databases, and send emails through one protocol.",
          },
        ],
      },
    },
    topicLinkLabels: {
      overview: ["Watch overview"],
      "deep-dive": ["Watch deep dive"],
      "quick-start": ["Open environment"],
      oauth: ["Watch OAuth video", "Google credential docs"],
      webhooks: ["Watch webhook video", "Quick reference"],
      expressions: ["Interactive tutorial", "Comprehensive video", "Cheat sheet"],
      mcp: ["Getting started guide", "Live demo discussion", "Open MCP server"],
      "error-handling": ["Watch error handling video", "Official video"],
      "project-ideas": ["Open n8n templates", "Browse community workflows"],
    },
    difficulty: {
      Beginner: "Easy",
      Intermediate: "Intermediate",
      Advanced: "Advanced",
    },
    status: {
      "Not Started": "Let's start",
      "In Progress": "In Progress",
      Completed: "Completed",
    },
    phasesMeta: {
      foundation: {
        title: "Foundation",
        week: "Week 1",
        summary:
          "Build your mental model of n8n, understand the editor, and launch your first workflows with confidence.",
        estimatedTime: "3-5 hours",
        whyThisMatters:
          "A solid foundation prevents guesswork later. Once you understand the editor, node flow, and execution model, every other topic becomes much easier to reason about.",
        tips: [
          "Watch with the editor open on your self-hosted instance so every concept has a place to land.",
          "Rebuild one tiny workflow from memory after each video; repetition beats passive watching.",
          "Write down the names of the nodes you recognize immediately: Manual Trigger, Set, IF, HTTP Request, and Webhook.",
        ],
      },
      core: {
        title: "Core Skills",
        week: "Week 2-3",
        summary:
          "Learn the technical primitives that power almost every real workflow: credentials, webhooks, and expressions.",
        estimatedTime: "6-10 hours",
        whyThisMatters:
          "Most production issues in n8n come from data shape, authentication, and trigger handling. This phase gives you the tools to solve those problems cleanly.",
        tips: [
          "Treat OAuth and credentials as first-class design work, not setup overhead.",
          "Every time you wire a webhook, inspect both the request and response paths before you move on.",
          "Expressions are the difference between static demos and durable automation; use them early and often.",
        ],
      },
      advanced: {
        title: "Advanced Topics",
        week: "Week 4",
        summary:
          "Extend n8n into AI tooling and production-grade reliability with MCP integration and structured error handling.",
        estimatedTime: "4-6 hours",
        whyThisMatters:
          "This phase turns a capable builder into someone who can design workflows for production services, observability, and external protocol integrations.",
        tips: [
          "Use a staging workflow for the MCP integration before you connect it to anything sensitive.",
          "Trace error paths on purpose; production-ready automation is defined by how it fails.",
          "Capture retry, alert, and fallback behavior in the workflow design itself.",
        ],
      },
      project: {
        title: "Hands-On Project",
        week: "Capstone",
        summary:
          "Ship one real workflow that blends triggers, credentials, expressions, and error handling into a useful production-style automation.",
        estimatedTime: "4-8 hours",
        whyThisMatters:
          "Learning sticks when you build something that solves a real need. A project forces you to connect the dots and reveals the gaps you still need to close.",
        tips: [
          "Choose a workflow that touches at least one external API and one branch or validation step.",
          "Keep the first version small. Production-ready does not mean overbuilt.",
          "Document your assumptions, failure paths, and what you would monitor in production.",
        ],
      },
    } satisfies Record<string, LocalizedPhaseMeta>,
    topicsMeta: {
      overview: {
        title: "n8n Overview",
        kind: "Video",
        estimatedTime: "20 min",
        whyItMatters: "Shows how n8n thinks about triggers, actions, and data moving between nodes.",
      },
      "deep-dive": {
        title: "n8n Deep Dive",
        kind: "Video",
        estimatedTime: "35 min",
        whyItMatters: "Gives you the implementation details that help you troubleshoot and design workflows without trial-and-error.",
      },
      "quick-start": {
        title: "Quick Start on Self-Hosted n8n",
        kind: "Hands-on",
        estimatedTime: "30 min",
        whyItMatters: "You learn the fastest by touching the actual system you will use in production.",
      },
      oauth: {
        title: "OAuth & Credentials",
        kind: "Critical Integration Skill",
        estimatedTime: "1.5-2 hours",
        whyItMatters: "Every real integration depends on secure, repeatable auth. If this is weak, the rest of the workflow is fragile.",
      },
      webhooks: {
        title: "Webhooks: Triggers & Responses",
        kind: "Trigger Design",
        estimatedTime: "1.5 hours",
        whyItMatters: "Webhooks are the bridge between external systems and your workflow; this is how n8n becomes event-driven.",
      },
      expressions: {
        title: "Expressions & Variables",
        kind: "Data Shaping",
        estimatedTime: "2-3 hours",
        whyItMatters: "Expressions let you transform and route data without adding unnecessary code nodes, which keeps workflows readable and maintainable.",
      },
      mcp: {
        title: "MCP Integration for mcp.muhjah.com",
        kind: "Protocol Integration",
        estimatedTime: "1.5-2 hours",
        whyItMatters: "Lets n8n participate in a modern AI toolchain through a structured protocol instead of one-off glue logic.",
      },
      "error-handling": {
        title: "Error Handling for Production",
        kind: "Reliability",
        estimatedTime: "1.5-2 hours",
        whyItMatters: "Real systems fail. Your workflows need retries, branches, alerts, and recoverable states to be trusted in production.",
      },
      "project-ideas": {
        title: "Suggested Project Ideas",
        kind: "Build",
        estimatedTime: "Choose one",
        whyItMatters: "A concrete use case gives you enough constraints to practice real workflow design.",
      },
    } satisfies Record<string, LocalizedTopicMeta>,
  },
  ar: {
    premiumBadge: "خطة تعلم مميزة",
    heroTitlePrefix: "خطة n8n لـ",
    heroSubtitle:
      "مسار منظم وتفاعلي من الأساسيات إلى الأتمتة الجاهزة للإنتاج. مصمم لمتعلم تقني يريد التعلم بسرعة، والفهم بعمق، وبناء تدفقات عمل حقيقية.",
    selfHostedFriendly: "متوافق مع الاستضافة الذاتية",
    mcpReady: "جاهز لـ MCP",
    productionFocused: "موجّه للإنتاج",
    overallProgress: "التقدم العام",
    progressStored: "يُحفظ التقدم محليًا في هذا المتصفح.",
    currentFocus: "التركيز الحالي",
    nextStep: "الخطوة التالية",
    phases: "المراحل",
    environment: "البيئة",
    openEnvironment: "فتح البيئة",
    openN8n: "فتح n8n",
    openMcp: "فتح MCP",
    markComplete: "خلصتها ✔️",
    completed: "خلصتها ✔️",
    readyToReview: "تمام، خلصت",
    tapToExpand: "افتح",
    whyThisMatters: "لماذا هذا مهم",
    notes: "ملاحظات",
    tips: "نصائح",
    resources: "الموارد",
    phaseTips: "ملاحظات سريعة",
    learningGuidance: "إرشادات التعلم",
    quickReference: "مرجع سريع",
    resourcesSidebar: "شريط الموارد",
    openResource: "فتح المورد",
    progressOverview: "ملخص التقدم",
    language: "اللغة",
    english: "English",
    arabic: "العربية",
    completion: "الإكمال",
    featured: "مميز",
    environmentInstance: "نسخة n8n",
    environmentServer: "خادم MCP",
    guidanceParagraphs: [
      "امشِ على هالخطة بالترتيب. n8n بعلّمك لما تكرر الأنماط، وأسرع طريقة لهالشي إنك تبني أمثلة صغيرة كثير.",
      "إذا علّقت، افحص execution data وشكل الـ payload قبل ما تدور على حل أكبر. غالبًا المشكلة بتكون بشكل البيانات نفسه.",
    ],
    resourcesCards: [
      {
        title: "التوثيق الرسمي",
        description: "أوضح مكان تفحص فيه سلوك الـ node والاعتمادات والتعبيرات وتفاصيل التشغيل.",
        href: "https://docs.n8n.io/",
        accent: "from-[#FF6D5A] to-[#FF9B8A]",
      },
      {
        title: "منتدى المجتمع",
        description: "مفيد للأنماط، وحل المشاكل، وأفكار workflows حقيقية الناس شغالة عليها.",
        href: "https://community.n8n.io/",
        accent: "from-[#7B61FF] to-[#A594FF]",
      },
      {
        title: "مكتبة القوالب",
        description: "بتفيدك لما بدك تشوف كيف البنّائين الخبراء بيرتبوا workflows تبعتهم.",
        href: "https://n8n.io/workflows",
        accent: "from-[#00D4AA] to-[#7CF0DA]",
      },
      {
        title: "بيئة MCP",
        description: "هاي نقطة الربط اللي رح تستخدمها بالشغل المتقدم على البروتوكول داخل هالخطة.",
        href: "https://mcp.muhjah.com",
        accent: "from-[#F59E0B] to-[#FCD34D]",
      },
    ],
    quickReferenceSections: [
      {
        title: "أنماط شائعة",
        items: [
          "Trigger -> Validate -> Transform -> Route -> Notify",
          "Webhook -> Auth -> Enrich -> Persist",
          "Schedule -> Fetch -> Compare -> Act",
          "Error workflow -> Alert -> Retry -> Recovery",
        ],
      },
      {
        title: "عادات مفيدة",
        items: [
          "سمّي الـ nodes حسب الهدف، مش بس حسب النوع",
          "افحص execution data بعد أي تغيير مش بسيط",
          "خلي الـ credentials بعيد عن المنطق",
          "استخدم Set nodes عشان توضح شكل الـ payload",
        ],
      },
      {
        title: "اختصارات الكيبورد",
        items: [
          "Cmd/Ctrl + S: حفظ الـ workflow",
          "Cmd/Ctrl + Enter: افحص shortcuts الخاصة بالنسخة عندك للتنفيذ",
          "استخدم node search و command palette للتنقل بسرعة",
          "الاختصارات ممكن تختلف حسب النسخة والإعدادات",
        ],
      },
    ],
    mcpFundamentals: {
      intro: {
        title: "ما هو MCP؟",
        simple: "MCP مثل منفذ USB-C للذكاء الاصطناعي. معيار موحد لربط أدوات الذكاء الاصطناعي مثل Claude و ChatGPT بالتطبيقات والبيانات الخارجية.",
        problem: "بدون MCP، كل مرة بدك تربط الذكاء الاصطناعي بأداة جديدة تحتاج كود مخصص. MCP يحل هذا باتصال موحد.",
        analogy: "تخيلها هكذا: بدل شاحن مختلف لكل جهاز، USB-C يشتغل مع الكل. هذا بالضبط دور MCP للذكاء الاصطناعي.",
      },
      whyNow: {
        title: "ليش نتعلمه الآن؟",
        text: "عندك خادم MCP جاهز على mcp.muhjah.com. لما تفهم MCP أولًا، خطوات الإعداد العملي تصير أوضح بكثير.",
      },
      video: {
        title: "شاهد هذا أولًا",
        link: "https://www.youtube.com/watch?v=dyt-bhxrrbk",
        name: "MCP in 10 Minutes",
        duration: "10 دقائق",
        description: "شرح سريع: ما هو MCP ولماذا تم إنشاؤه",
      },
      keyPoints: {
        title: "أهم النقاط التي لازم تفهمها",
        points: [
          {
            title: "معيار موحد",
            text: "طريقة واحدة لربط الذكاء الاصطناعي بالأدوات وقواعد البيانات وواجهات API بدل كود مخصص كل مرة.",
          },
          {
            title: "ثلاثة أجزاء",
            text: "Host مثل n8n، وClient كموصل، وServer كمصدر أداة أو بيانات.",
          },
          {
            title: "ماذا يفعل",
            text: "يخلي الذكاء الاصطناعي يصل لبيانات لحظية وينفذ إجراءات ويستخدم أدوات، مش بس يجاوب من بيانات التدريب.",
          },
          {
            title: "ليش مهم لـ n8n",
            text: "يجعل الـ workflows أذكى: قراءة ملفات، استعلام قواعد بيانات، وإرسال إيميلات عبر بروتوكول واحد.",
          },
        ],
      },
    },
    topicLinkLabels: {
      overview: ["شاهد النظرة العامة"],
      "deep-dive": ["شاهد الغوص الأعمق"],
      "quick-start": ["افتح البيئة"],
      oauth: ["شاهد فيديو OAuth", "توثيق Google credentials"],
      webhooks: ["شاهد فيديو الـ webhook", "مرجع سريع"],
      expressions: ["شرح تفاعلي", "فيديو شامل", "ورقة الغش"],
      mcp: ["دليل البداية", "شرح وديمو مباشر", "افتح خادم MCP"],
      "error-handling": ["شاهد فيديو الأخطاء", "الفيديو الرسمي"],
      "project-ideas": ["افتح قوالب n8n", "تصفح workflows المجتمع"],
    },
    difficulty: {
      Beginner: "سهل",
      Intermediate: "متوسط",
      Advanced: "متقدم",
    },
    status: {
      "Not Started": "خلينا نبدأ",
      "In Progress": "قيد التنفيذ",
      Completed: "مكتمل",
    },
    phasesMeta: {
      foundation: {
        title: "الأساسيات",
        week: "الأسبوع 1",
        summary:
          "ابنِ نموذجك الذهني لـ n8n، وافهم المحرر، وابدأ أولى تدفقات العمل بثقة.",
        estimatedTime: "3-5 ساعات",
        whyThisMatters:
          "الأساس القوي يمنع التخمين لاحقًا. بمجرد فهم المحرر وتدفق العقد ونموذج التنفيذ، يصبح من الأسهل جدًا فهم باقي المواضيع.",
        tips: [
          "شاهد الفيديو بينما المحرر مفتوح على بيئة n8n المستضافة ذاتيًا حتى تربط كل فكرة بمكانها مباشرة.",
          "أعد بناء تدفق صغير من الذاكرة بعد كل فيديو؛ التكرار أفضل من المشاهدة السلبية.",
          "اكتب أسماء العقد التي تعرفها فورًا: Manual Trigger و Set و IF و HTTP Request و Webhook.",
        ],
      },
      core: {
        title: "المهارات الأساسية",
        week: "الأسبوع 2-3",
        summary:
          "تعلّم اللبنات التقنية التي تشغّل معظم تدفقات العمل: الاعتمادات، وwebhooks، والتعبيرات.",
        estimatedTime: "6-10 ساعات",
        whyThisMatters:
          "معظم مشاكل الإنتاج في n8n تأتي من شكل البيانات، والمصادقة، والتعامل مع المشغلات. هذه المرحلة تمنحك الأدوات لحل هذه المشاكل بوضوح.",
        tips: [
          "تعامل مع OAuth والاعتمادات كجزء أساسي من التصميم، لا كمجرد إعداد إضافي.",
          "في كل مرة توصل webhook، افحص مسار الطلب والرد قبل المتابعة.",
          "التعبيرات هي الفرق بين العروض الثابتة والأتمتة المتينة؛ استخدمها مبكرًا وباستمرار.",
        ],
      },
      advanced: {
        title: "المواضيع المتقدمة",
        week: "الأسبوع 4",
        summary:
          "وسّع n8n إلى أدوات الذكاء الاصطناعي والاعتمادية الإنتاجية عبر تكامل MCP ومعالجة أخطاء منظمة.",
        estimatedTime: "4-6 ساعات",
        whyThisMatters:
          "هذه المرحلة تنقل الشخص من مجرد منشئ إلى شخص قادر على تصميم تدفقات إنتاج، ومراقبة، وتكاملات بروتوكولية خارجية.",
        tips: [
          "استخدم بيئة تجريبية لتكامل MCP قبل ربطه بأي شيء حساس.",
          "تتبّع مسارات الخطأ عمدًا؛ الأتمتة الجاهزة للإنتاج تُقاس بكيفية فشلها.",
          "سجّل منطق إعادة المحاولة والتنبيه والرجوع في تصميم التدفق نفسه.",
        ],
      },
      project: {
        title: "المشروع العملي",
        week: "المرحلة الختامية",
        summary:
          "ابنِ تدفق عمل حقيقي يدمج المشغلات والاعتمادات والتعبيرات ومعالجة الأخطاء في أتمتة مفيدة على نمط الإنتاج.",
        estimatedTime: "4-8 ساعات",
        whyThisMatters:
          "التعلم يثبت عندما تبني شيئًا يحل حاجة فعلية. المشروع يجبرك على ربط الأفكار ويكشف الثغرات التي ما زلت تحتاج إغلاقها.",
        tips: [
          "اختر تدفقًا يلامس على الأقل API خارجيًا وفرعًا أو خطوة تحقق واحدة.",
          "ابدأ بإصدار صغير. الجاهزية للإنتاج لا تعني التعقيد الزائد.",
          "وثّق افتراضاتك، ومسارات الفشل، وما الذي ستراقبه في الإنتاج.",
        ],
      },
    } satisfies Record<string, LocalizedPhaseMeta>,
    topicsMeta: {
      overview: {
        title: "نظرة عامة على n8n",
        kind: "فيديو",
        estimatedTime: "20 دقيقة",
        whyItMatters: "يوضح كيف يفكر n8n في المشغلات والإجراءات وحركة البيانات بين العقد.",
      },
      "deep-dive": {
        title: "غوص أعمق في n8n",
        kind: "فيديو",
        estimatedTime: "35 دقيقة",
        whyItMatters: "يعطيك تفاصيل التنفيذ التي تساعدك على الفهم والتشخيص دون تجريب عشوائي.",
      },
      "quick-start": {
        title: "بداية سريعة على n8n المستضاف ذاتيًا",
        kind: "عملي",
        estimatedTime: "30 دقيقة",
        whyItMatters: "تتعلم أسرع عندما تلمس النظام الفعلي الذي ستستخدمه في الإنتاج.",
      },
      oauth: {
        title: "OAuth والاعتمادات",
        kind: "مهارة تكامل حرجة",
        estimatedTime: "1.5-2 ساعة",
        whyItMatters: "كل تكامل حقيقي يعتمد على مصادقة آمنة وقابلة للتكرار. إذا كانت ضعيفة، يصبح التدفق كله هشًا.",
      },
      webhooks: {
        title: "Webhooks: المشغلات والاستجابات",
        kind: "تصميم مشغلات",
        estimatedTime: "1.5 ساعة",
        whyItMatters: "الـ Webhooks هي الجسر بين الأنظمة الخارجية وتدفقك، وهي ما يجعل n8n قائمًا على الأحداث.",
      },
      expressions: {
        title: "التعبيرات والمتغيرات",
        kind: "تشكيل البيانات",
        estimatedTime: "2-3 ساعات",
        whyItMatters: "تتيح لك التعبيرات تحويل البيانات وتوجيهها دون الحاجة إلى عقد برمجية إضافية، مما يحافظ على وضوح التدفقات.",
      },
      mcp: {
        title: "تكامل MCP مع mcp.muhjah.com",
        kind: "تكامل بروتوكولي",
        estimatedTime: "1.5-2 ساعة",
        whyItMatters: "يُمكّن n8n من المشاركة في سلسلة أدوات ذكاء اصطناعي حديثة عبر بروتوكول منظم بدل الربط المؤقت.",
      },
      "error-handling": {
        title: "التعامل مع الأخطاء في الإنتاج",
        kind: "الاعتمادية",
        estimatedTime: "1.5-2 ساعة",
        whyItMatters: "الأنظمة الحقيقية تفشل. تحتاج تدفقاتك إلى إعادة المحاولة والتفرعات والتنبيهات وحالات الاسترجاع حتى تُعتمد في الإنتاج.",
      },
      "project-ideas": {
        title: "أفكار للمشروع المقترح",
        kind: "بناء",
        estimatedTime: "اختر واحدًا",
        whyItMatters: "حالة استخدام واضحة تعطيك قيودًا كافية لتدريبك على تصميم تدفقات حقيقية.",
      },
    } satisfies Record<string, LocalizedTopicMeta>,
  },
} satisfies Record<Locale, {
  premiumBadge: string;
  heroTitlePrefix: string;
  heroSubtitle: string;
  selfHostedFriendly: string;
  mcpReady: string;
  productionFocused: string;
  overallProgress: string;
  progressStored: string;
  currentFocus: string;
  nextStep: string;
  phases: string;
  environment: string;
  openEnvironment: string;
  openN8n: string;
  openMcp: string;
  markComplete: string;
  completed: string;
  readyToReview: string;
  tapToExpand: string;
  whyThisMatters: string;
  notes: string;
  tips: string;
  resources: string;
  phaseTips: string;
  learningGuidance: string;
  quickReference: string;
  resourcesSidebar: string;
  openResource: string;
  progressOverview: string;
  language: string;
  english: string;
  arabic: string;
  completion: string;
  featured: string;
  environmentInstance: string;
  environmentServer: string;
  guidanceParagraphs: string[];
  resourcesCards: SidebarCard[];
  quickReferenceSections: QuickReferenceSection[];
  mcpFundamentals: McpFundamentalsSection;
  topicLinkLabels: Record<string, string[]>;
  difficulty: Record<Phase["difficulty"], string>;
  status: Record<"Not Started" | "In Progress" | "Completed", string>;
  phasesMeta: Record<string, LocalizedPhaseMeta>;
  topicsMeta: Record<string, LocalizedTopicMeta>;
}>;

const youtubeThumbnail = (url: string) => {
  try {
    const parsed = new URL(url);
    let videoId = "";

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.replace("/", "");
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v") || "";
    }

    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
  } catch {
    return "";
  }
};

const youtubeEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    let videoId = "";

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.replace("/", "");
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v") || "";
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
};

const safeOpen = (href: string) => {
  window.open(href, "_blank", "noopener,noreferrer");
};

const phases: Phase[] = [
  {
    id: "foundation",
    title: "Foundation",
    week: "Week 1",
    icon: Rocket,
    accent: "from-[#FF6D5A] via-[#FF8A75] to-[#FFB199]",
    background: "from-[#FF6D5A]/20 via-[#FF6D5A]/8 to-transparent",
    summary: "Build your mental model of n8n, understand the editor, and launch your first workflows with confidence.",
    estimatedTime: "3-5 hours",
    difficulty: "Beginner",
    whyThisMatters:
      "A solid foundation prevents guesswork later. Once you understand the editor, node flow, and execution model, every other topic becomes much easier to reason about.",
    tips: [
      "Watch with the editor open on your self-hosted instance so every concept has a place to land.",
      "Rebuild one tiny workflow from memory after each video; repetition beats passive watching.",
      "Write down the names of the nodes you recognize immediately: Manual Trigger, Set, IF, HTTP Request, and Webhook.",
    ],
    topics: [
      {
        id: "overview",
        title: "n8n Overview",
        kind: "Video",
        difficulty: "Beginner",
        estimatedTime: "20 min",
        whyItMatters: "Shows how n8n thinks about triggers, actions, and data moving between nodes.",
        notes: ["Start here to understand the workflow canvas, execution history, and node-based orchestration."],
        tips: ["Pause after each major concept and locate the matching UI control in your own instance."],
        links: [{ label: "Watch overview", href: "https://youtu.be/26UcN3T9ztU", kind: "video" }],
        thumbnail: youtubeThumbnail("https://youtu.be/26UcN3T9ztU"),
        featured: true,
      },
      {
        id: "deep-dive",
        title: "n8n Deep Dive",
        kind: "Video",
        difficulty: "Beginner",
        estimatedTime: "35 min",
        whyItMatters: "Gives you the implementation details that help you troubleshoot and design workflows without trial-and-error.",
        notes: ["Focus on how payloads flow through the graph and how node outputs are shaped."],
        tips: ["When something is unclear, duplicate the example in your own workspace and inspect the execution data."],
        links: [{ label: "Watch deep dive", href: "https://youtu.be/L_YWSKYssDg", kind: "video" }],
        thumbnail: youtubeThumbnail("https://youtu.be/L_YWSKYssDg"),
      },
      {
        id: "quick-start",
        title: "Quick Start on Self-Hosted n8n",
        kind: "Hands-on",
        difficulty: "Beginner",
        estimatedTime: "30 min",
        whyItMatters: "You learn the fastest by touching the actual system you will use in production.",
        notes: ["Use n8n.synorco.com as the practice environment for every exercise in this roadmap."],
        tips: ["Create a tiny workflow immediately: Manual Trigger -> Set -> Execute -> inspect output."],
        links: [{ label: "Open environment", href: "https://n8n.synorco.com", kind: "environment" }],
      },
    ],
  },
  {
    id: "core",
    title: "Core Skills",
    week: "Week 2-3",
    icon: Workflow,
    accent: "from-[#7B61FF] via-[#8E78FF] to-[#B3A6FF]",
    background: "from-[#7B61FF]/18 via-[#7B61FF]/8 to-transparent",
    summary: "Learn the technical primitives that power almost every real workflow: credentials, webhooks, and expressions.",
    estimatedTime: "6-10 hours",
    difficulty: "Intermediate",
    whyThisMatters:
      "Most production issues in n8n come from data shape, authentication, and trigger handling. This phase gives you the tools to solve those problems cleanly.",
    tips: [
      "Treat OAuth and credentials as first-class design work, not setup overhead.",
      "Every time you wire a webhook, inspect both the request and response paths before you move on.",
      "Expressions are the difference between static demos and durable automation; use them early and often.",
    ],
    topics: [
      {
        id: "oauth",
        title: "OAuth & Credentials",
        kind: "Critical Integration Skill",
        difficulty: "Intermediate",
        estimatedTime: "1.5-2 hours",
        whyItMatters: "Every real integration depends on secure, repeatable auth. If this is weak, the rest of the workflow is fragile.",
        notes: ["Practice with Google credentials first because the docs are mature and the workflow pattern repeats across other services."],
        tips: ["Document the scopes you request and keep a note of each credential type used in your org."],
        links: [
          { label: "Watch OAuth video", href: "https://www.youtube.com/watch?v=FBGtpWMTppw", kind: "video" },
          { label: "Google credential docs", href: "https://docs.n8n.io/integrations/builtin/credentials/google/", kind: "docs" },
        ],
        thumbnail: youtubeThumbnail("https://www.youtube.com/watch?v=FBGtpWMTppw"),
        featured: true,
      },
      {
        id: "webhooks",
        title: "Webhooks: Triggers & Responses",
        kind: "Trigger Design",
        difficulty: "Intermediate",
        estimatedTime: "1.5 hours",
        whyItMatters: "Webhooks are the bridge between external systems and your workflow; this is how n8n becomes event-driven.",
        notes: ["Understand when to use webhook triggers versus polling or manual triggers."],
        tips: ["Always test response codes and payload shape with a request inspector before going live."],
        links: [
          { label: "Watch webhook video", href: "https://www.youtube.com/watch?v=lK3veuZAg0c", kind: "video" },
          { label: "Quick reference", href: "https://www.youtube.com/watch?v=NcFOck4R6zw", kind: "quick-ref" },
        ],
        thumbnail: youtubeThumbnail("https://www.youtube.com/watch?v=lK3veuZAg0c"),
      },
      {
        id: "expressions",
        title: "Expressions & Variables",
        kind: "Data Shaping",
        difficulty: "Intermediate",
        estimatedTime: "2-3 hours",
        whyItMatters: "Expressions let you transform and route data without adding unnecessary code nodes, which keeps workflows readable and maintainable.",
        notes: ["This is one of the highest-leverage skills in the roadmap. Master it early."],
        tips: ["Practice mapping nested payloads, conditionals, and date formatting until it feels automatic."],
        links: [
          { label: "Interactive tutorial", href: "https://n8n.io/workflows/5271", kind: "tutorial" },
          { label: "Comprehensive video", href: "https://www.youtube.com/watch?v=AURnISajubk", kind: "video" },
          { label: "Cheat sheet", href: "https://n8narena.com/guides/n8n-expression-cheatsheet/", kind: "guide" },
        ],
        thumbnail: youtubeThumbnail("https://www.youtube.com/watch?v=AURnISajubk"),
        featured: true,
      },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Topics",
    week: "Week 4",
    icon: BrainCircuit,
    accent: "from-[#00D4AA] via-[#00C2A0] to-[#9AFBE6]",
    background: "from-[#00D4AA]/18 via-[#00D4AA]/8 to-transparent",
    summary: "Extend n8n into AI tooling and production-grade reliability with MCP integration and structured error handling.",
    estimatedTime: "4-6 hours",
    difficulty: "Advanced",
    whyThisMatters:
      "This phase turns a capable builder into someone who can design workflows for production services, observability, and external protocol integrations.",
    tips: [
      "Use a staging workflow for the MCP integration before you connect it to anything sensitive.",
      "Trace error paths on purpose; production-ready automation is defined by how it fails.",
      "Capture retry, alert, and fallback behavior in the workflow design itself.",
    ],
    topics: [
      {
        id: "mcp",
        title: "MCP Integration for mcp.muhjah.com",
        kind: "Protocol Integration",
        difficulty: "Advanced",
        estimatedTime: "1.5-2 hours",
        whyItMatters: "Lets n8n participate in a modern AI toolchain through a structured protocol instead of one-off glue logic.",
        notes: ["Focus on request/response discipline and how the MCP boundary changes your workflow architecture."],
        tips: ["Keep a dedicated notebook of example tool calls so you can reuse patterns quickly."],
        links: [
          { label: "Getting started guide", href: "https://n8ntips.com/getting-started-with-model-context-protocol-mcp-on-n8n-2/", kind: "guide" },
          { label: "Live demo discussion", href: "https://community.n8n.io/t/what-is-mcp-how-to-use-it-in-n8n-full-guide-live-demo/105756", kind: "guide" },
          { label: "Open MCP server", href: "https://mcp.muhjah.com", kind: "environment" },
        ],
        featured: true,
      },
      {
        id: "error-handling",
        title: "Error Handling for Production",
        kind: "Reliability",
        difficulty: "Advanced",
        estimatedTime: "1.5-2 hours",
        whyItMatters: "Real systems fail. Your workflows need retries, branches, alerts, and recoverable states to be trusted in production.",
        notes: ["Define what happens on timeout, partial failure, invalid input, and downstream API errors."],
        tips: ["Use dedicated error workflows and explicit notification paths instead of silently swallowing exceptions."],
        links: [
          { label: "Watch error handling video", href: "https://www.youtube.com/watch?v=x6dJiPn4UsM", kind: "video" },
          { label: "Official video", href: "https://www.youtube.com/watch?v=XEUVl3bbMhI", kind: "video" },
        ],
        thumbnail: youtubeThumbnail("https://www.youtube.com/watch?v=x6dJiPn4UsM"),
      },
    ],
  },
  {
    id: "project",
    title: "Hands-On Project",
    week: "Capstone",
    icon: Target,
    accent: "from-[#F59E0B] via-[#FBBF24] to-[#FDE68A]",
    background: "from-[#F59E0B]/18 via-[#F59E0B]/8 to-transparent",
    summary: "Ship one real workflow that blends triggers, credentials, expressions, and error handling into a useful production-style automation.",
    estimatedTime: "4-8 hours",
    difficulty: "Intermediate",
    whyThisMatters:
      "Learning sticks when you build something that solves a real need. A project forces you to connect the dots and reveals the gaps you still need to close.",
    tips: [
      "Choose a workflow that touches at least one external API and one branch or validation step.",
      "Keep the first version small. Production-ready does not mean overbuilt.",
      "Document your assumptions, failure paths, and what you would monitor in production.",
    ],
    topics: [
      {
        id: "project-ideas",
        title: "Suggested Project Ideas",
        kind: "Build",
        difficulty: "Intermediate",
        estimatedTime: "Choose one",
        whyItMatters: "A concrete use case gives you enough constraints to practice real workflow design.",
        notes: [
          "Option 1: Incoming webhook -> validate payload -> enrich via API -> post to Slack or email.",
          "Option 2: Scheduled sync -> pull records from a SaaS API -> transform with expressions -> write to a database or sheet.",
          "Option 3: MCP-assisted ops helper -> prompt/trigger -> fetch context from an internal service -> return a structured response.",
        ],
        tips: ["Pick the project that resembles work you actually expect to automate in your environment."],
        links: [
          { label: "Open n8n templates", href: "https://n8n.io/workflows", kind: "guide" },
          { label: "Browse community workflows", href: "https://community.n8n.io/", kind: "guide" },
        ],
      },
    ],
  },
];

const resources = [
  {
    title: "Official docs",
    description: "Best source for node behavior, credentials, expressions, and runtime details.",
    href: "https://docs.n8n.io/",
    accent: "from-[#FF6D5A] to-[#FF9B8A]",
  },
  {
    title: "Community forum",
    description: "Great for patterns, troubleshooting, and real-world workflow ideas.",
    href: "https://community.n8n.io/",
    accent: "from-[#7B61FF] to-[#A594FF]",
  },
  {
    title: "Template gallery",
    description: "Useful when you want to reverse-engineer how experienced builders structure workflows.",
    href: "https://n8n.io/workflows",
    accent: "from-[#00D4AA] to-[#7CF0DA]",
  },
  {
    title: "MCP environment",
    description: "Your target integration endpoint for advanced protocol work.",
    href: "https://mcp.muhjah.com",
    accent: "from-[#F59E0B] to-[#FCD34D]",
  },
];

const quickReference = [
  {
    title: "Common patterns",
    items: [
      "Trigger -> Validate -> Transform -> Route -> Notify",
      "Webhook -> Auth -> Enrich -> Persist",
      "Schedule -> Fetch -> Compare -> Act",
      "Error workflow -> Alert -> Retry -> Recovery",
    ],
  },
  {
    title: "Workflow habits",
    items: [
      "Name nodes by intent, not by type alone",
      "Inspect execution data after every non-trivial change",
      "Keep credentials separate from logic",
      "Use Set nodes to make payload shape explicit",
    ],
  },
  {
    title: "Keyboard shortcuts",
    items: [
      "Cmd/Ctrl + S: save the workflow",
      "Cmd/Ctrl + Enter: check your instance shortcut settings for execution",
      "Use the node search and command palette for fast navigation",
      "Shortcut mappings can vary by version and custom configuration",
    ],
  },
];

const phaseIconMap: Record<string, typeof Rocket> = {
  foundation: Rocket,
  core: Workflow,
  advanced: BrainCircuit,
  project: Target,
};

export default function N8nLearningRoadmap({
  learnerName = "Colleague Name",
  n8nUrl = "https://n8n.synorco.com",
  mcpUrl = "https://mcp.muhjah.com",
  className = "",
}: RoadmapProps) {
  const [progress, setProgress] = useState<ProgressState>({});
  const [openPhase, setOpenPhase] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    try {
      const savedProgress = window.localStorage.getItem(STORAGE_KEY);
      const savedLocale = window.localStorage.getItem(LOCALE_KEY);

      if (savedProgress) {
        setProgress(JSON.parse(savedProgress) as ProgressState);
      }

      if (savedLocale === "ar" || savedLocale === "en") {
        setLocale(savedLocale);
      }
    } catch {
      setProgress({});
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage failures in constrained environments.
    }
  }, [progress]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCALE_KEY, locale);
    } catch {
      // Ignore storage failures in constrained environments.
    }
  }, [locale]);

  const isArabic = locale === "ar";
  const text = copy[locale];
  const localized = copy[locale] as (typeof copy)["en"];
  const allTopics = useMemo(() => phases.flatMap((phase) => phase.topics), []);
  const completedCount = allTopics.filter((topic) => progress[topic.id]).length;
  const totalCount = allTopics.length;
  const completionPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  const phaseProgress = (phase: Phase) => {
    const done = phase.topics.filter((topic) => progress[topic.id]).length;
    return {
      done,
      total: phase.topics.length,
      percent: phase.topics.length ? Math.round((done / phase.topics.length) * 100) : 0,
      status:
        done === 0 ? ("Not Started" as const) : done === phase.topics.length ? ("Completed" as const) : ("In Progress" as const),
    };
  };

  const nextTopic = allTopics.find((topic) => !progress[topic.id]) ?? allTopics[allTopics.length - 1];
  const nextPhase = phases.find((phase) => phase.topics.some((topic) => !progress[topic.id])) ?? phases[phases.length - 1];

  const toggleTopic = (topicId: string) => {
    setProgress((current) => ({ ...current, [topicId]: !current[topicId] }));
  };

  const statusStyles: Record<string, string> = {
    "Not Started": "bg-white/8 text-slate-300 border-white/10",
    "In Progress": "bg-[#7B61FF]/15 text-[#D7CEFF] border-[#7B61FF]/30",
    Completed: "bg-[#00D4AA]/15 text-[#B3FFF0] border-[#00D4AA]/30",
  };

  return (
    <div className={`min-h-screen bg-[#1A1A1A] text-white ${className}`} dir={isArabic ? "rtl" : "ltr"} lang={locale}>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,109,90,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(123,97,255,0.16),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(0,212,170,0.12),_transparent_24%)]" />
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#FF6D5A]/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#7B61FF]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#00D4AA]/10 blur-3xl" />

        <main className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="relative overflow-hidden rounded-[32px] border border-white/12 bg-gradient-to-br from-[#000000] via-[#05050C] to-[#0A0A14] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,212,170,0.12),transparent_32%),radial-gradient(circle_at_88%_14%,rgba(123,97,255,0.18),transparent_36%),radial-gradient(circle_at_74%_84%,rgba(255,109,90,0.12),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.45)_0.6px,transparent_0.8px)] [background-size:20px_20px]" />
            <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] xl:items-center">
              <div className="min-w-0 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
                    <Sparkles className="h-3.5 w-3.5 text-[#FF6D5A]" />
                    {text.premiumBadge}
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocale((current) => (current === "en" ? "ar" : "en"))}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111111]/75 px-3 py-1 text-xs font-semibold text-white transition hover:border-white/20 hover:bg-white/12"
                  >
                    <Globe className="h-3.5 w-3.5 text-[#00D4AA]" />
                    {text.language}: {locale === "en" ? text.arabic : text.english}
                  </button>
                </div>
                <div className="space-y-4">
                  <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Hola Jamal 🧑‍🚀
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">and hope this time will be different</p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                  <Pill icon={Clock3} label={isArabic ? `${completedCount}/${totalCount} مواضيع مكتملة` : `${completedCount}/${totalCount} topics complete`} />
                  <Pill icon={ShieldCheck} label={text.selfHostedFriendly} />
                  <Pill icon={Bot} label={text.mcpReady} />
                  <Pill icon={GraduationCap} label={text.productionFocused} />
                </div>
              </div>

              <div className="xl:justify-self-end">
                <HeroEarthGlobe n8nUrl={n8nUrl} isArabic={isArabic} className="h-[360px] w-full xl:h-[560px] xl:w-[560px] xl:translate-x-10" />
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_380px]">
            <section className="space-y-4">
              {phases.map((phase) => {
                const Icon = phase.icon;
                const stats = phaseProgress(phase);
                const isOpen = openPhase === phase.id;
                const isCompleted = stats.status === "Completed";
                const phaseStyle = statusStyles[stats.status];
                const phaseCopy = localized.phasesMeta[phase.id as keyof typeof localized.phasesMeta];

                return (
                  <article
                    key={phase.id}
                    className={`overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br ${phase.background} shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl transition hover:border-white/20`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenPhase((current) => (current === phase.id ? null : phase.id))}
                      className={`w-full p-5 sm:p-6 ${isArabic ? "text-right" : "text-left"}`}
                    >
                      <div className="grid gap-4 xl:grid-cols-[auto,minmax(0,1fr),auto] xl:items-start">
                        <div className="flex gap-4 min-w-0 xl:col-span-2">
                          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${phase.accent} text-[#111111] shadow-lg shadow-black/25`}>
                            <Icon className="h-7 w-7" />
                          </div>
                          <div className="min-w-0 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                                {phaseCopy.week}
                              </span>
                              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${phaseStyle}`}>
                                {text.status[stats.status as keyof typeof text.status]}
                              </span>
                              <DifficultyBadge level={phase.difficulty} locale={locale} />
                                <Badge icon={Clock3} label={phaseCopy.estimatedTime} />
                            </div>
                            <div>
                              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{phaseCopy.title}</h2>
                              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                                {phaseCopy.summary}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                              <Badge icon={ClipboardCheck} label={isArabic ? `${stats.done}/${stats.total} خلصتها` : `${stats.done}/${stats.total} done`} />
                              <Badge icon={Target} label={isArabic ? `${stats.percent}% مكتمل` : `${stats.percent}% done`} />
                              <Badge icon={Lightbulb} label={isArabic ? "ليش هذا مهم؟" : "Why this matters"} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 self-start xl:justify-end">
                          <div className="hidden max-w-full rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-slate-300 lg:block">
                            {isCompleted ? text.readyToReview : text.tapToExpand}
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/8 p-2 text-slate-200 transition group-hover:bg-white/12">
                            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </div>
                        </div>
                      </div>
                    </button>

                    {isOpen ? (
                      <div className="border-t border-white/10 px-5 pb-5 sm:px-6 sm:pb-6">
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,360px)]">
                          <div className="min-w-0 space-y-4 pt-5">
                            <div className="rounded-2xl border border-white/10 bg-[#111111]/55 p-6 space-y-4">
                              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                                <Info className="h-4 w-4 text-[#00D4AA]" />
                                {isArabic ? "ليش هذا مهم؟" : "Why this matters"}
                              </div>
                              <p className="line-clamp-2 break-words leading-7 text-slate-300">{phaseCopy.whyThisMatters}</p>
                              <div>
                                <p className="mb-2 text-sm font-medium text-slate-200">{isArabic ? "ملاحظات سريعة" : "Quick tips"}</p>
                                <ul className="space-y-2 text-sm leading-6 text-slate-300">
                                  {phaseCopy.tips.slice(0, 3).map((tip: string) => (
                                    <li key={tip} className="flex gap-2">
                                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#00D4AA]" />
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {phase.id === "advanced" ? (
                              <McpFundamentalsCard
                                content={localized.mcpFundamentals}
                                isArabic={isArabic}
                                onStartPractice={() => {
                                  const mcpPractice = document.getElementById("mcp-practice");
                                  if (mcpPractice) {
                                    mcpPractice.scrollIntoView({ behavior: "smooth", block: "start" });
                                  }
                                }}
                              />
                            ) : null}

                            <div className="grid gap-4">
                              {(expandedTopics[phase.id] ? phase.topics : phase.topics.slice(0, 2)).map((topic) => {
                                const checked = !!progress[topic.id];
                                const primaryLink = topic.links[0];
                                const topicCopy = localized.topicsMeta[topic.id as keyof typeof localized.topicsMeta];
                                return (
                                  <div
                                    key={topic.id}
                                    id={topic.id === "mcp" ? "mcp-practice" : undefined}
                                    className={`group rounded-[24px] border ${checked ? "border-[#00D4AA]/30 bg-[#00D4AA]/8" : "border-white/10 bg-white/6"} p-4 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-white/20`}
                                  >
                                    <div className="grid gap-4 2xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
                                      {topic.thumbnail ? (
                                        <button
                                          type="button"
                                          onClick={() => primaryLink && safeOpen(primaryLink.href)}
                                          className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/8"
                                        >
                                          <img
                                            src={topic.thumbnail}
                                            alt={`${topic.title} thumbnail`}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                                          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                                            <PlayCircle className="h-3.5 w-3.5 text-[#FF6D5A]" />
                                            {isArabic ? "معاينة" : "Preview"}
                                          </div>
                                          <div className={`absolute bottom-4 left-4 right-4 ${isArabic ? "text-right" : "text-left"} text-white`}>
                                            <p className="text-xs uppercase tracking-[0.18em] text-white/70">{topicCopy.kind}</p>
                                            <p className="mt-1 text-sm font-medium leading-6">{topicCopy.title}</p>
                                          </div>
                                        </button>
                                      ) : (
                                        <div className="flex min-h-44 w-full flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/6 to-transparent p-5">
                                          <div className="flex items-center justify-between text-slate-200">
                                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6D5A] via-[#7B61FF] to-[#00D4AA] text-[#111111] shadow-lg shadow-black/25">
                                              <PanelTop className="h-6 w-6" />
                                            </div>
                                            <Badge icon={Clock3} label={topic.estimatedTime} />
                                          </div>
                                          <div>
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{topicCopy.kind}</p>
                                            <p className="mt-2 text-lg font-semibold text-white">{topicCopy.title}</p>
                                            <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-slate-300">{topicCopy.whyItMatters}</p>
                                          </div>
                                        </div>
                                      )}

                                      <div className="min-w-0 space-y-4">
                                        <div className="space-y-2 break-words">
                                          <h3 className="text-lg font-semibold leading-7 text-white sm:text-xl">{topicCopy.title}</h3>
                                          <p className="line-clamp-2 break-words leading-7 text-slate-300">{topicCopy.whyItMatters}</p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() => toggleTopic(topic.id)}
                                            className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${checked ? "border-[#00D4AA]/30 bg-[#00D4AA]/15 text-[#B3FFF0]" : "border-white/10 bg-white/8 text-slate-200 hover:bg-white/12"}`}
                                          >
                                            {checked ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                                            {checked ? (isArabic ? "خلصتها ✔️" : "Done ✔️") : (isArabic ? "خلصتها ✔️" : "Done ✔️")}
                                          </button>
                                          <Badge icon={Clock3} label={topicCopy.estimatedTime} />
                                          <DifficultyBadge level={topic.difficulty} locale={locale} />
                                          {topic.featured ? (
                                            <span className="rounded-full border border-[#FF6D5A]/30 bg-[#FF6D5A]/15 px-3 py-1 text-xs font-medium text-[#FFD7D0]">
                                              {text.featured}
                                            </span>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {phase.topics.length > 2 ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedTopics((current) => ({
                                    ...current,
                                    [phase.id]: !current[phase.id],
                                  }))
                                }
                                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                              >
                                {expandedTopics[phase.id]
                                  ? isArabic
                                    ? "اعرض أقل"
                                    : "Show less"
                                  : isArabic
                                    ? "اعرض باقي المواضيع"
                                    : "Show more topics"}
                              </button>
                            ) : null}
                          </div>

                          <aside className="space-y-4 pt-5">
                            <div className="rounded-[24px] border border-white/10 bg-[#111111]/55 p-5">
                              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                                <Zap className="h-4 w-4 text-[#7B61FF]" />
                                {text.progressOverview}
                              </div>
                              <div className="mt-4 space-y-3 text-sm text-slate-300">
                                <Metric label={text.completion} value={`${stats.percent}%`} />
                                <Metric label="Status" value={text.status[stats.status as keyof typeof text.status]} />
                                <Metric label={isArabic ? "الوقت المطلوب" : "Time commitment"} value={phaseCopy.estimatedTime} />
                                <Metric label={isArabic ? "المستوى" : "Difficulty"} value={text.difficulty[phase.difficulty]} />
                              </div>
                            </div>

                            <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/8 to-transparent p-5">
                              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                                <Bot className="h-4 w-4 text-[#00D4AA]" />
                                {text.environment}
                              </div>
                              <div className="mt-4 space-y-4">
                                <EnvironmentCard label={text.environmentInstance} value={n8nUrl.replace(/^https?:\/\//, "")} href={n8nUrl} />
                                <EnvironmentCard label={text.environmentServer} value={mcpUrl.replace(/^https?:\/\//, "")} href={mcpUrl} />
                              </div>
                            </div>
                          </aside>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </section>

            <aside className="hidden space-y-6 lg:block">
              <section className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <Layers3 className="h-4 w-4 text-[#FF6D5A]" />
                  {text.quickReference}
                </div>
                <div className="mt-5 space-y-5">
                  {localized.quickReferenceSections.map((section) => (
                    <div key={section.title} className="rounded-2xl border border-white/10 bg-[#111111]/55 p-4">
                      <p className="text-sm font-semibold text-white">{section.title}</p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                        {section.items.map((item) => (
                          <li key={item} className="flex gap-3">
                            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#00D4AA]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <BookOpen className="h-4 w-4 text-[#7B61FF]" />
                  {text.resourcesSidebar}
                </div>
                <div className="mt-5 space-y-3">
                  {localized.resourcesCards.map((resource) => (
                    <button
                      key={resource.title}
                      type="button"
                      onClick={() => safeOpen(resource.href)}
                      className={`group w-full rounded-2xl border border-white/10 bg-[#111111]/55 p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 ${isArabic ? "text-right" : "text-left"}`}
                    >
                      <div className={`inline-flex max-w-full rounded-full bg-gradient-to-r ${resource.accent} px-3 py-1 text-xs font-semibold text-[#111111] shadow-sm`}>
                        {resource.title}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{resource.description}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/85">
                        {text.openResource}
                        <ExternalLink className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#FF6D5A]/16 via-[#7B61FF]/10 to-[#00D4AA]/12 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <Info className="h-4 w-4 text-[#00D4AA]" />
                  {text.learningGuidance}
                </div>
                <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  {localized.guidanceParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => safeOpen(n8nUrl)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[#111111] transition hover:-translate-y-0.5"
                  >
                    {text.openN8n}
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => safeOpen(mcpUrl)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#111111]/55 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    {text.openMcp}
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function Pill({ icon: Icon, label }: { icon: typeof Rocket; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-sm text-slate-200">
      <Icon className="h-3.5 w-3.5 text-[#00D4AA]" />
      {label}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function Badge({ icon: Icon, label }: { icon: typeof Clock3; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-slate-200">
      <Icon className="h-3.5 w-3.5 text-slate-300" />
      {label}
    </span>
  );
}

function DifficultyBadge({ level, locale }: { level: Phase["difficulty"] | Topic["difficulty"]; locale: Locale }) {
  const classes = {
    Beginner: "border-[#00D4AA]/25 bg-[#00D4AA]/12 text-[#BAFFF0]",
    Intermediate: "border-[#7B61FF]/25 bg-[#7B61FF]/12 text-[#E2DAFF]",
    Advanced: "border-[#FF6D5A]/25 bg-[#FF6D5A]/12 text-[#FFD7D0]",
  }[level];

  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${classes}`}>{copy[locale].difficulty[level]}</span>;
}

function InfoPanel({ title, icon: Icon, items }: { title: string; icon: typeof BookOpen; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111]/50 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <Icon className="h-4 w-4 text-[#FF6D5A]" />
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <Circle className="mt-1 h-3.5 w-3.5 shrink-0 text-[#00D4AA]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function EnvironmentCard({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <button
      type="button"
      onClick={() => safeOpen(href)}
      className="group w-full rounded-2xl border border-white/10 bg-white/6 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/10"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-1 text-sm font-medium text-white">{value}</p>
        </div>
        <ExternalLink className="h-4 w-4 text-slate-300 transition group-hover:text-white" />
      </div>
    </button>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  return (
    <div className="relative h-20 w-20 shrink-0">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(#FF6D5A 0deg, #7B61FF ${percent * 2.8}deg, #00D4AA ${percent * 3.6}deg, rgba(255,255,255,0.08) ${percent * 3.6}deg 360deg)`,
        }}
      />
      <div className="absolute inset-2 rounded-full bg-[#111111] shadow-inner shadow-black/40" />
      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">{percent}%</div>
    </div>
  );
}

function HeroEarthGlobe({ n8nUrl, isArabic, className = "" }: HeroEarthGlobeProps) {
  const [rotation, setRotation] = useState({ x: -12, y: 24 });
  const [zoom, setZoom] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverOffset, setHoverOffset] = useState({ x: 0, y: 0 });
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const lastInteraction = useRef(Date.now());

  const stars = useMemo(
    () =>
      Array.from({ length: 170 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() > 0.8 ? 2 : 1,
        opacity: 0.2 + Math.random() * 0.7,
        duration: 1.8 + Math.random() * 2.6,
        delay: Math.random() * 2,
      })),
    []
  );

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const idle = Date.now() - lastInteraction.current > 2000;

      setRotation((current) => {
        let nextX = current.x;
        let nextY = current.y;

        if (idle && !isDragging) {
          nextY += 0.14;
        }

        if (Math.abs(velocity.current.x) > 0.001 || Math.abs(velocity.current.y) > 0.001) {
          nextY += velocity.current.x;
          nextX += velocity.current.y;
          velocity.current.x *= 0.92;
          velocity.current.y *= 0.92;
        }

        return {
          x: Math.max(-42, Math.min(42, nextX)),
          y: nextY,
        };
      });

      setHoverOffset((current) => ({
        x: current.x * 0.9,
        y: current.y * 0.9,
      }));

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [isDragging]);

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    lastPointer.current = { x: event.clientX, y: event.clientY };
    lastInteraction.current = Date.now();
  };

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;
    setHoverOffset({ x: relativeX * 18, y: relativeY * 14 });

    if (!lastPointer.current) {
      return;
    }

    const dx = event.clientX - lastPointer.current.x;
    const dy = event.clientY - lastPointer.current.y;
    lastPointer.current = { x: event.clientX, y: event.clientY };

    if (isDragging) {
      setRotation((current) => ({
        x: Math.max(-42, Math.min(42, current.x - dy * 0.23)),
        y: current.y + dx * 0.35,
      }));
      velocity.current = { x: dx * 0.013, y: -dy * 0.01 };
      lastInteraction.current = Date.now();
      return;
    }

    velocity.current = { x: dx * 0.0022, y: -dy * 0.0018 };
    lastInteraction.current = Date.now();
  };

  const endDrag = () => {
    setIsDragging(false);
    lastPointer.current = null;
    setHoverOffset({ x: 0, y: 0 });
    lastInteraction.current = Date.now();
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setZoom((current) => Math.max(0.82, Math.min(1.36, current - event.deltaY * 0.0007)));
    lastInteraction.current = Date.now();
  };

  return (
    <div
      className={`relative min-h-[400px] cursor-grab overflow-visible active:cursor-grabbing ${className}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onWheel={onWheel}
    >
      <div className="pointer-events-none absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#7B61FF]/24 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-10 h-64 w-64 rounded-full bg-[#00D4AA]/16 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-8 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <div className="absolute inset-0 flex items-center justify-center [perspective:1200px]">
        <div
          className="relative h-[320px] w-[320px] sm:h-[380px] sm:w-[380px]"
          style={{
            transformStyle: "preserve-3d",
            transform: `translate3d(${hoverOffset.x}px, ${hoverOffset.y}px, 0) scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isDragging ? "none" : "transform 140ms ease-out",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_68%_22%,rgba(255,255,255,0.42),rgba(255,255,255,0)_34%),radial-gradient(circle_at_30%_70%,rgba(0,184,255,0.14),rgba(0,184,255,0)_56%)]" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.12),transparent_24%),linear-gradient(90deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.1)_32%,rgba(0,0,0,0.32)_100%)] mix-blend-multiply" />

          <div
            className="absolute inset-0 rounded-full border border-cyan-300/30"
            style={{
              backgroundImage:
                "url('https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg')",
              backgroundSize: "cover",
              backgroundPosition: `${(rotation.y * 0.65) % 360}px center`,
              filter: "saturate(1.08) contrast(1.06)",
              boxShadow:
                "inset -82px -82px 132px rgba(0,0,0,0.84), inset 44px 38px 96px rgba(255,255,255,0.16), 0 0 42px rgba(0,212,170,0.18)",
            }}
          />

          <div
            className="absolute inset-0 rounded-full opacity-20 mix-blend-screen"
            style={{
              backgroundImage:
                "url('https://raw.githubusercontent.com/turban/webgl-earth/master/images/water_4k.png')",
              backgroundSize: "cover",
              backgroundPosition: `${(rotation.y * 0.7) % 360}px center`,
            }}
          />

          <div
            className="absolute inset-0 rounded-full opacity-35"
            style={{
              backgroundImage:
                "url('https://raw.githubusercontent.com/turban/webgl-earth/master/images/fair_clouds_4k.png')",
              backgroundSize: "cover",
              backgroundPosition: `${(rotation.y * 0.9) % 360}px center`,
              filter: "blur(0.2px)",
            }}
          />

          <div className="pointer-events-none absolute -inset-3 rounded-full border border-cyan-300/30 blur-[2px]" />
          <div className="pointer-events-none absolute -inset-7 rounded-full bg-cyan-400/15 blur-2xl" />
          <div className="pointer-events-none absolute -inset-10 rounded-full border border-cyan-200/10" />
          <div className="pointer-events-none absolute left-[17%] top-[58%] h-6 w-6 rounded-full border border-[#7B61FF]/45 bg-[#7B61FF]/20 shadow-[0_0_20px_rgba(123,97,255,0.8)]" />
          <div className="pointer-events-none absolute right-[15%] top-[18%] h-3.5 w-3.5 rounded-full bg-white/75 shadow-[0_0_18px_rgba(255,255,255,0.85)]" />

          <button
            type="button"
            onClick={() => safeOpen(n8nUrl)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="pointer-events-auto absolute left-[61%] top-[37%] z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FF6D5A]/60 bg-[#FF6D5A]/65 shadow-[0_0_24px_rgba(255,109,90,0.9)]"
          >
            <span className="sr-only">n8n.synorco.com</span>
          </button>
          <span className="pointer-events-none absolute left-[61%] top-[37%] z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FF6D5A]/60 animate-ping" />

          {showTooltip ? (
            <div className={`absolute z-30 -translate-y-2 rounded-xl border border-[#FF6D5A]/45 bg-black/85 px-3 py-2 text-xs font-medium text-white shadow-xl ${isArabic ? "right-[8%]" : "left-[64%]"}`}>
              n8n.synorco.com
            </div>
          ) : null}

          <div className="pointer-events-none absolute -inset-14 flex items-center justify-center">
            <div className="absolute h-[112%] w-[112%] rounded-full border border-dashed border-[#FF6D5A]/35" style={{ animation: "spin 24s linear infinite" }} />
            <div className="absolute h-[128%] w-[128%] rounded-full border border-dashed border-[#7B61FF]/35" style={{ animation: "spin 32s linear infinite reverse" }} />
            <div className="absolute h-[144%] w-[144%] rounded-full border border-dashed border-[#00D4AA]/35" style={{ animation: "spin 40s linear infinite" }} />

            <div className="absolute h-[118%] w-[118%] rounded-full border border-[#FF6D5A]/20" style={{ transform: "rotateX(68deg)" }} />
            <div className="absolute h-[134%] w-[134%] rounded-full border border-[#7B61FF]/18" style={{ transform: "rotateX(64deg) rotateZ(20deg)" }} />
            <div className="absolute h-[150%] w-[150%] rounded-full border border-[#00D4AA]/16" style={{ transform: "rotateX(58deg) rotateZ(-16deg)" }} />

            <div className="absolute h-[112%] w-[112%]" style={{ animation: "spin 9s linear infinite" }}>
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#FF6D5A] shadow-[0_0_12px_rgba(255,109,90,0.9)]" />
            </div>
            <div className="absolute h-[128%] w-[128%]" style={{ animation: "spin 12s linear infinite reverse" }}>
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#7B61FF] shadow-[0_0_12px_rgba(123,97,255,0.9)]" />
            </div>
            <div className="absolute h-[144%] w-[144%]" style={{ animation: "spin 15s linear infinite" }}>
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#00D4AA] shadow-[0_0_12px_rgba(0,212,170,0.9)]" />
            </div>

            <div className="absolute h-[166%] w-[166%]" style={{ animation: "spin 22s linear infinite reverse" }}>
              <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.85)]" />
              <span className="absolute left-[36%] top-[8%] h-1 w-1 rounded-full bg-[#7B61FF]/80 shadow-[0_0_8px_rgba(123,97,255,0.8)]" />
              <span className="absolute right-[32%] top-[12%] h-1 w-1 rounded-full bg-[#00D4AA]/80 shadow-[0_0_8px_rgba(0,212,170,0.8)]" />
            </div>

            <div className="absolute h-[154%] w-[154%]" style={{ animation: "spin 18s linear infinite" }}>
              <span className="absolute left-[20%] top-[18%] h-2 w-2 rounded-full bg-[#FF6D5A] shadow-[0_0_14px_rgba(255,109,90,0.95)]" />
              <span className="absolute right-[24%] top-[26%] h-2 w-2 rounded-full bg-[#00D4AA] shadow-[0_0_14px_rgba(0,212,170,0.95)]" />
            </div>

            <div className="absolute h-[184%] w-[184%]" style={{ animation: "spin 28s linear infinite" }}>
              <span className="absolute left-[12%] top-[42%] h-1.5 w-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function McpFundamentalsCard({
  content,
  isArabic,
  onStartPractice,
}: {
  content: McpFundamentalsSection;
  isArabic: boolean;
  onStartPractice: () => void;
}) {
  return (
    <section className="rounded-[24px] border border-[#00D4AA]/25 bg-gradient-to-br from-[#00D4AA]/12 via-[#7B61FF]/10 to-[#111111]/60 p-5 sm:p-6">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#00D4AA]/30 bg-[#00D4AA]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#B3FFF0]">
            {isArabic ? "3.1: فهم MCP" : "3.1: Understanding MCP"}
          </span>
          <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-slate-200">
            {isArabic ? "نظرية قبل التطبيق" : "Theory before practice"}
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111111]/55 p-4 sm:p-5">
          <h3 className="text-xl font-semibold text-white sm:text-2xl">{content.intro.title}</h3>
          <p className="mt-3 break-words text-sm leading-7 text-slate-200 sm:text-base">{content.intro.simple}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="min-w-0 rounded-xl border border-[#FF6D5A]/25 bg-[#FF6D5A]/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[#FFD7D0]">
                <AlertTriangle className="h-4 w-4" />
                {isArabic ? "المشكلة بدون MCP" : "Without MCP"}
              </div>
              <p className="mt-2 break-words text-sm leading-6 text-slate-200">{content.intro.problem}</p>
            </div>
            <div className="min-w-0 rounded-xl border border-[#00D4AA]/25 bg-[#00D4AA]/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[#B3FFF0]">
                <CheckCircle2 className="h-4 w-4" />
                {isArabic ? "الفكرة ببساطة" : "MCP analogy"}
              </div>
              <p className="mt-2 break-words text-sm leading-6 text-slate-200">{content.intro.analogy}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="min-w-0 rounded-2xl border border-white/10 bg-[#111111]/60 p-4">
            <p className="text-sm font-medium text-slate-300">{content.video.title}</p>
            <p className="mt-1 text-lg font-semibold text-white">{content.video.name}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-slate-200">
              <PlayCircle className="h-3.5 w-3.5 text-[#FF6D5A]" />
              {content.video.duration}
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <iframe
                src={youtubeEmbedUrl(content.video.link)}
                title={content.video.name}
                className="aspect-video w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p className="mt-3 break-words text-sm leading-6 text-slate-300">{content.video.description}</p>
          </div>

          <div className="min-w-0 rounded-2xl border border-[#7B61FF]/25 bg-[#7B61FF]/10 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[#E2DAFF]">
              <Lightbulb className="h-4 w-4" />
              {content.whyNow.title}
            </div>
            <p className="mt-2 break-words text-sm leading-7 text-slate-200">{content.whyNow.text}</p>
            <button
              type="button"
              onClick={onStartPractice}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              {isArabic ? "الانتقال إلى 3.2 التطبيق العملي" : "Go to 3.2 practical integration"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111111]/55 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Workflow className="h-4 w-4 text-[#00D4AA]" />
            {content.keyPoints.title}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {content.keyPoints.points.map((point) => (
              <div key={point.title} className="min-w-0 rounded-xl border border-white/10 bg-white/6 p-4">
                <p className="text-sm font-semibold text-white">{point.title}</p>
                <p className="mt-2 break-words text-sm leading-6 text-slate-300">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function resourceIcon(kind: TopicLink["kind"]) {
  switch (kind) {
    case "docs":
      return <BookOpen className="h-4 w-4 text-[#00D4AA]" />;
    case "tutorial":
      return <ClipboardCheck className="h-4 w-4 text-[#7B61FF]" />;
    case "guide":
      return <Link2 className="h-4 w-4 text-[#FF6D5A]" />;
    case "quick-ref":
      return <Code2 className="h-4 w-4 text-[#F59E0B]" />;
    case "environment":
      return <LockKeyhole className="h-4 w-4 text-[#00D4AA]" />;
    case "video":
    default:
      return <PlayCircle className="h-4 w-4 text-[#FF6D5A]" />;
  }
}
