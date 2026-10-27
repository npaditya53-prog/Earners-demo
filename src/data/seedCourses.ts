import { Category, Course, Instructor } from '../types';

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'ai-automation',
    name: 'AI & Automation',
    slug: 'ai-automation',
    iconName: 'Cpu',
    description: 'Prompt engineering, Claude, ChatGPT, Midjourney, and Make/Zapier workflow automation.',
    courseCount: 4,
  },
  {
    id: 'video-editing',
    name: 'Video Editing & Reels',
    slug: 'video-editing',
    iconName: 'Video',
    description: 'CapCut Desktop, Premiere Pro, mobile Reels, color grading, and short-form storytelling.',
    courseCount: 5,
  },
  {
    id: 'design-uiux',
    name: 'Design & UI/UX',
    slug: 'design-uiux',
    iconName: 'Palette',
    description: 'Figma prototyping, Canva graphic design, YouTube thumbnails, and brand identity.',
    courseCount: 4,
  },
  {
    id: 'content-creation',
    name: 'Content & YouTube',
    slug: 'content-creation',
    iconName: 'Camera',
    description: 'Channel strategy, scriptwriting, lighting setup, audience growth, and video SEO.',
    courseCount: 3,
  },
  {
    id: 'freelancing-biz',
    name: 'Freelancing & Business',
    slug: 'freelancing-biz',
    iconName: 'Briefcase',
    description: 'Upwork proposals, Fiverr gig ranking, high-paying client communication, and pricing.',
    courseCount: 4,
  },
  {
    id: 'tech-coding',
    name: 'Coding & Web Dev',
    slug: 'tech-coding',
    iconName: 'Code',
    description: 'HTML/CSS, JavaScript, React basics, Python scripts, and website building.',
    courseCount: 3,
  },
];

export const SEED_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-1',
    name: 'Rohan Sharma',
    title: 'Senior AI Workflow Specialist & Consultant',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    bio: 'Built automated AI solutions for 40+ international startups. Passionate about empowering creators with practical AI tools.',
    rating: 4.9,
    studentsCount: 18400,
  },
  {
    id: 'inst-2',
    name: 'Priya Nair',
    title: 'Lead Visual Designer & Motion Artist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    bio: '10+ years in digital design and brand identity. Formerly Design Director at Kreative Labs.',
    rating: 4.8,
    studentsCount: 22100,
  },
  {
    id: 'inst-3',
    name: 'Aman Varma',
    title: 'Full-time Freelance Creator & Producer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    bio: 'Top-Rated Freelancer on Upwork with $250k+ earnings. Helped 12,000+ students land their first paid clients.',
    rating: 4.9,
    studentsCount: 31000,
  },
];

export const SEED_COURSES: Course[] = [
  {
    id: 'course-ai-prompting',
    title: 'AI Prompt Engineering & Automation Masterclass',
    subtitle: 'Master ChatGPT, Claude, and Make.com to automate repetitive daily tasks and build custom AI workflows.',
    slug: 'ai-prompt-engineering-automation',
    categoryId: 'ai-automation',
    categoryName: 'AI & Automation',
    instructor: SEED_INSTRUCTORS[0],
    level: 'Beginner',
    language: 'English / Hindi terms',
    totalDuration: '3h 45m',
    badgeTag: 'Best Seller',
    gradientTheme: 'from-amber-900 via-slate-900 to-zinc-900',
    iconName: 'Cpu',
    isPublished: true,
    isFeatured: true,
    popularPath: 'AI & Future Tech Career Path',
    createdAt: '2026-01-15',
    updatedAt: '2026-03-10',
    learningOutcomes: [
      'Write highly structured prompts using modern context and role-based frameworks',
      'Chain multiple LLM calls together for research, scriptwriting, and data analysis',
      'Automate email responses and social media drafts using Make.com and OpenAI APIs',
      'Build custom GPTs and AI knowledge bases for personal or client projects',
    ],
    prerequisites: [
      'Basic familiarity with web browsing',
      'A free OpenAI or Claude account',
    ],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Foundations of Prompt Engineering',
        description: 'Understand how Large Language Models interpret context, temperature, and system instructions.',
        lessons: [
          {
            id: 'les-1-1',
            title: 'Welcome to EARNERS: The AI Advantage',
            durationMinutes: 8,
            type: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            content: `Welcome to EARNERS! In this opening lesson, Rohan Sharma breaks down how generative AI is shifting digital work in India and worldwide.

### Key Highlights:
1. Why prompt engineering is the foundational meta-skill of the decade.
2. The 4-part Prompt Anatomy: **Role + Task + Context + Output Format**.
3. Avoiding common traps like vague instructions and excessive hallucination.`,
            resources: [
              {
                title: 'EARNERS AI Prompt Cheat Sheet (PDF)',
                url: '#',
                type: 'PDF',
                size: '1.2 MB',
              },
            ],
          },
          {
            id: 'les-1-2',
            title: 'Crafting High-Precision Role Prompts',
            durationMinutes: 18,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            content: `Learn how assigning specialized expert roles drastically improves the accuracy and tone of model responses.

#### Step-by-Step Prompt Strategy:
- **Role Assignment**: "Act as a Senior Copywriter with 10 years of direct-response experience..."
- **Context Guardrails**: "Target audience: Tech-savvy Indian freelancers aged 20-35..."
- **Negative Prompts**: "Do not use buzzwords like 'game-changer' or 'revolutionize'."`,
          },
          {
            id: 'les-1-3',
            title: 'Few-Shot Prompting & In-Context Examples',
            durationMinutes: 22,
            type: 'text',
            content: `# Few-Shot Prompting Explained

Few-Shot Prompting involves giving the AI model 2 to 3 high-quality examples before asking it to perform the final task.

## Why Few-Shot Works
LLMs predict token probabilities based on previous text patterns. When you give explicit input-output pairs, the model mirrors the formatting and style seamlessly.

### Example Template:
\`\`\`text
Input: Transform bullet "Increased sales by 20%" into an achievement headline.
Output: Boosted quarterly revenue by 20% through targeted email retention campaigns.

Input: Transform bullet "Managed team of 5" into an achievement headline.
Output: Directed a 5-person cross-functional design team to launch 3 client products on time.

Input: Transform bullet "Created video thumbnails" into an achievement headline.
Output: [Model completes here]
\`\`\``,
          },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Practical Automation Workflows',
        description: 'Connect AI tools to Google Sheets, Gmail, and social channels with Make.com.',
        lessons: [
          {
            id: 'les-2-1',
            title: 'Introduction to Webhook Automation',
            durationMinutes: 15,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            content: 'In this lesson, we connect Make.com triggers to an AI API endpoint to automate form responses.',
          },
          {
            id: 'les-2-2',
            title: 'Building an Automated Content Calendar Generator',
            durationMinutes: 25,
            type: 'text',
            content: `# Automated Content Generator Workflow

Learn how to connect a simple Google Form submission to ChatGPT, generating 10 viral short-form video hooks automatically emailed to your inbox every Monday morning.`,
          },
        ],
      },
    ],
    quiz: {
      id: 'quiz-ai-1',
      courseId: 'course-ai-prompting',
      title: 'AI Prompt Engineering Final Assessment',
      description: 'Test your understanding of role prompting, few-shot techniques, and automation guardrails.',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          question: 'What are the four core components of a structured prompt?',
          options: [
            'Title, Password, URL, and Date',
            'Role, Task, Context, and Output Format',
            'Header, Footer, Main, and Sidebar',
            'Query, Database, Index, and Token',
          ],
          correctAnswers: [1],
          isMultiSelect: false,
          explanation: 'A structured prompt relies on Role (who the AI acts as), Task (what it must do), Context (background details), and Output Format (how to format the response).',
        },
        {
          id: 'q2',
          question: 'Which prompting technique provides explicit input-output examples inside the prompt context?',
          options: [
            'Zero-Shot Prompting',
            'Few-Shot Prompting',
            'Recursive Loop Prompting',
            'System Flash Prompting',
          ],
          correctAnswers: [1],
          isMultiSelect: false,
          explanation: 'Few-Shot Prompting includes 1 to 3 concrete examples to guide the model tone and output structure.',
        },
        {
          id: 'q3',
          question: 'Which of the following techniques help reduce hallucinations in AI responses? (Select all that apply)',
          options: [
            'Instructing the model: "If you are unsure or do not have factual data, state that explicitly"',
            'Providing verified reference documents directly in the prompt',
            'Setting temperature to maximum 2.0',
            'Specifying clear output format guardrails',
          ],
          correctAnswers: [0, 1, 3],
          isMultiSelect: true,
          explanation: 'Providing context, adding explicit fallback rules, and enforcing output constraints reduce hallucinations. Max temperature increases randomness.',
        },
      ],
    },
    assignment: {
      id: 'assign-ai-1',
      courseId: 'course-ai-prompting',
      title: 'Build a Client Prompting Framework',
      instructions: `### Assignment Guidelines:
Create a complete, reusable 3-part prompt template for a real or hypothetical business (e.g., an e-commerce brand, a freelance design studio, or an educational youtube channel).

Your submission must include:
1. **System / Role Prompt**: Define the persona, target tone, and rules.
2. **Few-Shot Examples**: At least 2 input-output demonstration pairs.
3. **Execution Prompt**: A real test input showing the AI response output.

Paste your completed markdown response in the text area below.`,
      dueDate: '2026-11-15',
      submissionRequirements: [
        'Must be at least 150 words',
        'Include clear Role, Context, and Output constraints',
      ],
    },
  },
  {
    id: 'course-video-reels',
    title: 'Smartphone Video Editing & Reels Mastery',
    subtitle: 'Create engaging Instagram Reels, YouTube Shorts, and promotional videos using CapCut Desktop & mobile tools.',
    slug: 'smartphone-video-editing-reels-mastery',
    categoryId: 'video-editing',
    categoryName: 'Video Editing & Reels',
    instructor: SEED_INSTRUCTORS[1],
    level: 'Beginner',
    language: 'Hindi & English',
    totalDuration: '4h 15m',
    badgeTag: 'Trending',
    gradientTheme: 'from-slate-900 via-zinc-900 to-amber-950',
    iconName: 'Video',
    isPublished: true,
    isFeatured: true,
    popularPath: 'Short-Form Content & Video Creator',
    createdAt: '2026-02-01',
    updatedAt: '2026-03-01',
    learningOutcomes: [
      'Master jump cuts, text animation, and caption styling for retention',
      'Apply cinematic color grading and sound design on smartphones or CapCut',
      'Structure 30-second video hooks that grab viewer attention in the first 3 seconds',
      'Export high-bitrate vertical videos optimized for Instagram and YouTube algorithms',
    ],
    prerequisites: [
      'A smartphone or laptop with CapCut installed',
      'No prior video editing experience required',
    ],
    modules: [
      {
        id: 'vmod-1',
        title: 'Module 1: Pacing, Cuts & Sound Design',
        description: 'Learn the fundamentals of visual pacing and clean audio editing.',
        lessons: [
          {
            id: 'vles-1-1',
            title: 'The 3-Second Hook Rule in Vertical Video',
            durationMinutes: 12,
            type: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoypasses.mp4',
            content: `The first 3 seconds determine whether a user continues scrolling or watches your entire video.

### Key Hook Rules:
- Motion in the first frame (zoom, pan, or gesture)
- Bold visual caption on screen
- Audio cue (sound effect or vocal statement)`,
          },
          {
            id: 'vles-1-2',
            title: 'Dynamic Captioning & Text Animation in CapCut',
            durationMinutes: 20,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            content: 'Step-by-step walkthrough of auto-captions, word-by-word highlights, and custom font presets.',
          },
        ],
      },
      {
        id: 'vmod-2',
        title: 'Module 2: Advanced Transitions & Export',
        description: 'Transitions, keyframe animations, and lossless export settings.',
        lessons: [
          {
            id: 'vles-2-1',
            title: 'Keyframing Zoom & Focus',
            durationMinutes: 18,
            type: 'text',
            content: `# Keyframe Basics
Keyframes allow you to animate elements smoothly across time. Learn how to zoom into key details when speaking important points.`,
          },
        ],
      },
    ],
    quiz: {
      id: 'quiz-video-1',
      courseId: 'course-video-reels',
      title: 'Reels Editing Knowledge Check',
      description: 'Test your understanding of video pacing, resolution, and hook creation.',
      passingScore: 75,
      questions: [
        {
          id: 'vq1',
          question: 'What is the standard aspect ratio for Instagram Reels and YouTube Shorts?',
          options: ['16:9', '4:3', '9:16', '1:1'],
          correctAnswers: [2],
          isMultiSelect: false,
          explanation: 'Vertical video formats use 9:16 aspect ratio (1080x1920 pixels).',
        },
        {
          id: 'vq2',
          question: 'Why are jump cuts frequently used in short-form videos?',
          options: [
            'To slow down the video pacing',
            'To eliminate dead pauses and keep visual momentum high',
            'To blur the video background',
            'To reduce audio file size',
          ],
          correctAnswers: [1],
          isMultiSelect: false,
          explanation: 'Jump cuts remove pauses and maintain engaging rhythm for social feeds.',
        },
      ],
    },
    assignment: {
      id: 'assign-video-1',
      courseId: 'course-video-reels',
      title: 'Submit Your 30-Second Edit Link',
      instructions: 'Upload a 30-second edited video to Google Drive, YouTube, or Instagram, and share the viewable link along with brief notes on your hook strategy.',
      dueDate: '2026-11-20',
      submissionRequirements: ['Public or unlisted video URL', 'Short explanation of sound effects used'],
    },
  },
  {
    id: 'course-figma-design',
    title: 'Figma UI/UX & Mobile App Design Essentials',
    subtitle: 'Learn auto-layout, design tokens, interactive prototyping, and component libraries for mobile apps.',
    slug: 'figma-uiux-mobile-app-design',
    categoryId: 'design-uiux',
    categoryName: 'Design & UI/UX',
    instructor: SEED_INSTRUCTORS[1],
    level: 'Intermediate',
    language: 'English',
    totalDuration: '5h 10m',
    badgeTag: 'Popular',
    gradientTheme: 'from-amber-950 via-slate-900 to-stone-900',
    iconName: 'Palette',
    isPublished: true,
    isFeatured: true,
    popularPath: 'UI/UX & Product Design Career Path',
    createdAt: '2026-01-10',
    updatedAt: '2026-03-05',
    learningOutcomes: [
      'Master Figma Auto Layout 5.0, constraints, and responsive frames',
      'Create clean typography scales and accessible color tokens',
      'Build realistic interactive mobile prototypes with smart-animate transitions',
      'Hand off clean design specs and asset exports to frontend developers',
    ],
    prerequisites: ['A free Figma account', 'Basic understanding of digital layouts'],
    modules: [
      {
        id: 'fmod-1',
        title: 'Module 1: Auto Layout & Typography Hierarchy',
        description: 'Master spatial relationships and responsive layout constraints.',
        lessons: [
          {
            id: 'fles-1-1',
            title: 'Understanding Spatial Math & Padding',
            durationMinutes: 16,
            type: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            content: 'Deep dive into 8pt grid systems, component outer vs inner padding, and nested radius math.',
          },
          {
            id: 'fles-1-2',
            title: 'Design System Color Tokens & Typography',
            durationMinutes: 24,
            type: 'text',
            content: `# Design Systems in Figma
Learn how to define local color styles, semantic typography hierarchies, and dark mode overrides without breaking component references.`,
          },
        ],
      },
    ],
    quiz: {
      id: 'quiz-figma-1',
      courseId: 'course-figma-design',
      title: 'Figma Layout & Tokens Quiz',
      description: 'Check your mastery of auto-layout, constraints, and design systems.',
      passingScore: 70,
      questions: [
        {
          id: 'fq1',
          question: 'In Figma Auto Layout, what setting makes a child element resize dynamically with its parent container?',
          options: ['Fixed Width', 'Hug Contents', 'Fill Container', 'Absolute Position'],
          correctAnswers: [2],
          isMultiSelect: false,
          explanation: 'Fill Container expands or shrinks the child element proportionally as the parent container resizes.',
        },
      ],
    },
  },
  {
    id: 'course-freelancing-upwork',
    title: 'Freelance Growth Blueprint: Upwork & Client Mastery',
    subtitle: 'Land high-paying client contracts, craft winning proposals, and build a recurring freelance income stream.',
    slug: 'freelance-growth-blueprint-upwork',
    categoryId: 'freelancing-biz',
    categoryName: 'Freelancing & Business',
    instructor: SEED_INSTRUCTORS[2],
    level: 'Beginner',
    language: 'Hindi & English',
    totalDuration: '3h 30m',
    badgeTag: 'High Rated',
    gradientTheme: 'from-amber-900 via-neutral-900 to-slate-900',
    iconName: 'Briefcase',
    isPublished: true,
    isFeatured: true,
    popularPath: 'Digital Freelancer & Agency Growth',
    createdAt: '2026-02-10',
    updatedAt: '2026-03-12',
    learningOutcomes: [
      'Write personalized, value-first proposals that win client response in 24 hours',
      'Optimize your Upwork & Fiverr profiles for high-ticket search ranking',
      'Set hourly rates and fixed price milestones with confidence',
      'Handle client objections, contract scope creep, and payment terms safely',
    ],
    prerequisites: ['Any digital skill (design, editing, writing, coding, or AI)'],
    modules: [
      {
        id: 'rmod-1',
        title: 'Module 1: Crafting High-Converting Proposals',
        description: 'How to stand out in a pool of 50+ applicants.',
        lessons: [
          {
            id: 'rles-1-1',
            title: 'The 3-Paragraph Winning Proposal Template',
            durationMinutes: 15,
            type: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            content: `Learn the 3-part proposal structure that earned Aman Varma $250k+ on Upwork.

Paragraph 1: Direct acknowledgment of the client's problem statement.
Paragraph 2: Concrete past proof / solution video loom link.
Paragraph 3: Low-friction call to action question.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-web-dev',
    title: 'Full-Stack Web Development Starter Kit',
    subtitle: 'Learn modern HTML5, CSS3, Tailwind, React, and server-side deployment to build live web applications.',
    slug: 'full-stack-web-development-starter-kit',
    categoryId: 'tech-coding',
    categoryName: 'Coding & Web Dev',
    instructor: SEED_INSTRUCTORS[0],
    level: 'Beginner',
    language: 'English',
    totalDuration: '6h 20m',
    gradientTheme: 'from-slate-900 via-amber-950 to-neutral-950',
    iconName: 'Code',
    isPublished: true,
    isFeatured: false,
    createdAt: '2026-02-15',
    updatedAt: '2026-03-01',
    learningOutcomes: [
      'Understand semantic HTML structure and responsive Tailwind CSS layout',
      'Build interactive React components with state hooks and props',
      'Fetch dynamic data from APIs and handle loading/error states',
    ],
    prerequisites: ['Computer with internet connection and VS Code installed'],
    modules: [
      {
        id: 'wmod-1',
        title: 'Module 1: Web Fundamentals',
        description: 'HTML5, CSS layout math, and modern JavaScript syntax.',
        lessons: [
          {
            id: 'wles-1-1',
            title: 'HTML5 Semantic Structure & Accessibility',
            durationMinutes: 20,
            type: 'text',
            content: '# HTML5 Semantics\nUse article, section, nav, and main tags to ensure clean SEO and screen-reader accessibility.',
          },
        ],
      },
    ],
  },
];

export const SEED_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    courseId: 'course-ai-prompting',
    title: 'New Lesson Added: Claude 3.7 & Hybrid Reasoning',
    content: 'We have updated Module 1 with a new video breakdown of hybrid reasoning models and extended context windows.',
    date: '2026-03-12',
  },
  {
    id: 'ann-2',
    courseId: 'course-video-reels',
    title: 'Live Q&A Session Recording Available',
    content: 'Check the resources section in Lesson 1 for the link to last night live editing feedback stream with Priya Nair.',
    date: '2026-03-08',
  },
];
