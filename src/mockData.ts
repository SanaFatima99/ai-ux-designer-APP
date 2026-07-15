import { Blueprint } from "./types";

export const MOCK_BLUEPRINTS: Blueprint[] = [
  {
    id: "sample-crm-real-estate",
    createdAt: "2026-07-13T07:18:00-07:00",
    idea: "CRM for a mid-sized Real Estate agency focusing on residential properties",
    targetAudience: "Real Estate Agents, Property Brokers, Agency Directors",
    platform: "Web",
    industry: "Real Estate",
    designStyle: "SaaS Dashboard",
    brandColors: {
      primary: "#0ea5e9",
      secondary: "#0f172a",
      hexCodes: ["#0ea5e9", "#0f172a", "#38bdf8", "#1e293b", "#ffffff", "#09090b"]
    },
    aiModel: "gemini-3.5-flash",
    isFavorite: true,
    productSummary: {
      overview: "EstateSuite is an offline-first premium CRM designed for real estate agents who spend most of their time in the field. It unifies lead tracking, property matching, calendar scheduling, and document signature verification into a fast, responsive interface.",
      problemStatement: "Agents lose deal momentum due to clunky CRM systems that load slowly on mobile devices and require manual property-to-client matching.",
      targetUsers: [
        "Residential agents looking for quick matching",
        "Brokerage managers tracking agent activities",
        "Independent property consultants"
      ],
      valueProposition: "Instantly match buyer criteria with active MLS listings using a native vector-search algorithm, with zero-latency caching for field agents."
    },
    features: {
      mustHave: [
        "Automatic property matching based on buyer preference",
        "Pipeline deal board (drag-and-drop active sales steps)",
        "Offline-capable listing log and address indexing",
        "Direct text and call triggers with integrated logging"
      ],
      niceToHave: [
        "AI-powered social media description generator for listings",
        "Integrated electronic signatures for deposit agreements",
        "Real-time geographic boundaries overlay on list views"
      ],
      futureFeatures: [
        "3D spatial tours parsing directly from standard mobile panoramic photos",
        "Predictive sellability pricing analysis via local trend databases",
        "Agent voice-to-text automated notes summary during showings"
      ]
    },
    personas: [
      {
        name: "Carlos Reynolds",
        role: "Senior Listing Broker",
        goals: [
          "Reduce CRM data entry time by half",
          "Access listing agreements on the go during showing events",
          "Automatically pair new leads with matching homes"
        ],
        painPoints: [
          "Desktop-bound software that is unreadable on mobile phones",
          "Weak mobile internet connection in vacant properties",
          "Manual sorting of client preferences"
        ],
        techExp: "Comfortable with smartphones, hates complex dashboards",
        workflow: [
          "Checks daily calendar and matches listing address on map",
          "Drives to listings, meets clients, takes feedback in paper notepad",
          "Returns to home office at night to manually update logs"
        ]
      },
      {
        name: "Emily Vance",
        role: "Independent Buyer Agent",
        goals: [
          "Find suitable listing details immediately during showing tours",
          "Keep high transparency of commissions and agreement progress",
          "Notify clients of price drops instantly"
        ],
        painPoints: [
          "Clients requesting property data Emily doesn't have on hand",
          "Slow broker networks that delay listing updates",
          "Fragmented communication channels (WhatsApp, Email, SMS)"
        ],
        techExp: "Always uses mobile, prefers minimal and beautiful SaaS designs",
        workflow: [
          "Monitors local MLS updates while traveling",
          "Shares listings with clients via private chat channels",
          "Drafts deal sheets in coffee shops"
        ]
      }
    ],
    userJourney: {
      steps: [
        {
          step: 1,
          stage: "Discovery & Setup",
          action: "Carlos registers on the web platform, imports active MLS listings via Excel sheet.",
          experience: "Smooth setup, instant list parsing, clear progress indicator.",
          painPoint: "Import format errors on column names."
        },
        {
          step: 2,
          stage: "Client Onboarding",
          action: "Agent enters client profile with specific filters: '3-bedroom, under $800k, Emerald Hills'.",
          experience: "The app instantly highlights 3 matching properties in a small notification bubble.",
          painPoint: "Client budget limitations are highly rigid."
        },
        {
          step: 3,
          stage: "Property Showing",
          action: " Carlos opens the matched property listing card on his mobile tablet inside the vacant home.",
          experience: "Presents details offline instantly, slides through high-res photo gallery, logs showing notes.",
          painPoint: "Cell signal drops inside concrete basements."
        },
        {
          step: 4,
          stage: "Deal Closure",
          action: "Client makes a verbal offer. Carlos opens the pipeline, drags lead to 'Offer Made', and prints contract.",
          experience: "The system generates a pre-filled contract document instantly and sends a secure signature link.",
          painPoint: "Drafting custom contingency clauses manually."
        }
      ]
    },
    informationArchitecture: {
      sections: [
        { title: "Primary Menu", items: ["Pipeline Board", "Property Listings", "Client Directory", "Deal Insights"] },
        { title: "Configuration Panel", items: ["MLS API Credentials", "Custom Fields", "Notification Rules", "Billing"] },
        { title: "Agent Console", items: ["My Commissions", "Showing Logbook", "Performance Leaderboard"] }
      ]
    },
    screenList: [
      { name: "Deals Pipeline Board", description: "A Kanban pipeline interface displaying leads categorized by stages: Discovery, Active Tour, Offer Made, Contract, Closed.", keyComponents: ["Stage swimlanes", "Deal cards with photo thumbnails", "Aggregated funnel value ticker", "Quick filter toggle"] },
      { name: "Listings Index Directory", description: "A fluid filterable catalog of all available homes, condos, and lands with geographic tags, pricing data, and matched buyers lists.", keyComponents: ["Live search box", "Multi-criteria filter panel", "Property detail slide-over"] },
      { name: "Client Matching Profile", description: "Detailed client workbook demonstrating matched listings ranked by algorithmic compatibility percentage.", keyComponents: ["Compatibility progress ring", "Direct share button", "Notes log thread"] }
    ],
    dashboardSuggestions: {
      layoutName: "Dynamic Workspace Board",
      elements: ["Collapsed collapsible sidebar navigation", " Funnel metrics overview bar", "Quick deal-add floating button", "Maturing contract alerts feed", "Integrated map thumbnail widget"],
      asciiWireframe: `
+-----------------------------------------------------------------------+
|  LOGO  | Search deals...                        (Favs) [Emily Vance]  |
+--------+--------------------------------------------------------------+
| [=] Board  |  FUNNEL VALUE: $14.2M          | [NEW CARD]  | [FILTERS]  |
|     List   +--------------------------------+-------------+------------+
|     Maps   |  LEAD IN (4)   | SHOWINGS (2)  | OFFER (1)   | CLOSED (6) |
|     Clients+----------------+---------------+-------------+------------+
|     Settings | + $740k      | + $1.1M       | + $850k     | + $12.3M   |
|            |                |               |             |            |
|            | [12 Spruce]    | [94 Oak Dr]   | [10 Hill]   | [Done: 40] |
|            | Emily V.       | Carlos R.     | Marc S.     | Jane K.    |
|            |                |               |             |            |
|            | [74 Pine Ct]   | [3 Redwood]   |             |            |
|            | Aaron B.       | Tyler P.      |             |            |
+------------+----------------+---------------+-------------+------------+
| Task Feed: (1) Sign Emily deposit   (2) Follow up on Spruce St deal    |
+-----------------------------------------------------------------------+
      `,
      description: "The pipeline board uses an adaptive grid model. Card blocks display high-contrast client statuses, property thumbnails, and quick action logs to ensure agents do not lose deal momentum."
    },
    screenByScreenUI: [
      {
        screenName: "Deals Pipeline Board",
        layout: "Full width grid displaying vertical stage columns, with custom background shading.",
        components: ["Deal Card", "Stage Totals Header", "Global Search Input", "Slide-over Deal Details Editor"],
        emptyState: "An empty board renders a placeholder guiding users to: 'Click [New Card] to add your first active buyer lead' with a demo dataset import option.",
        errorState: "A persistent banner at the top with a manual retry toggle reading: 'Database sync lost. Listings cached offline. Click to retry connection.'",
        loadingState: "Staggered card skeleton overlays reflecting pipeline count."
      }
    ],
    designSystem: {
      colors: [
        { name: "Brand Accent Blue", value: "#0ea5e9", use: "Buttons, pipeline highlights, matching metrics rings, and custom labels" },
        { name: "Neutral Slate Dark", value: "#0f172a", use: "Sidebars, container backgrounds, and primary layouts" },
        { name: "Canvas Midnight", value: "#09090b", use: "Deep layout backdrop canvas" },
        { name: "Success Emerald", value: "#10b981", use: "Active and closed deal indications" }
      ],
      typography: [
        { element: "Display Headers", font: "Inter", size: "30px (text-3xl)", weight: "Bold" },
        { element: "SaaS KPI Labels", font: "JetBrains Mono", size: "12px (text-xs)", weight: "Medium" },
        { element: "UI Controls", font: "Inter", size: "14px (text-sm)", weight: "Medium" }
      ],
      spacing: ["4px (xs)", "8px (sm)", "16px (md)", "24px (lg)", "32px (xl)"],
      borderRadius: ["4px (sm)", "8px (md)", "12px (lg)", "16px (xl)"],
      shadows: ["Subtle grid lines", "Hover floating cards", "Ambient modal blur overlays"],
      buttonStyles: "The buttons feature a solid custom background with an elegant scale shrink effect on click. Secondary buttons are styled with deep transparent outlines.",
      formStyles: "Input fields use dark translucent backdrops, a thin custom outline, and highlight the border instantly with Brand Accent Blue on focus.",
      cardStyles: "Cards leverage subtle slate borders with backdrop filter blurs, creating an aesthetic dark glassmorphism layout."
    },
    componentLibrary: [
      {
        component: "Pipeline Swimlane Column",
        recommendation: "A flex-col wrapper utilizing React-DND for drag handles.",
        implementationTips: "Store previous indexes during sorting to rollback gracefully if a network connection fails."
      },
      {
        component: "Listing Photo Slider",
        recommendation: "Lazy loaded image carousel with swipe feedback.",
        implementationTips: "Pre-fetch adjacent pictures on hover to guarantee immediate rendering."
      }
    ],
    accessibilityAudit: {
      contrast: "The primary blue accent (#0ea5e9) achieves a contrast ratio of 4.6:1 against the canvas black, exceeding WCAG 2.1 AA benchmarks.",
      keyboard: "Supports tab sequencing across pipeline swimlanes; cards can be shifted across pipeline stages via Shift + Left/Right arrow commands.",
      screenReader: "Labels explicitly announce deal stages, pricing values, and matched Listings counts.",
      focusState: "Visible high-contrast neon borders around focused text inputs.",
      mobileUsability: "All deal blocks have a minimum height of 52px to prevent mistaps during active field tours."
    },
    responsiveDesign: {
      mobile: "Collapses swimlanes into a swipable tab carousel showing one column stage at a time (e.g., 'Discovery', 'Showings').",
      tablet: "Shows three active columns on screen, collapsing the primary menu into a slim, persistent icon sidebar.",
      desktop: "Full five-stage board rendering with an expanded, fully detailed collapsible menu panel."
    },
    databaseSuggestions: {
      entities: [
        {
          name: "Deals",
          fields: [
            { name: "id", type: "UUID", description: "Unique deal ID (Primary Key)" },
            { name: "agent_id", type: "UUID", description: "Foreign Key referencing Agents" },
            { name: "stage", type: "VARCHAR(50)", description: "Pipeline stage (Discovery, Offering, etc.)" },
            { name: "estimated_value", type: "DECIMAL(12,2)", description: "Target commission deal value" }
          ]
        },
        {
          name: "Clients",
          fields: [
            { name: "id", type: "UUID", description: "Unique client ID" },
            { name: "name", type: "VARCHAR(255)", description: "Client full name" },
            { name: "preferences_json", type: "JSONB", description: "Serialized search criteria" }
          ]
        }
      ],
      relationships: [
        "An Agent handles multiple Deals (one-to-many relationship)",
        "A Client can have multiple Deal entries associated with active purchase attempts (one-to-many)"
      ]
    },
    apiSuggestions: [
      {
        endpoint: "/api/v1/deals",
        method: "GET",
        description: "Fetch list of all active deals managed by the authenticated agent, grouped by stage.",
        response: "[ { \"stage\": \"Discovery\", \"deals\": [ ... ] } ]"
      },
      {
        endpoint: "/api/v1/deals/:id/stage",
        method: "PUT",
        description: "Modify a deal's stage following pipeline drag events.",
        requestBody: "{ \"stage\": \"Offering\" }",
        response: "{ \"id\": \"deal-123\", \"stage\": \"Offering\", \"status\": \"updated\" }"
      }
    ],
    folderStructure: `
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── pipeline/
│   │   ├── PipelineBoard.tsx
│   │   ├── Column.tsx
│   │   └── DealCard.tsx
│   └── listings/
│       └── ListingSlider.tsx
├── hooks/
│   └── useOfflineStorage.ts
├── pages/
│   ├── Pipeline.tsx
│   └── Listings.tsx
├── App.tsx
└── main.tsx
    `,
    techStack: [
      { category: "Frontend Framework", technology: "React (Vite) + Tailwind CSS", reason: "React facilitates ultra-fast client state renders; Tailwind CSS compiles custom color states without CSS bloating." },
      { category: "Backend Runtime", technology: "Node.js (Express)", reason: "Lightweight routing engine optimized for microservices and direct JSON data output." },
      { category: "Database engine", technology: "PostgreSQL (with JSONB)", reason: "PostgreSQL provides standard ACID safety for transactions; JSONB handles dynamic client filters queryable in real-time." }
    ],
    developmentRoadmap: [
      {
        phase: "Phase 1: Foundation & Modeling",
        duration: "2 Weeks",
        milestones: ["Initialize workspace repository", "Establish PostgreSQL schemas and relations", "Generate baseline layouts"]
      },
      {
        phase: "Phase 2: Offline Board engine",
        duration: "3 Weeks",
        milestones: ["Implement IndexedDB pipelines matching local state", "Configure drag and drop interactions", "Integrate MLS listing sheets"]
      }
    ],
    aiPrompts: {
      gemini: "Develop a premium React component called PipelineBoard inside '/src/components/pipeline'. The component should use Tailwind CSS, render vertical stage columns dynamically from a structured list, and handle custom deal item click previews. Embed a monospaced total price value ticker at the top of each column.",
      chatgpt: "Write an Express backend router that updates property deal pipelines, parses custom JSON values safely, and triggers a webhook notification on deal closure.",
      cursor: "Configure a custom hook called useOfflineSync that monitors window online states, queues pending database edits, and plays back updates in order when connection is restored.",
      claude: "Implement a Tailwind design system setup based on Slate Dark canvas background and Neon Accent Blue highlights.",
      bolt: "Create a fully functional Real Estate Pipeline applet with list views, card drag triggers, and custom filters.",
      lovable: "Create a sleek real estate CRM CRM with search-on-map features and a drag-and-drop client pipeline.",
      v0: "Design a luxury Real Estate Dashboard with a dark mode color palette, a modern navigation drawer, and animated charts."
    }
  },
  {
    id: "sample-fitness-app",
    createdAt: "2026-07-13T07:18:02-07:00",
    idea: "A fitness tracking companion tailored specifically for beginner runners who want to train without injury",
    targetAudience: "Adult beginners, casual jogging enthusiasts",
    platform: "Mobile",
    industry: "Fitness",
    designStyle: "Minimalist",
    brandColors: {
      primary: "#10b981",
      secondary: "#064e3b",
      hexCodes: ["#10b981", "#064e3b", "#09090b", "#ffffff"]
    },
    aiModel: "gemini-3.5-flash",
    isFavorite: false,
    productSummary: {
      overview: "StepWise is a minimalist mobile-first fitness tracking companion focused on low-injury aerobic volume. Instead of pushing for high mileage, the app measures physical exertion, cadence tempos, and cardiovascular recovery times.",
      problemStatement: "Starting runners quit within 3 weeks due to early fatigue, injuries, or demotivating data metrics from premium competitive apps.",
      targetUsers: [
        "People recovering from minor injuries",
        "Sedentary adults starting aerobic runs",
        "Elderly individuals seeking cardiovascular health tracking"
      ],
      valueProposition: "Guided heart-rate-zone run-walk loops tailored automatically based on your initial cardiovascular output tests."
    },
    features: {
      mustHave: [
        "Injury prevention coach (automated alerts on fast speed pacing)",
        "Live run-walk sequence audio prompt cues",
        "Simple heart rate zones color bar tracker",
        "Recovery timers showing optimal next run days"
      ],
      niceToHave: [
        "Local weather integration to recommend run garments",
        "Spotify playlist sync pacing with foot strikes (cadence lock)",
        "Daily streak tracking showing total consecutive active weeks"
      ],
      futureFeatures: [
        "Camera-based running gait posture analysis with instant voice tips",
        "Augmented Reality routes overlay on active glasses",
        "Interactive virtual group challenges with automated pace balance"
      ]
    },
    personas: [
      {
        name: "Marcus Vance",
        role: "Office Clerk",
        goals: [
          "Establish an aerobic routine of 3 weekly runs",
          "Lose 15 pounds safely without knee flareups",
          "Understand confusing workout charts"
        ],
        painPoints: [
          "Exhaustion after running for just 5 minutes",
          "Overtraining leading to leg pain and shin splints",
          "Competitive fitness apps that feel intimidating"
        ],
        techExp: "Novice with widgets and sensors",
        workflow: [
          "Tries jogging in the park occasionally",
          "Pushes to keep up with faster runners",
          "Gets winded and stops, walks home demotivated"
        ]
      }
    ],
    userJourney: {
      steps: [
        {
          step: 1,
          stage: "Account Creation",
          action: "Marcus downloads StepWise, sets goal to: 'Build endurance safely'.",
          experience: "Warm onboarding flow, asks for weight and knee health status.",
          painPoint: "Fears entering incorrect details."
        },
        {
          step: 2,
          stage: "Initial Pace Test",
          action: "Marcus starts a simple 10-minute jog-walk test.",
          experience: "Audio assistant guides pacing, discouraging Marcus from running too fast.",
          painPoint: "Wants to run faster than advised."
        },
        {
          step: 3,
          stage: "Post-Run Diagnostics",
          action: "Marcus finishes test, receives simple 'Aero Score' and recovery guide.",
          experience: "Highly encouraging design showing how heart settled back to base.",
          painPoint: "Seeks instant validation statistics."
        },
        {
          step: 4,
          stage: "Habit Loop",
          action: "Marcus gets a quiet notification 48 hours later: 'Recovery complete. Ideal conditions for an easy 15-min walk-jog.'",
          experience: "Apprehensive but completes run easily without feeling tired.",
          painPoint: "Balancing time during rainy days."
        }
      ]
    },
    informationArchitecture: {
      sections: [
        { title: "Active Companion", items: ["Exertion Meter", "Audio Coach Config", "Route Map Drawer"] },
        { title: "History Hub", items: ["Weekly Recovery Diary", "Aero Progress Metrics"] }
      ]
    },
    screenList: [
      { name: "Active Exertion Companion", description: "Minimal full screen runner HUD featuring large dynamic numbers showing active pace status, heart rate zones, and a progress line.", keyComponents: ["Heart zone color indicator", "Audio cue volume switch", "Exertion value timer"] },
      { name: "Recovery Calendar Log", description: "Clean timeline view displaying previous runs and showing next recovery completions.", keyComponents: ["Optimal day blocks", "Encouragement badges"] }
    ],
    dashboardSuggestions: {
      layoutName: "Minimal Athlete HUD",
      elements: ["Exertion scale arc", "Cadence ticker", "Current pace metric card", "Warm audio coach dialer"],
      asciiWireframe: `
+-------------------------------------------------------------+
| (Profile)                  StepWise              [Calendar] |
+-------------------------------------------------------------+
|                                                             |
|                    EXERTION ZONE: EASY                      |
|                  +---------------------+                    |
|                  |     64% AEROBIC     |                    |
|                  +---------------------+                    |
|                        Optimal Zone                         |
|                                                             |
|           SPEED                    HEART RATE               |
|         +----------+              +----------+              |
|         | 6'45\" /km|              | 134 bpm  |              |
|         +----------+              +----------+              |
|                                                             |
|  [ AUDIO COACH ACTIVE ]  -  \"Maintain short relaxed strides\" |
|                                                             |
|                     +-----------------+                     |
|                     |   || PAUSE RUN  |                     |
|                     +-----------------+                     |
+-------------------------------------------------------------+
      `,
      description: "A gorgeous single-screen athlete console displaying large digital figures with sufficient space to ensure readability under continuous physical bounce."
    },
    screenByScreenUI: [
      {
        screenName: "Active Runner Console",
        layout: "Vertical flex layout with deep emerald highlights and giant numeric readouts.",
        components: ["Exertion Ring Widget", "Pause Button", "Audio Coach Status Line"],
        emptyState: "Renders: 'No active workouts. Tap Start Run below to begin.'",
        errorState: "Renders: 'GPS connection weak. Finding coordinate lock... Run data will still log.'",
        loadingState: "Minimal pulse background animation."
      }
    ],
    designSystem: {
      colors: [
        { name: "Vitality Green", value: "#10b981", use: "Buttons, healthy cardiovascular zones, and recovery progress tracks" },
        { name: "Forest Base Dark", value: "#064e3b", use: "Card container highlights and premium badges" },
        { name: "Slate Backing Canvas", value: "#09090b", use: "Body backgrounds" }
      ],
      typography: [
        { element: "Giant Metric Headings", font: "Space Grotesk", size: "48px", weight: "Bold" },
        { element: "General UI", font: "Inter", size: "14px", weight: "Medium" }
      ],
      spacing: ["4px (xs)", "8px (sm)", "16px (md)", "24px (lg)"],
      borderRadius: ["8px (md)", "16px (lg)", "999px (full)"],
      shadows: ["Subtle ambient green back glows"],
      buttonStyles: "The buttons feature a capsule circular pill-shape with high-contrast text and a rich green drop shadow.",
      formStyles: "Minimal input lines with no borders, animating with a vertical focus stroke on interaction.",
      cardStyles: "Deep forest cards with a soft outline and ambient green backlighting."
    },
    componentLibrary: [
      {
        component: "Cardio Exertion Ring",
        recommendation: "A custom SVG circle container dynamically scaling stroke-dasharray properties.",
        implementationTips: "Interpolate value changes to prevent sudden needle bouncing on client updates."
      }
    ],
    accessibilityAudit: {
      contrast: "Exertion zones are supported by textual descriptions ('EASY', 'PEAK') to support color-blind users who may not resolve the color status.",
      keyboard: "Supports keyboard action mapping for pausing runs on computer simulations.",
      screenReader: "Voiceover outputs heart rate values and pacing cutes every 60 seconds.",
      focusState: "Pill inputs glow emerald on focus.",
      mobileUsability: "Start/Pause triggers feature a diameter of 64px, enabling rapid screen taps while active."
    },
    responsiveDesign: {
      mobile: "Standard display HUD optimized for one-hand palm operations.",
      tablet: "Splits screen into live metrics on left, route path maps on right.",
      desktop: "Renders summary statistics dashboards with custom line charts."
    },
    databaseSuggestions: {
      entities: [
        {
          name: "Workouts",
          fields: [
            { name: "id", type: "UUID", description: "Primary Key" },
            { name: "cadence_average", type: "INTEGER", description: "Steps per minute average" },
            { name: "duration_seconds", type: "INTEGER", description: "Run length in seconds" }
          ]
        }
      ],
      relationships: ["A User logs multiple Workouts."]
    },
    apiSuggestions: [
      {
        endpoint: "/api/v1/runs",
        method: "POST",
        description: "Log completed run details to update local aerobic thresholds.",
        requestBody: "{ \"duration\": 900, \"average_hr\": 135 }",
        response: "{ \"workout_id\": \"run-456\", \"streak_active\": true }"
      }
    ],
    folderStructure: `
src/
├── components/
│   ├── RunHud.tsx
│   └── ExertionRing.tsx
├── hooks/
│   └── useGpsLogger.ts
└── App.tsx
    `,
    techStack: [
      { category: "Frontend", technology: "React Native (Expo)", reason: "Enables single-codebase compiling to iOS and Android, critical for mobile consumer fitness utilities." },
      { category: "Database", technology: "SQLite", reason: "Zero-latency local client storage suitable for runs in wilderness areas with weak networks." }
    ],
    developmentRoadmap: [
      {
        phase: "Phase 1: Basic HUD",
        duration: "2 Weeks",
        milestones: ["Build exertion ring vector maps", "Configure audio trigger cues"]
      }
    ],
    aiPrompts: {
      gemini: "Create an exertion HUD widget showing a giant cadence scale, using green and forest color palettes.",
      chatgpt: "Write an SQLite migration that handles calorie tables and recovery calendars.",
      cursor: "Configure geolocation background coordinates logging hook.",
      claude: "Set up a workout tracker dashboard inside a minimalist frame.",
      bolt: "Build a running companion that records heart rates and plays metronome cadence ticks.",
      lovable: "Design a clean jogging companion with run-walk cue prompts.",
      v0: "Create a modern, sleek athlete screen with green health charts."
    }
  }
];
