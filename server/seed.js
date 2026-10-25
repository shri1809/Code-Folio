const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./src/models/User');
const Portfolio = require('./src/models/Portfolio');
const { hashSecret } = require('./src/utils/crypto');

const seedData = async () => {
  let mongod = null;
  let uri = process.env.MONGO_URI;

  try {
    if (!uri) {
      console.log('[Seed] No MONGO_URI specified. Initializing in-memory MongoDB instance for seed...');
      mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
    }

    await mongoose.connect(uri);
    console.log('[Seed] Connected to database.');

    // Clean existing demo records
    await User.deleteMany({ username: { $in: ['demo1', 'demo2'] } });

    // Seed Demo 1 (Minimalist theme)
    const demo1PasswordHash = await hashSecret('Demo1SecurePass123!');
    const demo1User = await User.create({
      username: 'demo1',
      email: 'demo1@codefolio.dev',
      passwordHash: demo1PasswordHash,
      role: 'user',
      isVerified: true,
      isPro: false,
      templateId: 'minimalist',
    });

    await Portfolio.create({
      userId: demo1User._id,
      profile: {
        name: 'Alex Rivera',
        bio: 'Senior Full-Stack Engineer specializing in scalable web systems, distributed architectures, and developer tooling. Passionate about minimalism, clean code, and resilient APIs.',
        socialLinks: {
          github: 'https://github.com/alexrivera-demo',
          linkedin: 'https://linkedin.com/in/alexrivera-demo',
          twitter: 'https://twitter.com/alexrivera_dev',
          website: 'https://alexrivera.dev',
        },
        resumeUrl: 'https://codefolio.dev/resumes/alex-rivera.pdf',
      },
      skills: {
        frontend: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux Toolkit'],
        backend: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'GraphQL'],
        devops: ['Docker', 'AWS', 'CI/CD Pipelines', 'Linux', 'Terraform'],
      },
      projects: [
        {
          title: 'CloudMetric SaaS',
          description:
            'Real-time metrics aggregator and monitoring dashboard for microservices with WebSocket telemetry and anomaly detection.',
          techStack: ['React', 'Node.js', 'Redis', 'Docker'],
          repoLink: 'https://github.com/demo1/cloudmetric',
          liveLink: 'https://cloudmetric.demo.app',
          screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        },
        {
          title: 'DevSync Hub',
          description:
            'Collaborative workspace for asynchronous developer workflows, pull request reviews, and sprint kanban boards.',
          techStack: ['TypeScript', 'Express', 'MongoDB', 'Tailwind CSS'],
          repoLink: 'https://github.com/demo1/devsync',
          liveLink: 'https://devsync.demo.app',
          screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        },
      ],
    });
    console.log('[Seed] Created demo1 (Minimalist theme, standard user).');

    // Seed Demo 2 (Cyberpunk theme, Pro badge enabled)
    const demo2PasswordHash = await hashSecret('Demo2CyberPass456!');
    const demo2User = await User.create({
      username: 'demo2',
      email: 'demo2@codefolio.dev',
      passwordHash: demo2PasswordHash,
      role: 'user',
      isVerified: true,
      isPro: true,
      customDomain: 'demo2.tech',
      templateId: 'cyberpunk',
    });

    await Portfolio.create({
      userId: demo2User._id,
      profile: {
        name: 'Nova Vance',
        bio: 'Cybersecurity Specialist & Offensive Security Engineer. Architecting zero-trust perimeter defenses, auditing smart contracts, and building high-throughput low-latency telemetry pipelines.',
        socialLinks: {
          github: 'https://github.com/novavance-demo',
          linkedin: 'https://linkedin.com/in/novavance-demo',
          twitter: 'https://twitter.com/novavance_sec',
          website: 'https://demo2.tech',
        },
        resumeUrl: 'https://codefolio.dev/resumes/nova-vance.pdf',
      },
      skills: {
        frontend: ['WebAssembly', 'Three.js', 'React', 'Tailwind CSS', 'Canvas API'],
        backend: ['Rust', 'Go', 'Node.js', 'gRPC', 'PostgreSQL'],
        devops: ['Kubernetes', 'eBPF', 'Prometheus', 'WireGuard', 'Vault'],
      },
      projects: [
        {
          title: 'ZeroTrust Sentinel',
          description:
            'Kernel-level anomaly detection agent leveraging eBPF filters and real-time behavioral neural nets.',
          techStack: ['Rust', 'eBPF', 'Go', 'React'],
          repoLink: 'https://github.com/demo2/zerotrust-sentinel',
          liveLink: 'https://sentinel.demo.app',
          screenshot: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
        },
        {
          title: 'Specter Protocol',
          description:
            'Encrypted decentralized mesh communication protocol resilient against packet inspection and quantum attacks.',
          techStack: ['Go', 'Cryptography', 'WebAssembly', 'Libp2p'],
          repoLink: 'https://github.com/demo2/specter-protocol',
          liveLink: 'https://specter.demo.app',
          screenshot: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
        },
      ],
    });
    console.log('[Seed] Created demo2 (Cyberpunk theme, Pro badge & customDomain: demo2.tech).');

    console.log('[Seed] Seeding completed successfully!');
  } catch (err) {
    console.error(`[Seed Error]: ${err.message}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = { seedData };

