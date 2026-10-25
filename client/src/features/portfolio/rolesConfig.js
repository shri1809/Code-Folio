/**
 * Exhaustive Directory of Professional Roles & Portfolio Taxonomy
 * 4 Core Categories | 38 Specialized Roles | 10 Layout Archetypes
 */

export const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'tech-product', label: 'Tech & Digital Product' },
  { id: 'visual-creative', label: 'Visual & Creative Arts' },
  { id: 'media-lifestyle', label: 'Media & Lifestyle' },
  { id: 'writing-marketing', label: 'Writing & Strategy' },
];

export const ARCHETYPES = {
  CODE_ARCHITECTURE: 'code-architecture',
  DEVICE_MOCKUP: 'device-mockup',
  DATA_ANALYTICS: 'data-analytics',
  CASE_STUDY: 'case-study',
  VISUAL_MASONRY: 'visual-masonry',
  VIDEO_SHOWREEL: 'video-showreel',
  BEFORE_AFTER: 'before-after',
  EDITORIAL: 'editorial',
  TECHNICAL_DOCS: 'technical-docs',
  MARKETING_KPI: 'marketing-kpi',
};

export const ROLES = [
  // ==========================================
  // 1. TECH & DIGITAL PRODUCT DEVELOPMENT
  // ==========================================
  {
    id: 'backend-engineer',
    title: 'Backend Software Engineer',
    category: 'tech-product',
    archetype: ARCHETYPES.CODE_ARCHITECTURE,
    badge: 'Systems & Cloud',
    strategy: 'Clean, performance-focused layout with database schemas, API specs, and public git repositories.',
    sampleData: {
      profile: {
        name: 'David Chen',
        bio: 'Distributed systems architect & Go/Rust engineer building high-throughput microservices and event-driven data pipelines.',
        socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com', twitter: '' },
      },
      skills: {
        frontend: ['GraphQL', 'gRPC-Web'],
        backend: ['Go', 'Rust', 'PostgreSQL', 'Redis', 'Kafka', 'Node.js'],
        devops: ['Kubernetes', 'Docker', 'Terraform', 'Prometheus', 'AWS'],
      },
      projects: [
        {
          title: 'Distributed Event Broker',
          description: 'High-throughput Kafka-compatible event log handling 500k req/sec with zero packet drop.',
          techStack: ['Go', 'Raft Consensus', 'RocksDB', 'gRPC'],
          repoLink: 'https://github.com',
          liveLink: 'https://metrics.codefolio.dev',
          screenshot: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        },
        {
          title: 'Edge Cache Proxy Engine',
          description: 'Custom reverse-proxy caching layer deployed at 35 global edge points, reducing latency by 72%.',
          techStack: ['Rust', 'Tokio', 'eBPF', 'Linux'],
          repoLink: 'https://github.com',
          liveLink: '',
          screenshot: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Web Developer',
    category: 'tech-product',
    archetype: ARCHETYPES.CODE_ARCHITECTURE,
    badge: 'UI & State',
    strategy: 'Rich presentation layer showcasing interactive states, smooth transitions, and design systems.',
    sampleData: {
      profile: {
        name: 'Elena Rostova',
        bio: 'Senior Frontend Engineer crafting fluid web applications with React, TypeScript, micro-frontends, and accessible design systems.',
        socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com', website: 'https://elena.dev' },
      },
      skills: {
        frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'WebAssembly'],
        backend: ['Node.js', 'Express', 'GraphQL'],
        devops: ['Vercel', 'CI/CD', 'Lighthouse Optimization'],
      },
      projects: [
        {
          title: 'Fluid Design System Core',
          description: 'Enterprise component library supporting 50+ WCAG AAA compliant tokens and zero-runtime CSS.',
          techStack: ['TypeScript', 'React', 'Tailwind', 'Storybook'],
          repoLink: 'https://github.com',
          liveLink: 'https://demo.dev',
          screenshot: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'fullstack-developer',
    title: 'Full-Stack Developer',
    category: 'tech-product',
    archetype: ARCHETYPES.CODE_ARCHITECTURE,
    badge: 'End-to-End',
    strategy: 'Hybrid architecture featuring dashboard previews, interactive data flows, and endpoint docs.',
    sampleData: {
      profile: {
        name: 'Alex Rivera',
        bio: 'Full-stack builder shipping scalable SaaS products from zero to production. Passionate about minimalism and velocity.',
        socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
        backend: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'],
        devops: ['Docker', 'AWS', 'GitHub Actions'],
      },
      projects: [
        {
          title: 'CloudMetric SaaS Dashboard',
          description: 'Real-time telemetry aggregator with WebSocket streaming and automated alerting.',
          techStack: ['React', 'Node.js', 'MongoDB', 'Docker'],
          repoLink: 'https://github.com',
          liveLink: 'https://cloudmetric.dev',
          screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'mobile-developer',
    title: 'Mobile App Developer (iOS / Android)',
    category: 'tech-product',
    archetype: ARCHETYPES.DEVICE_MOCKUP,
    badge: 'Mobile & Device',
    strategy: 'Native phone frame mockups displaying live app screens, touch workflows, and store badges.',
    sampleData: {
      profile: {
        name: 'Marcus Vance',
        bio: 'Mobile Software Engineer specializing in SwiftUI and Kotlin Multiplatform. 4+ apps featured on the Apple App Store and Google Play Store.',
        socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com', website: 'https://marcus.app' },
      },
      skills: {
        frontend: ['SwiftUI', 'UIKit', 'Kotlin', 'Jetpack Compose', 'Flutter', 'React Native'],
        backend: ['Firebase', 'GraphQL', 'REST APIs', 'SQLite', 'Room DB'],
        devops: ['Fastlane', 'TestFlight', 'App Store Connect', 'Google Play Console', 'CI/CD'],
      },
      projects: [
        {
          title: 'ZenPulse Meditation iOS',
          description: 'Haptic-driven wellness application with offline biometric sync and Apple HealthKit integration.',
          techStack: ['SwiftUI', 'CoreData', 'HealthKit', 'Combine'],
          repoLink: 'https://github.com',
          liveLink: 'https://apps.apple.com',
          appStoreLink: 'https://apps.apple.com/app/zenpulse-meditation',
          playStoreLink: '',
          screenshot: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
        },
        {
          title: 'CryptoTracker Android',
          description: 'Material 3 cryptocurrency ledger with live WebSocket ticker feeds and home widgets.',
          techStack: ['Kotlin', 'Jetpack Compose', 'Coroutines', 'Retrofit'],
          repoLink: 'https://github.com',
          liveLink: 'https://play.google.com',
          appStoreLink: '',
          playStoreLink: 'https://play.google.com/store/apps/details?id=com.cryptotracker.app',
          screenshot: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
        },
        {
          title: 'PulseFit Multiplatform',
          description: 'Cross-platform telemetry fitness tracker syncing real-time workout stats across iOS and Android.',
          techStack: ['Flutter', 'Dart', 'Firebase', 'HealthConnect'],
          repoLink: 'https://github.com',
          liveLink: 'https://pulsefit.app',
          appStoreLink: 'https://apps.apple.com/app/pulsefit-tracker',
          playStoreLink: 'https://play.google.com/store/apps/details?id=com.pulsefit.tracker',
          screenshot: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist & Analytics Engineer',
    category: 'tech-product',
    archetype: ARCHETYPES.DATA_ANALYTICS,
    badge: 'AI & Statistics',
    strategy: 'Notebook-style case studies, statistical graph models, ML metrics, and Python/SQL configurations.',
    sampleData: {
      profile: {
        name: 'Dr. Priya Sharma',
        bio: 'Lead Data Scientist specializing in predictive modeling, NLP pipelines, and automated customer lifetime value intelligence.',
        socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Streamlit', 'Plotly', 'D3.js', 'Jupyter'],
        backend: ['Python', 'SQL', 'PyTorch', 'scikit-learn', 'Pandas'],
        devops: ['Databricks', 'BigQuery', 'MLflow', 'Docker', 'AWS'],
      },
      projects: [
        {
          title: 'Customer Churn Neural Predictor',
          description: 'Deep neural network trained on 10M records predicting subscription churn with 94.6% AUC-ROC.',
          techStack: ['Python', 'PyTorch', 'BigQuery', 'MLflow'],
          repoLink: 'https://github.com',
          liveLink: 'https://kaggle.com',
          screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'devops-engineer',
    title: 'DevOps & Cloud Infrastructure Engineer',
    category: 'tech-product',
    archetype: ARCHETYPES.CODE_ARCHITECTURE,
    badge: 'Cloud & SRE',
    strategy: 'Technical flowchart grids, cloud uptime statistics, automation pipelines, and IaC scripts.',
    sampleData: {
      profile: {
        name: 'Liam O’Connor',
        bio: 'Staff SRE & Platform Engineer. Architecting zero-downtime multi-region Kubernetes clusters with GitOps and Terraform.',
        socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Grafana', 'Kibana'],
        backend: ['Go', 'Python', 'Bash'],
        devops: ['Kubernetes', 'Terraform', 'ArgoCD', 'AWS', 'GCP', 'Ansible'],
      },
      projects: [
        {
          title: 'Multi-Region Kubernetes Mesh',
          description: 'Zero-trust Istio service mesh across 3 AWS regions with automated failover in under 12 seconds.',
          techStack: ['Kubernetes', 'Istio', 'Terraform', 'ArgoCD'],
          repoLink: 'https://github.com',
          liveLink: 'https://status.devops.io',
          screenshot: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'uiux-designer',
    title: 'UI/UX Designer',
    category: 'tech-product',
    archetype: ARCHETYPES.CASE_STUDY,
    badge: 'Design System',
    strategy: 'Multi-column presentation tracking user research, wireframing, high-fidelity mockups, and prototypes.',
    sampleData: {
      profile: {
        name: 'Maya Lin',
        bio: 'Principal Product Designer creating intuitive digital experiences for fintech and enterprise productivity tools.',
        socialLinks: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
      },
      skills: {
        frontend: ['Figma', 'Protopie', 'Design Systems', 'User Research', 'Wireframing', 'WCAG 2.1'],
        backend: ['Information Architecture', 'User Journey Mapping'],
        devops: ['Design Tokens', 'Storybook Integration'],
      },
      projects: [
        {
          title: 'FinPay: Global Remittance Redesign',
          description: 'End-to-end design overhaul reducing checkout friction by 38% for over 2 million monthly active users.',
          techStack: ['Figma', 'User Research', 'Design Systems', 'Interactive Prototyping'],
          repoLink: '',
          liveLink: 'https://figma.com',
          screenshot: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'product-designer',
    title: 'Product Designer (Digital)',
    category: 'tech-product',
    archetype: ARCHETYPES.CASE_STUDY,
    badge: 'Product & UX',
    strategy: 'Overview layouts focusing on business problem statements, product lifecycles, and ROI metrics.',
    sampleData: {
      profile: {
        name: 'Jordan Reed',
        bio: 'Digital Product Designer aligning customer needs with scalable business models. 7+ years in B2B SaaS product design.',
        socialLinks: { linkedin: 'https://linkedin.com', twitter: '' },
      },
      skills: {
        frontend: ['Figma', 'Whimsical', 'Design Thinking', 'Rapid Prototyping'],
        backend: ['Product Analytics', 'A/B Testing Frameworks'],
        devops: ['Agile Workflows', 'Design-to-Dev Handoff'],
      },
      projects: [
        {
          title: 'SaaS Onboarding Optimization',
          description: 'Revamped self-serve user activation flow, unlocking a +44% lift in Day-7 user retention.',
          techStack: ['Figma', 'Mixpanel', 'Heuristic Evaluation'],
          repoLink: '',
          liveLink: 'https://figma.com',
          screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'interaction-designer',
    title: 'Interaction Designer',
    category: 'tech-product',
    archetype: ARCHETYPES.DEVICE_MOCKUP,
    badge: 'Micro-Interactions',
    strategy: 'Video-first grid layouts supporting looping clips of animation triggers, touch gestures, and UI physics.',
    sampleData: {
      profile: {
        name: 'Chloe Monet',
        bio: 'Interaction Designer exploring dynamic physics, touch gestures, and delightful spatial micro-interactions.',
        socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Principle', 'After Effects', 'Framer', 'Three.js', 'CSS Physics'],
        backend: ['Gestural Logic', 'Haptic Feedback Engines'],
        devops: ['Lottie Animations', 'SVG Physics'],
      },
      projects: [
        {
          title: 'Fluid Gestural Navigation',
          description: 'Experimental mobile swipe-physics engine mimicking real fluid resistance on iOS and Android.',
          techStack: ['Framer', 'SwiftUI', 'Spring Physics'],
          repoLink: 'https://github.com',
          liveLink: 'https://framer.com',
          screenshot: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'info-architect',
    title: 'Information Architect',
    category: 'tech-product',
    archetype: ARCHETYPES.TECHNICAL_DOCS,
    badge: 'Taxonomy & Maps',
    strategy: 'Organized configurations built for data flows, tree maps, deep sitemap visualizations, and relational schemes.',
    sampleData: {
      profile: {
        name: 'Arthur Pendelton',
        bio: 'Information Architect organizing sprawling enterprise knowledge bases into clear, navigable taxonomies.',
        socialLinks: { linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Miro', 'OmniGraffle', 'Lucidchart', 'Card Sorting'],
        backend: ['Taxonomy Modeling', 'Content Strategy', 'Knowledge Graphs'],
        devops: ['Search Index Architecture'],
      },
      projects: [
        {
          title: 'Healthcare System Sitemap Redesign',
          description: 'Unified 12,000 legacy hospital clinical pages into an intuitive 4-tier faceted navigation schema.',
          techStack: ['Card Sorting', 'Taxonomy Matrix', 'Tree Testing'],
          repoLink: '',
          liveLink: '',
          screenshot: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        },
      ],
    },
  },

  // ==========================================
  // 2. VISUAL COMMUNICATION & CREATIVE ARTS
  // ==========================================
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    category: 'visual-creative',
    archetype: ARCHETYPES.VISUAL_MASONRY,
    badge: 'Print & Vector',
    strategy: 'Multi-column asset galleries with lightboxes displaying print files, branding guidelines, and packaging concepts.',
    sampleData: {
      profile: {
        name: 'Sofia Alva',
        bio: 'Graphic Designer & Visual Artist creating bold editorial prints, brand posters, and typographic installations.',
        socialLinks: { website: 'https://sofia.design', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Adobe Illustrator', 'InDesign', 'Photoshop', 'Typography', 'Print Production'],
        backend: ['Vector Systems', 'Color Theory'],
        devops: ['Prepress Specs', 'Packaging Dielines'],
      },
      projects: [
        {
          title: 'Berlin Jazz Festival 2026',
          description: 'Complete poster series and visual identity program printed via 5-color offset lithography.',
          techStack: ['Illustrator', 'InDesign', 'Screen Printing'],
          repoLink: '',
          liveLink: 'https://behance.net',
          screenshot: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'brand-designer',
    title: 'Brand Identity Designer',
    category: 'visual-creative',
    archetype: ARCHETYPES.BEFORE_AFTER,
    badge: 'Identity & Logos',
    strategy: 'Comparative horizontal layouts displaying logo systems across diverse formats with typography details.',
    sampleData: {
      profile: {
        name: 'Julian Sterling',
        bio: 'Brand Identity Designer sculpting timeless visual emblems, wordmarks, and cohesive brand systems for global tech leaders.',
        socialLinks: { website: 'https://sterling.design', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Logo Design', 'Typography', 'Brand Guidelines', 'Collateral Mockups'],
        backend: ['Brand Strategy', 'Visual Identity Architecture'],
        devops: ['Asset Library Management'],
      },
      projects: [
        {
          title: 'Aura Electric Mobility',
          description: 'Comprehensive brand identity program including logo mark, custom typeface, vehicle livery, and digital UI kit.',
          techStack: ['Brand Identity', 'Custom Typography', 'Vector Guidelines'],
          repoLink: '',
          liveLink: 'https://behance.net',
          screenshot: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'motion-designer',
    title: 'Motion Graphics Designer',
    category: 'visual-creative',
    archetype: ARCHETYPES.VIDEO_SHOWREEL,
    badge: 'Motion & FX',
    strategy: 'Dark-themed grid hosting auto-playing background showreels, dynamic typography, and visual effects.',
    sampleData: {
      profile: {
        name: 'Kai Takahashi',
        bio: 'Motion Designer & 3D Animator bringing kinetic typography, commercial title sequences, and abstract visual effects to life.',
        socialLinks: { website: 'https://kai.motion', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['After Effects', 'Cinema 4D', 'Octane Render', 'Houdini', 'Blender'],
        backend: ['Kinetic Typography', 'VFX Compositing'],
        devops: ['Render Farm Automation'],
      },
      projects: [
        {
          title: 'Cyberpunk 2088 Title Sequence',
          description: '2-minute cinematic title sequence mixing 3D procedural geometries with rhythmic kinetic typography.',
          techStack: ['Cinema 4D', 'After Effects', 'Octane'],
          repoLink: '',
          liveLink: 'https://vimeo.com',
          screenshot: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'packaging-designer',
    title: 'Packaging Designer',
    category: 'visual-creative',
    archetype: ARCHETYPES.BEFORE_AFTER,
    badge: '3D Packaging',
    strategy: '3D block mockups showcasing dieline assets, structural material sheets, and physical spatial rendering angles.',
    sampleData: {
      profile: {
        name: 'Camille Dupont',
        bio: 'Industrial Packaging Designer creating sustainable, structural packaging for luxury fragrances, cosmetics, and fine foods.',
        socialLinks: { website: 'https://camille.design' },
      },
      skills: {
        frontend: ['Structural Dielines', 'ArtiosCAD', 'KeyShot', 'Illustrator', 'Material Sourcing'],
        backend: ['Sustainable Fiber Engineering', 'Embossing & Foil Prepress'],
        devops: ['Manufacturing Compliance'],
      },
      projects: [
        {
          title: 'Botanique Organic Cosmetics',
          description: '100% biodegradable zero-glue packaging solution with debossed foil lettering and custom molded pulp tray.',
          techStack: ['ArtiosCAD', 'KeyShot 3D', 'Illustrator'],
          repoLink: '',
          liveLink: '',
          screenshot: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'concept-artist',
    title: 'Concept Artist & Illustrator',
    category: 'visual-creative',
    archetype: ARCHETYPES.VISUAL_MASONRY,
    badge: 'World Building',
    strategy: 'Immersive full-bleed image grids or sliders with macro-zoom tools, organized into environment and character collections.',
    sampleData: {
      profile: {
        name: 'Valerie Frost',
        bio: 'Senior Concept Artist for AAA game studios. Specialized in sci-fi world building, hard-surface mechs, and alien environments.',
        socialLinks: { website: 'https://artstation.com' },
      },
      skills: {
        frontend: ['Photoshop', 'Blender', 'Procreate', 'ZBrush', 'Matte Painting'],
        backend: ['Visual Worldbuilding', 'Atmospheric Lighting'],
        devops: ['Concept Pipeline Handoff'],
      },
      projects: [
        {
          title: 'Orbital Station Citadel',
          description: 'Keyframe concept art establishing the mood, scale, and lighting for an upcoming Unreal Engine 5 title.',
          techStack: ['Photoshop', 'Blender', 'Photobashing'],
          repoLink: '',
          liveLink: 'https://artstation.com',
          screenshot: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'animator',
    title: '2D / 3D Animator',
    category: 'visual-creative',
    archetype: ARCHETYPES.VIDEO_SHOWREEL,
    badge: 'Character Motion',
    strategy: 'Video-centric showreel at the top header, followed by breakdown sheets tracking asset wireframes and rigging frames.',
    sampleData: {
      profile: {
        name: 'Tariq Hassan',
        bio: 'Character Animator & Rigging Specialist with 9+ years creating organic creature animations for feature films and game cinematics.',
        socialLinks: { website: 'https://vimeo.com', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Maya', 'Blender', 'Toon Boom Harmony', 'Character Rigging', 'Weight Painting'],
        backend: ['Keyframe Pacing', 'Physics Simulation'],
        devops: ['Unreal Engine Sequencer'],
      },
      projects: [
        {
          title: 'Mythic Beast Animation Reel',
          description: 'Quadruped run cycles and facial performance capture breakdowns for fantasy cinematic.',
          techStack: ['Autodesk Maya', 'ZBrush', 'Unreal Engine 5'],
          repoLink: '',
          liveLink: 'https://vimeo.com',
          screenshot: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
        },
      ],
    },
  },
  {
    id: '3d-artist',
    title: '3D Environment & Character Artist',
    category: 'visual-creative',
    archetype: ARCHETYPES.BEFORE_AFTER,
    badge: 'Sculpt & Render',
    strategy: 'Split-screen carousel modules contrasting clay wireframes, material textures, lighting models, and engine output.',
    sampleData: {
      profile: {
        name: 'Dmitri Volkov',
        bio: 'Lead 3D Environment Artist sculpting high-fidelity realtime props, foliage ecosystems, and modular architectural kits.',
        socialLinks: { website: 'https://artstation.com' },
      },
      skills: {
        frontend: ['ZBrush', 'Substance Painter', 'Blender', 'Unreal Engine 5', 'Marmoset Toolbag'],
        backend: ['PBR Texturing', 'Nanite Geometry', 'Lumen Lighting'],
        devops: ['Game Asset Optimization'],
      },
      projects: [
        {
          title: 'Post-Apocalyptic Subway Station',
          description: 'Modular AAA game environment asset pack featuring 85 custom PBR textured props and dynamic volumetric fog.',
          techStack: ['Unreal Engine 5', 'Substance Painter', 'ZBrush'],
          repoLink: '',
          liveLink: 'https://artstation.com',
          screenshot: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'game-designer',
    title: 'Game Designer',
    category: 'visual-creative',
    archetype: ARCHETYPES.CODE_ARCHITECTURE,
    badge: 'Rules & Levels',
    strategy: 'Narrative system layout breaking down rule mechanics, design level flow maps, balance sheets, and browser demos.',
    sampleData: {
      profile: {
        name: 'Rachel Kim',
        bio: 'System & Level Designer creating gripping roguelike loops, combat balancing models, and emergent game mechanics.',
        socialLinks: { github: 'https://github.com', website: 'https://itch.io' },
      },
      skills: {
        frontend: ['Unity', 'C#', 'Unreal Blueprints', 'Level Blockout', 'Machinations.io'],
        backend: ['Economy Balancing', 'Combat Math'],
        devops: ['Git LFS', 'Playtesting Telemetry'],
      },
      projects: [
        {
          title: 'ChronoDungeon Roguelike',
          description: 'Turn-based tactical crawler with deterministic deck-building mechanics and procedural room generation.',
          techStack: ['Unity', 'C#', 'Procedural Generation'],
          repoLink: 'https://github.com',
          liveLink: 'https://itch.io',
          screenshot: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'storyboard-artist',
    title: 'Storyboard Artist',
    category: 'visual-creative',
    archetype: ARCHETYPES.VISUAL_MASONRY,
    badge: 'Sequential Art',
    strategy: 'Linear, sliding sequence rows mimicking comic grid rows, enabling recruiters to swipe through scene flows and camera angles.',
    sampleData: {
      profile: {
        name: 'Lucas Gray',
        bio: 'Feature Film Storyboard Artist translating director visions into cinematic beat boards, shot compositions, and animatics.',
        socialLinks: { website: 'https://storyboards.pro' },
      },
      skills: {
        frontend: ['Storyboard Pro', 'Photoshop', 'Clip Studio Paint', 'Visual Pacing', 'Camera Staging'],
        backend: ['Dynamic Composition', 'Character Expressions'],
        devops: ['Animatic Audio Sync'],
      },
      projects: [
        {
          title: 'Heist Sequence: 48-Beat Animatic',
          description: 'High-octane warehouse escape sequence illustrating multi-camera angles and stunt choreographies.',
          techStack: ['Storyboard Pro', 'Cinematography', 'Animatic'],
          repoLink: '',
          liveLink: 'https://vimeo.com',
          screenshot: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
        },
      ],
    },
  },

  // ==========================================
  // 3. MEDIA, FINE ARTS & LIFESTYLE SERVICES
  // ==========================================
  {
    id: 'photographer',
    title: 'Commercial & Editorial Photographer',
    category: 'media-lifestyle',
    archetype: ARCHETYPES.VISUAL_MASONRY,
    badge: 'Editorial Lens',
    strategy: 'Ultra-responsive clean grid galleries with aspect ratio controls and masonry layouts for landscape & portrait art.',
    sampleData: {
      profile: {
        name: 'Soren Lindqvist',
        bio: 'Commercial Photographer shooting architecture, minimalist product campaigns, and Scandinavian editorial portraits.',
        socialLinks: { website: 'https://soren.photo', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Hasselblad H6D', 'Capture One', 'Photoshop', 'Studio Lighting', 'High-End Retouching'],
        backend: ['Color Profiling', 'Print Calibration'],
        devops: ['Digital Asset Archiving'],
      },
      projects: [
        {
          title: 'Nordic Glassworks Editorial',
          description: 'Series of 24 medium-format macro photographs commissioned for Architectural Digest Scandinavia.',
          techStack: ['Medium Format', 'Capture One Pro', 'Profoto Studio'],
          repoLink: '',
          liveLink: 'https://behance.net',
          screenshot: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'wedding-photographer',
    title: 'Wedding & Portrait Photographer',
    category: 'media-lifestyle',
    archetype: ARCHETYPES.VISUAL_MASONRY,
    badge: 'Story & Emotion',
    strategy: 'Thematic, emotionally driven story sections dividing images into client event packages with booking modules.',
    sampleData: {
      profile: {
        name: 'Clara & Mateo Weddings',
        bio: 'Fine art destination wedding photographers documenting candid intimacy and heirloom moments across Europe and the Americas.',
        socialLinks: { website: 'https://claramateo.com' },
      },
      skills: {
        frontend: ['Natural Light Mastery', 'Storytelling Sequences', 'Sony Alpha Series', 'Lightroom Presets'],
        backend: ['Client Gallery Portals', 'Album Design'],
        devops: ['Dual-Card Redundant Backups'],
      },
      projects: [
        {
          title: 'Villa Balbianello Lake Como',
          description: 'Three-day intimate destination wedding in northern Italy captured on 35mm film and digital medium.',
          techStack: ['Fine Art Photography', 'Storytelling', 'Lightroom'],
          repoLink: '',
          liveLink: 'https://claramateo.com',
          screenshot: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'videographer',
    title: 'Videographer & Cinematographer',
    category: 'media-lifestyle',
    archetype: ARCHETYPES.VIDEO_SHOWREEL,
    badge: 'Cinema & 4K',
    strategy: 'Dark UI layouts embedding fast streaming media playback channels, categorized by documentaries, music videos, and reels.',
    sampleData: {
      profile: {
        name: 'Nico Santos',
        bio: 'Director of Photography & Commercial Videographer operating RED and ARRI camera packages for global commercials.',
        socialLinks: { website: 'https://nicosantos.film' },
      },
      skills: {
        frontend: ['ARRI Alexa', 'RED Monstro', 'DaVinci Resolve', 'Drone Piloting', 'Gimbal Operation'],
        backend: ['Color Science', 'Lighting Design'],
        devops: ['DIT Workflow Management'],
      },
      projects: [
        {
          title: 'Echoes of Patagonia: 4K Doc',
          description: 'Short nature documentary broadcast on National Geographic Channel, shot entirely in extreme sub-zero weather.',
          techStack: ['RED Helium 8K', 'DaVinci Resolve', 'FPV Drone'],
          repoLink: '',
          liveLink: 'https://vimeo.com',
          screenshot: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'film-editor',
    title: 'Film Editor',
    category: 'media-lifestyle',
    archetype: ARCHETYPES.BEFORE_AFTER,
    badge: 'Timeline & Cut',
    strategy: 'Before/After sequence blocks and timeline sliders demonstrating narrative pacing changes, color grading, and audio tracks.',
    sampleData: {
      profile: {
        name: 'Eva Sorensen',
        bio: 'Feature Film & Commercial Editor. Member of ACE. Specializing in dramatic psychological pacing and documentary montage.',
        socialLinks: { website: 'https://evasorensen.edit', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Premiere Pro', 'DaVinci Resolve', 'Avid Media Composer', 'Audio Post', 'Pacing Theory'],
        backend: ['Proxy Workflows', 'EDL/XML Conforming'],
        devops: ['RAID 0 Post-Production Arrays'],
      },
      projects: [
        {
          title: 'The Silent Hour: Feature Film',
          description: 'Lead narrative editor on 104-minute psychological thriller selected for Tribeca Film Festival.',
          techStack: ['Avid Media Composer', 'DaVinci Color', 'Dolby Atmos'],
          repoLink: '',
          liveLink: 'https://imdb.com',
          screenshot: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'architect',
    title: 'Architect',
    category: 'media-lifestyle',
    archetype: ARCHETYPES.BEFORE_AFTER,
    badge: 'Spatial Blueprints',
    strategy: 'Large-format blueprint galleries, structural cross-section panels, spatial master plans, and 3D architectural renders.',
    sampleData: {
      profile: {
        name: 'Henrik Vanger, AIA',
        bio: 'Licensed Architect designing passive solar residential structures and sustainable timber civic landmarks.',
        socialLinks: { website: 'https://vanger-arch.com', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Revit BIM', 'AutoCAD', 'Rhino 3D', 'Grasshopper', 'Enscape', 'Passive House Standards'],
        backend: ['Structural Engineering Analysis', 'Zoning Code Law'],
        devops: ['LEED Platinum Certification'],
      },
      projects: [
        {
          title: 'Timberline Carbon-Neutral Pavilion',
          description: 'Award-winning municipal library constructed from cross-laminated timber, harvesting 100% of its own solar energy.',
          techStack: ['Revit BIM', 'Rhino Grasshopper', 'Enscape 3D'],
          repoLink: '',
          liveLink: 'https://archdaily.com',
          screenshot: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'interior-designer',
    title: 'Interior Designer',
    category: 'media-lifestyle',
    archetype: ARCHETYPES.BEFORE_AFTER,
    badge: 'Before / After Space',
    strategy: 'Sliding horizontal panels comparing raw spaces to finished environments, custom fabric swatches, and vendor links.',
    sampleData: {
      profile: {
        name: 'Beatrice Moreau',
        bio: 'Interior Designer & Spatial Stylist creating warm minimalist residences with bespoke furniture and natural textures.',
        socialLinks: { website: 'https://moreau-interiors.com' },
      },
      skills: {
        frontend: ['SketchUp', 'V-Ray', 'AutoCAD', 'FF&E Spec Sheets', 'Textile Selection', 'Lighting Design'],
        backend: ['Budget Engineering', 'Contractor Coordination'],
        devops: ['Vendor Logistics'],
      },
      projects: [
        {
          title: 'Tribeca Industrial Loft Renovation',
          description: 'Converted a 3,400 sq ft concrete printing warehouse into a light-filled warm residential sanctuary.',
          techStack: ['Before/After Transformation', 'Custom Millwork', 'V-Ray'],
          repoLink: '',
          liveLink: 'https://architecturaldigest.com',
          screenshot: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'fashion-designer',
    title: 'Fashion Designer',
    category: 'media-lifestyle',
    archetype: ARCHETYPES.EDITORIAL,
    badge: 'Lookbook & Textiles',
    strategy: 'Clean digital lookbooks featuring minimal backgrounds, textile detail zooms, pattern sketch sheets, and collection rows.',
    sampleData: {
      profile: {
        name: 'Astrid Lind',
        bio: 'Contemporary Womenswear Designer integrating deadstock organic textiles with avant-garde structural tailoring.',
        socialLinks: { website: 'https://astridlind.com' },
      },
      skills: {
        frontend: ['CLO 3D', 'Pattern Drafting', 'Draping', 'Textile Sourcing', 'Fashion Illustration'],
        backend: ['Supply Chain Ethics', 'Garment Tech Packs'],
        devops: ['Runway Production'],
      },
      projects: [
        {
          title: 'Autumn / Winter Capsule: Solitude',
          description: '14-piece sustainable outerwear collection crafted from recycled wool and plant-dyed raw silk.',
          techStack: ['CLO 3D', 'Bespoke Tailoring', 'Sustainable Textiles'],
          repoLink: '',
          liveLink: 'https://vogue.com',
          screenshot: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'fashion-model',
    title: 'Fashion Model',
    category: 'media-lifestyle',
    archetype: ARCHETYPES.VISUAL_MASONRY,
    badge: 'Composite Card',
    strategy: 'Visual composite card layouts tracking physical dimensions, multi-angle headshot grids, runway videos, and agency links.',
    sampleData: {
      profile: {
        name: 'Naomi Vance',
        bio: 'International Editorial & Runway Model represented by Elite Model Management Paris & New York. Height: 5\'11" | Bust: 32 | Waist: 24 | Hips: 35.',
        socialLinks: { website: 'https://elitemodel.com' },
      },
      skills: {
        frontend: ['High Fashion Runway', 'Editorial Print', 'Commercial Campaign', 'E-Commerce'],
        backend: ['Movement Direction', 'Acting & Expressive Staging'],
        devops: ['International Travel Ready (US/EU Passports)'],
      },
      projects: [
        {
          title: 'Paris Fashion Week S/S 2026',
          description: 'Walked for 6 heritage fashion houses including Saint Laurent and Balenciaga.',
          techStack: ['Runway Presentation', 'Haute Couture'],
          repoLink: '',
          liveLink: 'https://models.com',
          screenshot: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'makeup-artist',
    title: 'Makeup Artist (MUA)',
    category: 'media-lifestyle',
    archetype: ARCHETYPES.BEFORE_AFTER,
    badge: 'Transformation',
    strategy: 'Split slider interfaces presenting macro photography for close-ups, specific style grids, and scheduling tools.',
    sampleData: {
      profile: {
        name: 'Zara Thorne Makeup',
        bio: 'Pro Makeup Artist & Prosthetics Specialist for cinema, high-glam editorial, and luxury bridal clients.',
        socialLinks: { website: 'https://zarathorne.mua' },
      },
      skills: {
        frontend: ['Airbrush Makeup', 'SFX Prosthetics', 'Skin Prep Mastery', 'Editorial High-Glam', 'Bridal Styling'],
        backend: ['Sanitation & Hygiene Protocol', 'Lighting Compatibility'],
        devops: ['On-Set Touchup Velocity'],
      },
      projects: [
        {
          title: 'Harper’s Bazaar Beauty Spread',
          description: 'Glass-skin macro beauty editorial featuring jewel tone liner and high-gloss highlighting.',
          techStack: ['Editorial Makeup', 'Macro Photography Skin Prep'],
          repoLink: '',
          liveLink: 'https://instagram.com',
          screenshot: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'tattoo-artist',
    title: 'Tattoo Artist',
    category: 'media-lifestyle',
    archetype: ARCHETYPES.VISUAL_MASONRY,
    badge: 'Ink & Realism',
    strategy: 'High-contrast background grids maximizing ink vibrancy, categorized by style (traditional, realism, linework), with hygiene blocks.',
    sampleData: {
      profile: {
        name: 'Kurogane Ink (Kenji Sato)',
        bio: 'Master Tattooist specializing in fine-line micro-realism, Japanese Irezumi, and black-and-grey anatomical botanical sleeves.',
        socialLinks: { website: 'https://kurogane.ink' },
      },
      skills: {
        frontend: ['Fine-Line Micro Realism', 'Japanese Irezumi', 'Black & Grey Wash', 'Custom Needle Shading'],
        backend: ['Skin Anatomy & Healing Chemistry', 'Bloodborne Pathogen Certified'],
        devops: ['Autoclave Hospital-Grade Sterilization'],
      },
      projects: [
        {
          title: 'Dragon & Peony Full Backpiece',
          description: '45-hour custom Japanese sleeve combining traditional sumi ink shading with contemporary fine lines.',
          techStack: ['Custom Tattoo Work', 'Sumi Wash', 'Fine-Line'],
          repoLink: '',
          liveLink: 'https://kurogane.ink',
          screenshot: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'culinary-artist',
    title: 'Culinary Artist & Pastry Chef',
    category: 'media-lifestyle',
    archetype: ARCHETYPES.EDITORIAL,
    badge: 'Gastronomy',
    strategy: 'Magazine-style food layouts prioritizing vivid close-up ingredient shots, menu profiles, and reservation engines.',
    sampleData: {
      profile: {
        name: 'Chef Antoine Laurent',
        bio: 'Michelin-trained Executive Pastry Chef crafting sculptural avant-garde viennoiserie, chocolate art, and tasting menus.',
        socialLinks: { website: 'https://antoinepastry.com' },
      },
      skills: {
        frontend: ['Molecular Gastronomy', 'Sugar Sculpting', 'Valrhona Chocolate Tempering', 'Laminated Pastry'],
        backend: ['Flavor Pairing Chemistry', 'Menu Cost Engineering'],
        devops: ['HACCP Certified Food Safety'],
      },
      projects: [
        {
          title: 'The Golden Hazelnut Sphere',
          description: 'Signature dessert featuring 70% dark chocolate dome, smoked hazelnut praline, and 24k edible gold leaf.',
          techStack: ['Haute Pâtisserie', 'Tempered Chocolate', 'Molecular Gastronomy'],
          repoLink: '',
          liveLink: '',
          screenshot: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80',
        },
      ],
    },
  },

  // ==========================================
  // 4. WRITING, MARKETING & STRATEGY ROLES
  // ==========================================
  {
    id: 'copywriter',
    title: 'Copywriter (Advertising)',
    category: 'writing-marketing',
    archetype: ARCHETYPES.MARKETING_KPI,
    badge: 'Conversion Copy',
    strategy: 'Headline-focused text blocks showing clear creative concepts, split A/B test variations, and conversion performance metrics.',
    sampleData: {
      profile: {
        name: 'Maxwell Sterling',
        bio: 'Senior Conversion Copywriter & Creative Director. Turning complex tech propositions into high-converting consumer hooks.',
        socialLinks: { website: 'https://sterlingcopy.com', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Direct Response Copywriting', 'Brand Voice Guidelines', 'Landing Page Wireframing', 'Email Sequences'],
        backend: ['A/B Conversion Testing', 'Psychological Behavioral Triggers'],
        devops: ['VWO & Optimizely Analytics'],
      },
      projects: [
        {
          title: 'SaaS Launch: $4.2M ARR Campaign',
          description: 'Penned complete brand messaging framework and landing page copy producing an 8.4% conversion rate.',
          techStack: ['Creative Copy', 'A/B Testing', 'Value Proposition Design'],
          repoLink: '',
          liveLink: '',
          screenshot: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'content-writer',
    title: 'Content Writer & Journalist',
    category: 'writing-marketing',
    archetype: ARCHETYPES.EDITORIAL,
    badge: 'Longform & Editorial',
    strategy: 'Clean, typography-focused article feeds mirroring premium digital publications, featuring reading time estimators.',
    sampleData: {
      profile: {
        name: 'Hannah Abbott',
        bio: 'Investigative Journalist & Longform Essayist. Published in The Atlantic, Wired, and The New Yorker covering AI ethics and culture.',
        socialLinks: { website: 'https://hannahabbott.press', twitter: 'https://twitter.com' },
      },
      skills: {
        frontend: ['Longform Journalism', 'Substack Editorial', 'SEO Content Strategy', 'Ghostwriting'],
        backend: ['Deep Investigative Research', 'Primary Source Verification'],
        devops: ['Editorial Calendar Management'],
      },
      projects: [
        {
          title: 'The Silent Grid: Future of Autonomous Power',
          description: '6,000-word investigative exposé exploring cyber vulnerabilities in municipal energy infrastructures.',
          techStack: ['Investigative Journalism', 'Fact Checking', 'Longform'],
          repoLink: '',
          liveLink: 'https://wired.com',
          screenshot: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'technical-writer',
    title: 'Technical Writer',
    category: 'writing-marketing',
    archetype: ARCHETYPES.TECHNICAL_DOCS,
    badge: 'API Specs & Manuals',
    strategy: 'Highly organized, deep sidebar navigation systems designed to group extensive documentation and code examples.',
    sampleData: {
      profile: {
        name: 'Gareth Brooks',
        bio: 'Staff Technical Writer creating clean developer documentation, SDK onboarding guides, and OpenAPI schemas for fintech APIs.',
        socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Markdown / MDX', 'Docusaurus', 'Swagger / OpenAPI', 'Sphinx', 'Postman Collections'],
        backend: ['REST & GraphQL Spec Authoring', 'Code Sample Validation (Python, JS, Go)'],
        devops: ['Docs-as-Code Git Workflows'],
      },
      projects: [
        {
          title: 'PayCore Global Payments API Docs',
          description: 'Complete documentation portal overhaul reducing developer support ticket volume by 45%.',
          techStack: ['Docusaurus', 'OpenAPI 3.1', 'Markdown', 'React'],
          repoLink: 'https://github.com',
          liveLink: 'https://docs.paycore.dev',
          screenshot: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'scriptwriter',
    title: 'Scriptwriter & Playwright',
    category: 'writing-marketing',
    archetype: ARCHETYPES.EDITORIAL,
    badge: 'Screenplay & Drama',
    strategy: 'Formatted dialogue block components mimicking formal script sheets, downloadable excerpts, and loglines.',
    sampleData: {
      profile: {
        name: 'Evelyn St. Claire',
        bio: 'WGA Screenwriter & Playwright. Nicholl Fellowship Quarterfinalist. Writing psychological thrillers and character-driven prestige TV dramas.',
        socialLinks: { website: 'https://evelynwriter.com' },
      },
      skills: {
        frontend: ['Final Draft 13', 'Screenplay Formatting', 'Character Arcs', 'Dialogue Rhythm'],
        backend: ['Three-Act Structural Beatboards', 'Pitch Bible Development'],
        devops: ['WGA Script Registration'],
      },
      projects: [
        {
          title: 'The Glass Horizon (Feature)',
          description: 'Logline: When an aerospace engineer discovers an altered flight recorder, she must choose between unveiling corporate treason or protecting her family.',
          techStack: ['Final Draft', 'Psychological Thriller', 'Feature Script'],
          repoLink: '',
          liveLink: 'https://blacklist.com',
          screenshot: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'growth-marketer',
    title: 'Digital Marketer & Growth Strategist',
    category: 'writing-marketing',
    archetype: ARCHETYPES.MARKETING_KPI,
    badge: 'CAC / ROAS Analytics',
    strategy: 'Data dashboard templates showcasing analytic metric cards, ROAS charts, and organic conversion timelines.',
    sampleData: {
      profile: {
        name: 'Devon Miller',
        bio: 'Head of Growth scaling B2B SaaS from $1M to $15M ARR through systematic performance marketing, lifecycle funnels, and viral product loops.',
        socialLinks: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
      },
      skills: {
        frontend: ['Google Ads', 'Meta Ads Manager', 'Mixpanel', 'HubSpot', 'Segment'],
        backend: ['Funnel Attribution Modeling', 'Cohort Retention Analysis'],
        devops: ['Server-Side Google Tag Manager', 'Data Warehouse ETL'],
      },
      projects: [
        {
          title: 'Scaling FinTech CAC Down 42%',
          description: 'Managed $3.5M annual ad spend across Search & Paid Social, driving 120,000 qualified enterprise leads.',
          techStack: ['Performance Marketing', 'Mixpanel Cohorts', 'Conversion Optimization'],
          repoLink: '',
          liveLink: '',
          screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'social-media-manager',
    title: 'Social Media Manager',
    category: 'writing-marketing',
    archetype: ARCHETYPES.DEVICE_MOCKUP,
    badge: 'Social Streams & Reach',
    strategy: 'Visual social grid layout blocks outlining campaign content calendars, viral summaries, and brand guidelines.',
    sampleData: {
      profile: {
        name: 'Brianna Cole',
        bio: 'Social Media Strategist & Community Architect. Grew brand audiences past 1.5M organic followers across TikTok, Instagram, and LinkedIn.',
        socialLinks: { website: 'https://briannasocial.com' },
      },
      skills: {
        frontend: ['TikTok Creative Studio', 'CapCut Pro', 'Canva', 'Sprout Social', 'Community Moderation'],
        backend: ['Trend Forecasting', 'Viral Scripting Hooks'],
        devops: ['Content Pipeline Automation'],
      },
      projects: [
        {
          title: 'EcoVibe Viral TikTok Campaign',
          description: 'Generated 45 million organic video views in 90 days with zero paid ad spend, doubling D2C store revenue.',
          techStack: ['Short-Form Video', 'TikTok SEO', 'Influencer Seeding'],
          repoLink: '',
          liveLink: 'https://tiktok.com',
          screenshot: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'pr-specialist',
    title: 'Public Relations (PR) Specialist',
    category: 'writing-marketing',
    archetype: ARCHETYPES.EDITORIAL,
    badge: 'Media Kit & Press',
    strategy: 'Media kit panels compiling corporate press releases, published news clipping frames, and crisis management summaries.',
    sampleData: {
      profile: {
        name: 'Cassandra Sterling',
        bio: 'Tech PR Director placing founding stories in The Wall Street Journal, TechCrunch, and Bloomberg. Crisis communications advisor.',
        socialLinks: { linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Media Pitching', 'Press Release Drafting', 'Executive Media Training', 'Crisis Communications'],
        backend: ['Media Relationship Management', 'Editorial Angle Strategy'],
        devops: ['Muck Rack Media Database'],
      },
      projects: [
        {
          title: 'Series B Funding PR Blitz',
          description: 'Orchestrated media embargo breaking across TechCrunch, Forbes, and CNBC simultaneously.',
          techStack: ['Media Relations', 'Press Releases', 'Keynote Preparation'],
          repoLink: '',
          liveLink: 'https://techcrunch.com',
          screenshot: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 'seo-specialist',
    title: 'SEO Specialist',
    category: 'writing-marketing',
    archetype: ARCHETYPES.MARKETING_KPI,
    badge: 'Organic Traffic & SERP',
    strategy: 'Case-study structures focused on search performance milestones, organic growth graphs, and site audit fixes.',
    sampleData: {
      profile: {
        name: 'Vikram Patel',
        bio: 'Technical SEO Director specializing in programmatic SEO, Core Web Vitals remediation, and enterprise site migrations.',
        socialLinks: { website: 'https://vikramseo.com', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['Ahrefs', 'SEMrush', 'Screaming Frog', 'Google Search Console', 'Schema.org JSON-LD'],
        backend: ['Log File Analysis', 'Crawl Budget Optimization', 'Programmatic Pages'],
        devops: ['Core Web Vitals Remediation'],
      },
      projects: [
        {
          title: 'Enterprise Marketplace: +320% Traffic',
          description: 'Restructured faceted URL architecture and eliminated 1.2M duplicate indexation errors, scaling organic traffic from 400k to 1.7M visits/mo.',
          techStack: ['Technical SEO', 'Python Scraping', 'Information Architecture'],
          repoLink: '',
          liveLink: '',
          screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        },
      ],
    },
  },
];

// Lookup map for fast O(1) query by role ID
export const ROLES_MAP = ROLES.reduce((acc, role) => {
  acc[role.id] = role;
  return acc;
}, {});

// Set of all fictitious sample names across all roles (lowercased for case-insensitive matching)
export const SAMPLE_ROLE_NAMES = new Set(
  ROLES.map((r) => r.sampleData?.profile?.name?.trim().toLowerCase()).filter(Boolean)
);

/**
 * Checks if a given name matches any fictitious role sample persona
 * (e.g., 'Elena Rostova', 'Marcus Vance', 'Alex Rivera', etc.)
 */
export const isSampleRoleName = (name) => {
  if (!name || typeof name !== 'string') return false;
  return SAMPLE_ROLE_NAMES.has(name.trim().toLowerCase());
};

/**
 * Formats a raw username handle (e.g. 'shridhar_sharma' or 'john-doe') into a clean human Name.
 * Strips trailing numbers and capitalizes each word.
 */
export const formatUsernameToDisplayName = (username) => {
  if (!username || typeof username !== 'string') return '';
  const withoutDigits = username.replace(/\d+$/, '');
  const clean = withoutDigits.length >= 2 ? withoutDigits : username;
  return clean
    .split(/[_\-.\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Resolves the authentic human Name of the user.
 * Guarantees that raw username handles (e.g. 'shridhar_01') and fictitious sample persona names
 * (e.g. 'Elena Rostova') are NEVER returned as the user's name.
 */
export const getAuthenticUserName = (profileName, user) => {
  const pName = typeof profileName === 'string' ? profileName.trim() : '';
  const uHandle = user?.username ? user.username.trim().toLowerCase() : '';

  // 1. If a custom profile name is provided, verify it is neither a sample persona nor a raw handle
  if (pName && !isSampleRoleName(pName)) {
    // If it differs from the raw lowercase handle, it's the user's authentic Name!
    if (!uHandle || pName.toLowerCase() !== uHandle) {
      return pName;
    }
    // If it was stored exactly as the raw handle (e.g. 'shridhar'), format it into a human name
    return formatUsernameToDisplayName(pName);
  }

  // 2. If user object has a dedicated name property that is valid
  if (user?.name && typeof user.name === 'string') {
    const uName = user.name.trim();
    if (uName && !isSampleRoleName(uName) && (!uHandle || uName.toLowerCase() !== uHandle)) {
      return uName;
    }
  }

  // 3. Fallback to formatting the username into a human name (e.g. 'shridhar' -> 'Shridhar', 'john_doe' -> 'John Doe')
  if (user?.username) {
    return formatUsernameToDisplayName(user.username);
  }

  return 'Developer';
};

/**
 * 11 Master UI/UX Design Styles (PDF Engineering Specification)
 * Defines compatible tech roles, aesthetic drivers and visual themes
 */
export const DESIGN_STYLES = {
  GLASSMORPHISM: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    tagline: 'Frosted Glass Transparency & Layered Neon Depth',
    driver: 'Frosted glass transparency, blurred backgrounds, neon accents, layered depth.',
    roles: ['frontend-developer', 'fullstack-developer', 'mobile-developer', 'uiux-designer', 'product-designer', 'growth-marketer', 'social-media-manager'],
  },
  SKEUOMORPHISM: {
    id: 'skeuomorphism',
    name: 'Skeuomorphism / Tactile',
    tagline: 'Realistic Tactile Textures & Hardware Console Depth',
    driver: 'Realistic textures, physical buttons, dimensional bevels, shadows.',
    roles: ['product-designer', 'uiux-designer', 'mobile-developer', 'architect', 'graphic-designer', 'packaging-designer'],
  },
  NEO_BRUTALISM: {
    id: 'neobrutalism',
    name: 'Neo-Brutalism',
    tagline: 'High-Contrast Thick Borders & Stark Primary Colors',
    driver: 'High-contrast thick black borders, stark primary colors, raw asymmetrical grid rows.',
    roles: ['frontend-developer', 'mobile-developer', 'interaction-designer', 'brand-designer', 'growth-marketer', 'motion-designer', 'copywriter'],
  },
  CLAYMORPHISM: {
    id: 'claymorphism',
    name: 'Claymorphism',
    tagline: 'Soft Volumetric 3D Puffiness & Friendly Pastel Accents',
    driver: 'Soft 3D inner/outer shadows, rounded clay-like puffiness, friendly pastel accents.',
    roles: ['interaction-designer', 'uiux-designer', 'animator', 'storyboard-artist', 'product-designer'],
  },
  MINIMALISM: {
    id: 'minimalism',
    name: 'Minimalism',
    tagline: 'Generous Whitespace & Swiss Typographical Hierarchy',
    driver: 'Generous white space, clear typographical hierarchies, highly functional components.',
    roles: ['backend-engineer', 'devops-engineer', 'data-scientist', 'technical-writer', 'content-writer', 'architect'],
  },
  LIQUID_GLASS: {
    id: 'liquid-glass',
    name: 'Liquid Glass',
    tagline: 'Organic Fluid Curves & Iridescent Refractive Sheen',
    driver: 'Organic fluid outlines mixed with refractive transparency and high sheen.',
    roles: ['frontend-developer', 'mobile-developer', 'photographer', 'wedding-photographer', 'videographer', 'motion-designer', 'fashion-designer'],
  },
  BENTO_GRID: {
    id: 'bento-grid',
    name: 'Bento Grid Layout',
    tagline: 'Asymmetric Partitioned Modular Dashboard Blocks',
    driver: 'Asymmetric rectangle blocks, clean rounded corners, card grouping.',
    roles: ['frontend-developer', 'fullstack-developer', 'mobile-developer', 'product-designer', 'graphic-designer', 'growth-marketer', 'seo-specialist'],
  },
  BARELY_THERE: {
    id: 'barely-there',
    name: "'Barely There' UI",
    tagline: 'Ultra-Fine Hairline Borders & Strict Cartesian Grids',
    driver: 'Ultra-fine borders, strict grids, massive workspace focus, thin fonts.',
    roles: ['backend-engineer', 'data-scientist', 'fullstack-developer', 'devops-engineer', 'info-architect'],
  },
  AURORA_MESH: {
    id: 'aurora-mesh',
    name: 'Aurora & Mesh Gradients',
    tagline: 'Fluid Blurred Ambient Blobs & Radiant Dynamic Backing',
    driver: 'Fluid blurred blobs, rich ambient backing colors, cursor tracking.',
    roles: ['frontend-developer', 'uiux-designer', 'brand-designer', 'motion-designer', 'fashion-designer'],
  },
  METALMORPHISM: {
    id: 'metalmorphism',
    name: 'Metalmorphism',
    tagline: 'Brushed Aluminum, Titanium & Fine Chrome Specular Vectors',
    driver: 'Brushed metal finishes, fine chrome outlines, reflective lighting vectors.',
    roles: ['backend-engineer', 'devops-engineer', '3d-artist', 'architect'],
  },
  ARCHIVAL_INDEX: {
    id: 'archival-index',
    name: 'The Archival Index',
    tagline: 'Monospaced Ledger Blueprint & Exposed Wireframe Tables',
    driver: 'Monospaced fonts, exposed wireframe boundaries, structural data tables.',
    roles: ['backend-engineer', 'devops-engineer', 'data-scientist', 'technical-writer', 'scriptwriter'],
  },
};

export const DESIGN_STYLES_LIST = Object.values(DESIGN_STYLES);

// Helper to get all compatible styles for a specific role
export const getRoleCompatibleStyles = (roleId) => {
  if (!roleId) return [];
  const baseId = roleId.includes('--') ? roleId.split('--')[0] : roleId;
  return DESIGN_STYLES_LIST.filter((s) => s.roles.includes(baseId));
};

// Helper to get role by ID with fallback (supports compound templateId like role--style)
export const getRoleConfig = (roleId) => {
  if (!roleId) return ROLES_MAP['fullstack-developer'];
  const baseId = roleId.includes('--') ? roleId.split('--')[0] : roleId;
  return ROLES_MAP[baseId] || ROLES_MAP['fullstack-developer'];
};


