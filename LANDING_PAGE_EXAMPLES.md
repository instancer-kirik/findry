# Landing Page Examples

Here are some example landing page configurations to help you get started with the new customizable landing pages feature.

## Example 1: Open Source Project (Hype Theme)

Perfect for generating excitement around a new open source tool or library.

```json
{
  "theme": "hype",
  "hero_title": "🚀 NextGen Web Framework",
  "hero_subtitle": "The fastest, most developer-friendly framework that's about to change everything. Join 10,000+ developers already building the future.",
  "hero_image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&h=1080&fit=crop",
  "call_to_action": "Start Building Now",
  "cta_link": "https://github.com/yourproject/nextgen",
  "sections": [
    {
      "id": "features",
      "type": "features",
      "title": "🔥 Game-Changing Features",
      "order": 1,
      "visible": true
    },
    {
      "id": "timeline",
      "type": "timeline", 
      "title": "🛣️ Roadmap to Glory",
      "order": 2,
      "visible": true
    },
    {
      "id": "community",
      "type": "text",
      "title": "🌟 Join the Revolution",
      "content": "<p>Be part of something bigger. Our community of passionate developers is reshaping how we build for the web.</p><ul><li>💬 Active Discord with 5,000+ members</li><li>📝 Weekly development updates</li><li>🎯 Direct access to core maintainers</li><li>🏆 Contributor recognition program</li></ul>",
      "order": 3,
      "visible": true
    }
  ],
  "social_links": [
    {
      "platform": "github",
      "url": "https://github.com/yourproject/nextgen",
      "label": "Star on GitHub"
    },
    {
      "platform": "twitter", 
      "url": "https://twitter.com/nextgenfw",
      "label": "Follow Updates"
    },
    {
      "platform": "discord",
      "url": "https://discord.gg/nextgen",
      "label": "Join Community"
    }
  ],
  "background_color": "#0f0f23",
  "text_color": "#ffffff",
  "accent_color": "#ff6b6b"
}
```

## Example 2: Creative Showcase (Showcase Theme)

Ideal for artists, designers, or creative projects that need visual impact.

```json
{
  "theme": "showcase",
  "hero_title": "Digital Dreams",
  "hero_subtitle": "An immersive art installation exploring the intersection of technology and human emotion through interactive digital sculptures.",
  "hero_video": "https://example.com/hero-video.mp4",
  "call_to_action": "Experience the Art",
  "cta_link": "https://gallery.example.com/digital-dreams",
  "sections": [
    {
      "id": "gallery",
      "type": "gallery",
      "title": "Visual Journey",
      "order": 1,
      "visible": true
    },
    {
      "id": "process",
      "type": "text",
      "title": "The Creative Process",
      "content": "<p>Each piece begins as raw emotion, transformed through code into living, breathing digital matter. The installation responds to viewer presence, creating a unique experience for every visitor.</p><blockquote>'Art is not what you see, but what you make others see.' - Edgar Degas</blockquote>",
      "order": 2,
      "visible": true
    },
    {
      "id": "timeline",
      "type": "timeline",
      "title": "Evolution",
      "order": 3,
      "visible": true
    }
  ],
  "social_links": [
    {
      "platform": "instagram",
      "url": "https://instagram.com/digitalartist",
      "label": "Follow Journey"
    },
    {
      "platform": "website",
      "url": "https://portfolio.example.com",
      "label": "Full Portfolio"
    }
  ],
  "custom_css": ".hero-title { background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradient 3s ease infinite; } @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }"
}
```

## Example 3: Tech Startup (Minimal Theme)

Clean, professional approach for B2B products or enterprise solutions.

```json
{
  "theme": "minimal",
  "hero_title": "DataFlow Analytics",
  "hero_subtitle": "Transform your business intelligence with real-time analytics that actually make sense. Trusted by 500+ companies worldwide.",
  "hero_image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop",
  "call_to_action": "Start Free Trial", 
  "cta_link": "https://app.dataflow.com/signup",
  "sections": [
    {
      "id": "features",
      "type": "features",
      "title": "Powerful Features",
      "order": 1,
      "visible": true
    },
    {
      "id": "testimonials",
      "type": "text",
      "title": "Trusted by Industry Leaders",
      "content": "<div class='testimonials'><blockquote>'DataFlow reduced our reporting time by 75% and increased accuracy by 40%. Game changer.' - Sarah Chen, CTO at TechCorp</blockquote><blockquote>'The intuitive dashboards helped us identify $2M in cost savings within the first month.' - Michael Rodriguez, CFO at GrowthCo</blockquote></div>",
      "order": 2,
      "visible": true
    },
    {
      "id": "timeline",
      "type": "timeline",
      "title": "Implementation Roadmap", 
      "order": 3,
      "visible": true
    }
  ],
  "social_links": [
    {
      "platform": "website",
      "url": "https://dataflow.com",
      "label": "Learn More"
    },
    {
      "platform": "twitter",
      "url": "https://twitter.com/dataflowapp",
      "label": "Product Updates"
    }
  ],
  "background_color": "#ffffff",
  "text_color": "#1a202c",
  "accent_color": "#3182ce"
}
```

## Example 4: Technical Project (Technical Theme)

Perfect for developer tools, APIs, or infrastructure projects.

```json
{
  "theme": "technical",
  "hero_title": "$ curl api.awesome.dev",
  "hero_subtitle": "The developer-first API platform. Built by engineers, for engineers. Ship faster with 99.9% uptime SLA.",
  "call_to_action": "Read the Docs",
  "cta_link": "https://docs.awesome.dev",
  "sections": [
    {
      "id": "quickstart",
      "type": "text", 
      "title": "> Getting Started",
      "content": "<pre><code>npm install awesome-sdk\n\nimport { AwesomeAPI } from 'awesome-sdk';\n\nconst api = new AwesomeAPI({\n  apiKey: process.env.AWESOME_API_KEY\n});\n\nconst result = await api.users.list();\nconsole.log(result.data);</code></pre><p>Zero configuration. Start building in under 2 minutes.</p>",
      "order": 1,
      "visible": true
    },
    {
      "id": "features",
      "type": "features", 
      "title": "// Core Features",
      "order": 2,
      "visible": true
    },
    {
      "id": "benchmarks",
      "type": "text",
      "title": "⚡ Performance Metrics",
      "content": "<div class='metrics'><div class='metric'><h3>< 50ms</h3><p>Average response time</p></div><div class='metric'><h3>99.99%</h3><p>Uptime SLA</p></div><div class='metric'><h3>10k+</h3><p>Requests per second</p></div></div>",
      "order": 3,
      "visible": true
    }
  ],
  "social_links": [
    {
      "platform": "github",
      "url": "https://github.com/awesome-dev/api",
      "label": "View Source"
    },
    {
      "platform": "website",
      "url": "https://awesome.dev",
      "label": "Documentation"
    }
  ],
  "custom_css": ".metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin: 2rem 0; } .metric { text-align: center; padding: 1.5rem; border: 1px solid #333; border-radius: 8px; background: rgba(0,255,0,0.1); } .metric h3 { color: #00ff00; font-family: 'JetBrains Mono', monospace; font-size: 2rem; margin-bottom: 0.5rem; }"
}
```

## Example 5: Community Project (Default Theme)

Balanced approach for community-driven projects or non-profits.

```json
{
  "theme": "default",
  "hero_title": "Ocean Cleanup Initiative",
  "hero_subtitle": "Join thousands of volunteers worldwide in the mission to clean our oceans. Every action counts, every person matters.",
  "hero_image": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop",
  "call_to_action": "Join the Movement",
  "cta_link": "https://volunteer.oceancleanup.org",
  "sections": [
    {
      "id": "impact",
      "type": "text",
      "title": "Our Impact So Far",
      "content": "<div class='impact-stats'><div class='stat'><h3>2.3M lbs</h3><p>Trash removed from oceans</p></div><div class='stat'><h3>150+</h3><p>Cleanup events organized</p></div><div class='stat'><h3>25,000+</h3><p>Active volunteers</p></div><div class='stat'><h3>40</h3><p>Countries participating</p></div></div>",
      "order": 1,
      "visible": true
    },
    {
      "id": "timeline",
      "type": "timeline",
      "title": "Milestones & Future Goals",
      "order": 2,
      "visible": true
    },
    {
      "id": "get-involved",
      "type": "text",
      "title": "How You Can Help",
      "content": "<p>There are many ways to contribute to our cause:</p><ul><li>🌊 <strong>Join local cleanups</strong> - Find events in your area</li><li>📸 <strong>Document progress</strong> - Help us track our impact</li><li>💰 <strong>Sponsor equipment</strong> - Fund cleanup tools and supplies</li><li>📢 <strong>Spread awareness</strong> - Share our mission with friends</li><li>🧪 <strong>Research support</strong> - Help analyze ocean health data</li></ul>",
      "order": 3,
      "visible": true
    }
  ],
  "social_links": [
    {
      "platform": "website",
      "url": "https://oceancleanup.org",
      "label": "Learn More"
    },
    {
      "platform": "instagram", 
      "url": "https://instagram.com/oceancleanuporg",
      "label": "See Our Work"
    },
    {
      "platform": "twitter",
      "url": "https://twitter.com/oceancleanup", 
      "label": "Follow Updates"
    }
  ]
}
```

## How to Use These Examples

1. **Copy Configuration**: Copy the JSON configuration from any example above
2. **Open Landing Page Editor**: In your project, click "Create Landing" or "Edit Landing" 
3. **Import/Manually Configure**: Either paste the JSON into the advanced section, or manually fill out the fields in the editor
4. **Customize**: Modify colors, text, images, and sections to match your project
5. **Preview & Publish**: Use the preview feature to see how it looks, then save to publish

## Pro Tips

- **Images**: Use high-quality, properly sized images (1920x1080 for hero images)
- **Videos**: Keep hero videos under 5MB and 30 seconds for best performance  
- **Copy**: Write compelling, action-oriented text that speaks to your audience
- **Colors**: Ensure good contrast ratios for accessibility
- **Mobile**: Always preview on mobile devices before publishing
- **Analytics**: Add Google Analytics or similar tracking to measure engagement

## Testing Your Landing Page

1. Save your configuration
2. Make your project public (`is_public: true`)
3. Visit: `https://findry.com/projects/YOUR_PROJECT_ID/landing`
4. Share the link with friends for feedback
5. Iterate based on user responses

## Example 6: Modern Project (Sleek Theme)

Perfect for cutting-edge tech projects, developer tools, or anything that needs a sharp, clickthrough aesthetic.

```json
{
  "theme": "sleek",
  "hero_title": "> findry.init()",
  "hero_subtitle": "The developer's project management platform. Built for makers who think in code and ship in style.",
  "hero_image": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop",
  "call_to_action": "Deploy Now",
  "cta_link": "https://findry.com/signup",
  "sections": [
    {
      "id": "features",
      "type": "features",
      "title": "// Core Features",
      "order": 1,
      "visible": true
    },
    {
      "id": "code-example",
      "type": "text",
      "title": "$ Quick Start",
      "content": "<pre><code>// Initialize your project\nconst project = new Findry({\n  name: 'my-awesome-project',\n  components: ['frontend', 'backend', 'database'],\n  deployment: 'production'\n});\n\n// Track progress in real-time\nproject.on('component:complete', (component) => {\n  console.log(`✅ ${component.name} deployed`);\n});\n\n// Ship it\nawait project.deploy();</code></pre><p>Zero config. Maximum output. Start building in <strong>30 seconds</strong>.</p>",
      "order": 2,
      "visible": true
    },
    {
      "id": "timeline",
      "type": "timeline",
      "title": "└── Development Pipeline",
      "order": 3,
      "visible": true
    }
  ],
  "social_links": [
    {
      "platform": "github",
      "url": "https://github.com/findry/core",
      "label": "View Source"
    },
    {
      "platform": "twitter",
      "url": "https://twitter.com/findryapp",
      "label": "Follow Updates"
    }
  ],
  "background_color": "#000000",
  "text_color": "#ffffff",
  "accent_color": "#3b82f6",
  "custom_css": "body { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); } .hero-title { font-family: 'JetBrains Mono', monospace; text-shadow: 0 0 20px rgba(59, 130, 246, 0.3); } .cta-button:hover { box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4); transform: translateY(-2px); } pre code { background: #111111; border: 1px solid #333333; border-radius: 8px; padding: 1.5rem; font-size: 0.9rem; line-height: 1.6; } .component-card { backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease; } .component-card:hover { border-color: #3b82f6; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15); }"
}
```

This theme features:
- **Sharp Typography**: JetBrains Mono font for that terminal aesthetic
- **Deep Black Background**: Pure #000000 with subtle gradients
- **Electric Blue Accents**: High-contrast blue (#3b82f6) for CTAs and highlights  
- **Code-First Content**: Syntax highlighting and developer-focused messaging
- **Hover Effects**: Smooth animations and glow effects on interactive elements
- **Terminal Styling**: Command prompt inspired headings and navigation

Remember: Great landing pages tell a story, solve a problem, and inspire action. Choose the theme and content that best represents your project's personality and goals! 🚀