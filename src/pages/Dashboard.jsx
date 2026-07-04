import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
  Sparkles,
  Send,
  Calendar,
  Copy,
  RefreshCw,
  Flame,
  Briefcase,
  Smile,
  AlertCircle,
  Hash,
  
  
  MessageCircle,
  Video,
  Clapperboard,
  Clock,
  Check,
  X,
  Loader2,
  Image as ImageIcon,
  Mic,
  PlaySquare
} from 'lucide-react';
import { FaTwitter as Twitter, FaLinkedin as Linkedin, FaInstagram as Instagram, FaFacebook as Facebook } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import './Dashboard.css';

/* ──────── Platform config ──────── */
const PLATFORMS = [
  { id: 'x', label: 'X', icon: Twitter, color: 'var(--color-x)' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'var(--color-linkedin)' },
  { id: 'reddit', label: 'Reddit', icon: MessageCircle, color: 'var(--color-reddit)' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'var(--color-instagram)' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'var(--color-facebook)' },
];

const TONES = ['Professional', 'Casual', 'Humorous', 'Inspirational'];

/* ──────── Card icon map ──────── */
const CARD_ICONS = {
  'X Post': Twitter,
  'LinkedIn Post': Linkedin,
  'Reddit Post': MessageCircle,
  'Instagram Caption': Instagram,
  'Facebook Post': Facebook,
  'Thread Version': Hash,
  'Reel Hook': Video,
  '30-Second Reel Script': Clapperboard,
  'Hashtags': Hash,
};

/* ──────── Mock generated content variants ──────── */
const CONTENT_VARIANTS = {
  'X Post': [
    `Just shipped our SaaS in 47 days. No VC money. No fancy office. Just two devs, a Figma file, and an unhealthy amount of cold brew. ☕🚀\n\nWe hit $4K MRR in week one.\n\nHere's the playbook 🧵👇`,
    `Everyone says "launch fast." So we did — 47 days, $0 raised, $4K MRR on day 7.\n\nThe trick? We stopped building features nobody asked for. 🎯\n\nThread on what actually worked 👇`,
    `47 days. 2 devs. $4K MRR in week one. 🔥\n\nWe didn't wait for perfection — we launched with 3 core features and iterated like crazy.\n\nHere's what we'd do differently ⬇️`,
  ],
  'LinkedIn Post': [
    `I'm thrilled to share that after 47 days of intense building, we've officially launched our SaaS product — and the results have exceeded every expectation.\n\nWithin the first week, we crossed $4,000 in monthly recurring revenue. No venture capital. No accelerator. Just two engineers who decided to solve a real problem.\n\nHere's what I learned:\n\n1. Talk to users before writing a single line of code\n2. Ship the MVP in under 60 days or you're over-engineering\n3. Your first 10 customers will shape everything\n4. Distribution matters more than the product itself\n5. Celebrate small wins — they compound\n\nThe journey is just beginning, but I wanted to share this milestone with my network. If you're building something — keep going. The market rewards speed and conviction.\n\n#SaaS #Startup #Entrepreneurship #BuildInPublic`,
    `47 days ago, my co-founder and I made a bet: we'd build and launch a SaaS product before the quarter ended.\n\nToday, we're at $4K MRR — and here's the honest truth about what that journey looked like:\n\n→ Week 1-2: Customer interviews (50+ calls)\n→ Week 3-4: MVP development (ruthless prioritization)\n→ Week 5: Private beta with 20 users\n→ Week 6: Public launch on Product Hunt\n→ Week 7: $4K MRR milestone\n\nThe biggest lesson? Speed is a feature. Every day you delay is a day your competitor ships.\n\nTo everyone building in public — I see you. Keep shipping. 🚀\n\n#BuildInPublic #SaaS #StartupLife`,
    `We just hit $4K MRR in our first week post-launch. Here's the uncomfortable truth nobody talks about:\n\nThe product wasn't ready. The landing page had typos. Our onboarding was clunky.\n\nBut we shipped anyway.\n\nBecause perfection is the enemy of progress. And our users cared about the solution, not the polish.\n\n3 principles that made this possible:\n\n✅ Build for 1 user, not 1 million\n✅ Manual processes before automation\n✅ Talk to every single customer\n\nExcited for what's next. DMs are open if you're on a similar journey.\n\n#Entrepreneurship #SaaS #ProductLaunch`,
  ],
  'Reddit Post': [
    `**Title: We launched a SaaS in 47 days and hit $4K MRR in week one — AMA**\n\nHey r/SaaS,\n\nMy co-founder and I just launched our product after 47 days of building. We hit $4K MRR in the first week and wanted to share what worked (and what didn't).\n\nSome quick context:\n- 2-person team, both technical\n- $0 in funding, completely bootstrapped\n- Used React + Node + Postgres stack\n- Launched on Product Hunt (finished top 5)\n\nHappy to answer any questions about the tech stack, go-to-market strategy, pricing, or anything else. No gatekeeping here.\n\nEdit: Wow, this blew up. Answering as fast as I can!`,
    `**Title: From idea to $4K MRR in 47 days — here's our honest breakdown**\n\nI've seen a lot of "how we launched" posts that leave out the messy parts. Here's the full, unfiltered story.\n\nThe good:\n- Pre-sold to 15 customers before writing code\n- Kept the MVP insanely simple (3 features)\n- Product Hunt launch drove 2,000 signups\n\nThe bad:\n- Our payment integration broke on launch day\n- Lost sleep for 3 weeks straight\n- Got roasted on HN for our pricing page\n\nWould do it all again. AMA about any part of the process.`,
    `**Title: Just hit $4K MRR with a 47-day-old SaaS. Here's what I wish I knew before starting.**\n\nLong-time lurker, first-time poster here.\n\nMy co-founder and I shipped a B2B SaaS tool in under 7 weeks. Zero funding. Here's what surprised us most:\n\n1. Cold DMs on LinkedIn convert better than ads\n2. Free trials > freemium (for us at least)\n3. Support speed is your best marketing channel\n4. Nobody cares about your tech stack except you\n\nWe're completely transparent about our numbers and process. Ask away!`,
  ],
  'Instagram Caption': [
    `47 days.\nThat's all it took. ⚡\n\nFrom a napkin sketch to $4K MRR.\nNo investors. No office. No excuses.\n\nJust two founders who refused to wait\nfor the "perfect" moment. 💪\n\nThe truth? There IS no perfect moment.\nThere's just NOW.\n\nSo we built. We shipped. We iterated.\nAnd the market said YES. 🙌\n\nTo everyone sitting on an idea —\nthis is your sign. Start today. 🚀\n\n#SaaS #StartupLife #BuildInPublic #Entrepreneur #TechStartup #LaunchDay #MRR #FounderLife #Bootstrap #DreamBig`,
    `POV: You just shipped your SaaS in 47 days 🤯\n\n→ Week 1: "This will never work"\n→ Week 3: "Wait, people actually want this?"\n→ Week 5: "OMG someone paid for this"\n→ Week 7: "$4K MRR let's gooo" 🎉\n\nThe journey from zero to launch\nis messy, chaotic, and beautiful.\n\nDon't let imposter syndrome stop you.\nYour idea deserves to exist. ✨\n\n#FounderDiaries #SaaS #StartupJourney #BuildInPublic #TechEntrepreneur #IndieHacker #SmallBusiness #GrowthMindset`,
    `We did it. 🥹\n\n47 days of late nights, early mornings,\nand way too much coffee later —\nour SaaS is LIVE.\n\n$4K MRR in the first week.\nBootstrapped. Just two of us.\n\nThis isn't a flex.\nThis is proof that you don't need\npermission to build something great. 💫\n\nTag someone who needs to hear this 👇\n\n#LaunchDay #SaaSFounder #BuildInPublic #Startup #Entrepreneurship #TechStartup #IndieHacker #MondayMotivation`,
  ],
  'Facebook Post': [
    `Big news, everyone! 🎉\n\nAfter 47 days of building, late-night coding sessions, and probably too many energy drinks, my co-founder and I officially launched our SaaS product!\n\nAnd here's the part that still feels surreal — we hit $4,000 in monthly recurring revenue in just the first week.\n\nNo investors. No business loans. Just two friends who believed in an idea and went all-in.\n\nI'm sharing this not to brag, but because two years ago, I didn't think I could ever build something like this. If you're thinking about starting something — DO IT. The worst case is you learn an incredible amount.\n\nThank you to everyone who's supported us along the way. This community means everything. ❤️\n\nWho else is building something? Drop it in the comments — I want to support you too! 👇`,
    `Remember when I posted about having a "crazy idea" 2 months ago? Well... we did it! 🚀\n\nOur SaaS product is live, and we just crossed $4K MRR in our first week. I'm honestly still in shock.\n\nTo everyone who said "go for it" in the comments — THANK YOU. Your encouragement genuinely kept us going during the tough moments.\n\nHere's what the last 47 days taught me:\n• Start before you're ready\n• Your network is your net worth\n• Done is better than perfect\n• Celebrate every small win\n\nIf you're curious about what we built or want to try it out, the link is in the comments. We'd love your feedback! 💙`,
    `I have to pinch myself. 😊\n\n47 days ago, this was just a Google Doc with messy notes. Today, it's a real product with real paying customers — $4K/month and growing.\n\nBuilding a business with your best friend is wild. There are highs, lows, and moments where you question everything. But crossing this milestone together? Absolutely worth it.\n\nTo my friends and family reading this — thank you for believing in us even when we couldn't explain what we were building 😅\n\nBig things are coming. Stay tuned! 🎯`,
  ],
  'Thread Version': [
    `🧵 1/5 We just launched a SaaS in 47 days and hit $4K MRR in week one.\n\nHere's the exact playbook — no fluff, no gatekeeping:\n\n2/5 𝗣𝗵𝗮𝘀𝗲 𝟭: 𝗩𝗮𝗹𝗶𝗱𝗮𝘁𝗶𝗼𝗻 (Days 1-14)\n- 50 customer interviews in 10 days\n- Found 3 pain points that kept coming up\n- Pre-sold to 15 people before writing code\n- Used a Notion doc as our "MVP"\n\n3/5 𝗣𝗵𝗮𝘀𝗲 𝟮: 𝗕𝘂𝗶𝗹𝗱 (Days 15-35)\n- Chose the boring tech stack (React + Node)\n- Shipped 3 core features only\n- Ignored every "nice to have"\n- Daily standups, even on weekends\n\n4/5 𝗣𝗵𝗮𝘀𝗲 𝟯: 𝗟𝗮𝘂𝗻𝗰𝗵 (Days 36-47)\n- Product Hunt launch (Top 5)\n- 50 personalized LinkedIn DMs per day\n- Offered free onboarding calls\n- Responded to every single comment\n\n5/5 𝗥𝗲𝘀𝘂𝗹𝘁𝘀:\n- $4K MRR in 7 days\n- 200+ signups\n- 15% trial-to-paid conversion\n- 0 dollars spent on ads\n\nThe playbook is simple. Execution is everything.\n\nLike this? Follow me for more build-in-public updates 🚀`,
    `🧵 1/5 How we went from $0 to $4K MRR in 47 days (bootstrapped):\n\n2/5 𝗧𝗵𝗲 𝗜𝗱𝗲𝗮\nWe noticed every founder we knew was spending 3+ hours/day on social media content. So we built a tool to cut that to 15 minutes.\n\nSimple problem. Clear solution. That's it.\n\n3/5 𝗧𝗵𝗲 𝗕𝘂𝗶𝗹𝗱\n- 2 engineers, no designer\n- Used Tailwind + shadcn for UI\n- Postgres on Railway\n- Deployed on Vercel\n- Total infra cost: $20/month\n\n4/5 𝗧𝗵𝗲 𝗟𝗮𝘂𝗻𝗰𝗵\nWe didn't do a big reveal. We shipped quietly to 20 beta users, fixed bugs for a week, then went public.\n\nAnti-climactic? Sure. But it worked.\n\n5/5 𝗧𝗵𝗲 𝗟𝗲𝘀𝘀𝗼𝗻𝘀\n→ Speed beats perfection\n→ Talk to users every single day\n→ Your first version will embarrass you (that's fine)\n→ Distribution > Product\n\nBookmark this. You'll need it.\n\nFollow for the next update at $10K MRR 📈`,
    `🧵 1/5 47-day SaaS speedrun: $0 → $4K MRR. Let's break it down:\n\n2/5 𝗪𝗵𝗮𝘁 𝘄𝗲 𝗯𝘂𝗶𝗹𝘁:\nAn AI-powered content repurposing tool. Write once, publish everywhere.\n\nWe were our own first users — and we were tired of spending hours reformatting content for each platform.\n\n3/5 𝗪𝗵𝗮𝘁 𝗮𝗰𝘁𝘂𝗮𝗹𝗹𝘆 𝗱𝗿𝗼𝘃𝗲 𝗴𝗿𝗼𝘄𝘁𝗵:\n- Building in public (people love following the journey)\n- Cold outreach (50 DMs/day, 10% reply rate)\n- A killer Product Hunt launch\n- Word of mouth from happy beta users\n\n4/5 𝗠𝗶𝘀𝘁𝗮𝗸𝗲𝘀 𝘄𝗲 𝗺𝗮𝗱𝗲:\n- Over-engineered the auth system (wasted 4 days)\n- Priced too low initially ($9/mo → now $29/mo)\n- Didn't set up analytics from day 1\n- Ignored mobile UX until users complained\n\n5/5 𝗪𝗵𝗮𝘁'𝘀 𝗻𝗲𝘅𝘁:\n- Hiring our first support person\n- Launching a Chrome extension\n- Targeting $10K MRR by month 3\n\nThe best time to start was yesterday. The second best is now.\n\nRT to help other builders 🔁`,
  ],
  'Reel Hook': [
    `"We built a $4K/month business in 47 days with zero funding — and here's the one thing everyone gets wrong about launching a SaaS..."`,
    `"Stop building features. Seriously. We hit $4K MRR in one week by doing the exact OPPOSITE of what every startup guru tells you..."`,
    `"47 days ago we had nothing. Today we have $4K in recurring revenue. The secret? We broke every single 'rule' in the startup playbook."`,
  ],
  '30-Second Reel Script': [
    `[0:00-0:03] HOOK: "We built a $4K/month SaaS in just 47 days."\n\n[0:03-0:08] CONTEXT: "No funding. No team. Just two devs with a crazy idea and a deadline."\n\n[0:08-0:15] THE PROCESS: "Week 1: Talked to 50 potential customers. Week 3: Built the MVP. Week 5: Launched on Product Hunt. Week 7: $4K MRR."\n\n[0:15-0:22] THE INSIGHT: "The secret wasn't the code — it was talking to users before writing a single line. 80% of startups fail because they build what nobody wants."\n\n[0:22-0:27] PROOF: "We pre-sold 15 spots before the product even existed. That's how we knew we had something."\n\n[0:27-0:30] CTA: "Follow for the full breakdown. Link in bio."`,
    `[0:00-0:03] HOOK: "Stop building features nobody asked for."\n\n[0:03-0:08] PROBLEM: "Most founders spend months perfecting their product. We spent 47 days and launched with just 3 features."\n\n[0:08-0:15] SOLUTION: "We called 50 people, found 3 universal pain points, and ONLY built solutions for those. Nothing else."\n\n[0:15-0:22] RESULTS: "$4K MRR in week one. 200 signups. 15% conversion rate. Zero dollars on ads."\n\n[0:22-0:27] LESSON: "Your MVP should embarrass you. If it doesn't, you launched too late."\n\n[0:27-0:30] CTA: "Save this for when you're ready to launch. Follow for more."`,
    `[0:00-0:03] HOOK: "The $4K/month playbook nobody talks about."\n\n[0:03-0:08] SETUP: "47 days. 2 people. $0 budget. Here's exactly what we did."\n\n[0:08-0:15] STEPS: "Step 1: Validate with 50 customer calls. Step 2: Build only what they asked for. Step 3: Launch on Product Hunt. Step 4: Send 50 personal DMs daily."\n\n[0:15-0:22] KEY INSIGHT: "Distribution beats product. Every. Single. Time. We spent 60% of our time on marketing, not coding."\n\n[0:22-0:27] RESULTS: "First week: $4K MRR. And still growing."\n\n[0:27-0:30] CTA: "Comment 'PLAYBOOK' and I'll send you the full breakdown."`,
  ],
  Hashtags: [
    `#SaaS #StartupLife #BuildInPublic #Entrepreneur #IndieHacker #TechStartup #BootstrappedStartup #MRR #ProductHunt #FounderLife #StartupJourney #SaaSGrowth #LaunchDay #B2BSaaS #SoftwareStartup #ContentCreator #SocialMediaMarketing #AITools #ProductivityTools #GrowthHacking`,
    `#BuildInPublic #SaaS #Startup #Bootstrapped #IndieHacker #FounderDiaries #TechEntrepreneur #StartupGrowth #ProductLaunch #MRR #RecurringRevenue #SaaSMarketing #DigitalProducts #OnlineBusiness #PassiveIncome #SideProject #CodeAndCoffee #DevLife #ShipIt #MakerMovement`,
    `#SaaSFounder #StartupTips #EntrepreneurLife #TechStartups #ProductDevelopment #GrowthMindset #BusinessGrowth #DigitalMarketing #ContentStrategy #SocialMediaTips #AIContent #StartupAdvice #FounderTips #SmallBusiness #Innovation #Disruption #FutureOfWork #RemoteWork #SoloFounder #BuildAndShip`,
  ],
};

/* ──────── Card definitions ──────── */
const CARD_DEFS = [
  { title: 'X Post', platform: 'x' },
  { title: 'LinkedIn Post', platform: 'linkedin' },
  { title: 'Reddit Post', platform: 'reddit' },
  { title: 'Instagram Caption', platform: 'instagram' },
  { title: 'Facebook Post', platform: 'facebook' },
  { title: 'Thread Version', platform: 'x' },
  { title: 'Reel Hook', platform: 'instagram' },
  { title: '30-Second Reel Script', platform: 'instagram' },
  { title: 'Hashtags', platform: null },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { userId } = useAuth();

  const [connections, setConnections] = useState({});
  useEffect(() => {
    const saved = localStorage.getItem('postpilot_connections');
    if (saved) setConnections(JSON.parse(saved));
  }, []);

  /* ── Composer state ── */
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['x', 'linkedin']);
  const [tone, setTone] = useState('Professional');
  const [generating, setGenerating] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  /* ── Generated cards ── */
  const [cards, setCards] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [loadingCardId, setLoadingCardId] = useState(null);
  const [mode, setMode] = useState('text'); // 'text', 'image', 'voice', 'video'

  /* ── Platform toggle ── */
  const togglePlatform = useCallback((id) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  /* ── Generate ── */
  const handleGenerate = useCallback(async () => {
    if (!content.trim()) {
      addToast('Write something first to generate content.', 'warning');
      return;
    }
    setGenerating(true);
    setCards([]);
    setMediaItems([]);

    try {
      if (mode !== 'text') {
        const res = await fetch('/api/generate-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: content, type: mode })
        });
        
        if (!res.ok) throw new Error('Failed to generate media');
        
        const data = await res.json();
        setMediaItems([data]);
        addToast('Media generated successfully!', 'success');
      } else {
        const selectedLabels = selectedPlatforms.map(id => PLATFORMS.find(p => p.id === id)?.label || id);
      
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platforms: selectedLabels, tone })
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch from backend');
      }

      const data = await res.json();
      
      const generated = CARD_DEFS.reduce((acc, def, i) => {
        if (data[def.title] && Array.isArray(data[def.title]) && data[def.title].length > 0) {
          acc.push({
            id: `${def.title}-${Date.now()}-${i}`,
            title: def.title,
            platform: def.platform,
            body: data[def.title][0],
            variants: data[def.title],
            variantIndex: 0,
          });
        }
        return acc;
      }, []);
      
      if (generated.length === 0) {
        addToast('No content was generated by the AI.', 'warning');
      }
      
        setCards(generated);
        addToast('Content generated successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Error generating content from backend.', 'danger');
    } finally {
      setGenerating(false);
    }
  }, [content, selectedPlatforms, tone, addToast]);

  /* ── Copy ── */
  const handleCopy = useCallback(
    async (card) => {
      try {
        await navigator.clipboard.writeText(card.body);
        setCopiedId(card.id);
        addToast('Copied to clipboard!', 'success');
        setTimeout(() => setCopiedId(null), 1500);
      } catch {
        addToast('Failed to copy text.', 'danger');
      }
    },
    [addToast]
  );

  /* ── Variant shuffle helper ── */
  const shuffleVariant = useCallback((card) => {
    const variants = card.variants || [card.body];
    const nextIdx = (card.variantIndex + 1) % variants.length;
    return { ...card, body: variants[nextIdx], variantIndex: nextIdx };
  }, []);

  /* ── Action button handler (regenerate / viral / professional / funny) ── */
  const handleCardAction = useCallback(
    (cardId) => {
      setLoadingCardId(cardId);
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (c.id === cardId ? shuffleVariant(c) : c))
        );
        setLoadingCardId(null);
      }, 800);
    },
    [shuffleVariant]
  );

  /* ── Schedule ── */
  const handleSchedulePost = useCallback(() => {
    if (!scheduleDate || !scheduleTime) {
      addToast('Please select both a date and time.', 'warning');
      return;
    }
    addToast(
      `Post scheduled for ${scheduleDate} at ${scheduleTime}`,
      'success'
    );
    setScheduleOpen(false);
    setScheduleDate('');
    setScheduleTime('');
  }, [scheduleDate, scheduleTime, addToast]);

  /* ── Publish ── */
  const handlePublish = useCallback(async () => {
    if (cards.length === 0) {
      addToast('Generate some content first before publishing!', 'warning');
      return;
    }

    try {
      const payload = {
        userId: userId || 'default_user',
        // In a real app, you might publish different content to different platforms.
        // For MVP, we send the content of the first generated card or a combined text,
        // or we change the backend to accept an array of { platform, text }.
        // Let's change backend later if needed. For now, we'll just send the first card's body
        // or a combined text. Actually, let's just send the X post if X is selected.
        content: cards.find(c => c.platform === 'X (Twitter)')?.body || cards[0].body,
        platforms: selectedPlatforms,
      };

      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.success) {
        const hasErrors = data.results?.some(r => r.status === 'error');
        if (hasErrors) {
          const errors = data.results.filter(r => r.status === 'error').map(r => r.error).join(', ');
          addToast(`Failed to publish: ${errors}`, 'danger');
        } else {
          addToast('Post published successfully!', 'success');
        }
      } else {
        addToast(data.error || 'Failed to publish.', 'danger');
      }
    } catch (err) {
      addToast('Error publishing post.', 'danger');
    }
  }, [cards, selectedPlatforms, userId, addToast]);

  /* ──────── Skeleton cards ──────── */
  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="gen-card gen-card--skeleton glass"
        style={{ animationDelay: `${i * 0.08}s` }}
      >
        <div className="skeleton-bar skeleton-title" />
        <div className="skeleton-bar skeleton-line" />
        <div className="skeleton-bar skeleton-line short" />
        <div className="skeleton-bar skeleton-line" />
        <div className="skeleton-bar skeleton-line shorter" />
        <div className="skeleton-actions">
          <div className="skeleton-btn" />
          <div className="skeleton-btn" />
          <div className="skeleton-btn" />
        </div>
      </div>
    ));

  /* ──────── Render ──────── */
  return (
    <div className="dashboard">
      {/* ── LEFT: Composer ── */}
      <section className="composer animate-fadeInUp">
        <header className="composer-header">
          <Sparkles size={22} className="composer-header-icon" />
          <h1 className="composer-title">Compose</h1>
        </header>

        {/* Textarea */}
        <div className="composer-textarea-wrap glass">
          <textarea
            className="input textarea composer-textarea"
            placeholder="Write your idea, thought, or topic here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
          />
          <span className="char-count">{content.length} / 2 000</span>
        </div>

        {/* Mode selector */}
        <div className="selector-group">
          <label className="selector-label">Generation Mode</label>
          <div className="chip-row">
            <button className={`chip ${mode === 'text' ? 'chip--active' : ''}`} onClick={() => setMode('text')}>
              <Hash size={15} /> Text & Captions
            </button>
            <button className={`chip ${mode === 'image' ? 'chip--active' : ''}`} onClick={() => setMode('image')}>
              <ImageIcon size={15} /> Image Ad
            </button>
            <button className={`chip ${mode === 'voice' ? 'chip--active' : ''}`} onClick={() => setMode('voice')}>
              <Mic size={15} /> Voiceover
            </button>
            <button className={`chip ${mode === 'video' ? 'chip--active' : ''}`} onClick={() => setMode('video')}>
              <PlaySquare size={15} /> Video Ad
            </button>
          </div>
        </div>

        {/* Platform chips (Only show if text mode) */}
        {mode === 'text' && (
          <div className="selector-group">
            <label className="selector-label">Platforms</label>
            <div className="chip-row">
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              const active = selectedPlatforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  className={`chip ${active ? 'chip--active' : ''}`}
                  style={active ? { borderColor: p.color, color: p.color } : {}}
                  onClick={() => togglePlatform(p.id)}
                  aria-pressed={active}
                >
                  <Icon size={15} />
                  {p.label}
                </button>
              );
            })}
            </div>
            
            {/* Show alert if any selected platform is not connected */}
            {selectedPlatforms.map(platformId => {
              const platformName = PLATFORMS.find(p => p.id === platformId)?.label;
              const isConnected = platformId === 'x' ? connections.twitter : connections[platformId];
              
              if (!isConnected) {
                return (
                  <div key={`alert-${platformId}`} className="unlinked-alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', padding: '8px 12px', background: 'var(--bg-glass)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px' }}>
                    <AlertCircle size={14} color="#f59e0b" />
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <strong>{platformName}</strong> is not linked.
                    </span>
                    <button 
                      onClick={() => navigate('/app/integrations')} 
                      style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Link Now
                    </button>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Tone pills */}
        <div className="selector-group">
          <label className="selector-label">Tone</label>
          <div className="chip-row">
            {TONES.map((t) => (
              <button
                key={t}
                className={`chip ${tone === t ? 'chip--active chip--tone-active' : ''}`}
                onClick={() => setTone(t)}
                aria-pressed={tone === t}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="composer-actions">
          <button
            className="btn btn-primary btn-lg composer-btn"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <Sparkles size={18} />
            )}
            {generating ? 'Generating…' : 'AI Generate'}
          </button>

          <button
            className={`btn btn-secondary btn-lg composer-btn ${scheduleOpen ? 'btn--active' : ''}`}
            onClick={() => setScheduleOpen((v) => !v)}
          >
            <Calendar size={18} />
            Schedule
          </button>
        </div>

        {/* Schedule panel */}
        {scheduleOpen && (
          <div className="schedule-panel glass animate-fadeInUp">
            <div className="schedule-fields">
              <div className="schedule-field">
                <label className="selector-label" htmlFor="sched-date">
                  Date
                </label>
                <input
                  id="sched-date"
                  type="date"
                  className="input"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
              <div className="schedule-field">
                <label className="selector-label" htmlFor="sched-time">
                  Time
                </label>
                <input
                  id="sched-time"
                  type="time"
                  className="input"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
            </div>
            <button
              className="btn btn-primary btn-lg schedule-confirm"
              onClick={handleSchedulePost}
            >
              <Clock size={18} />
              Schedule Post
            </button>
          </div>
        )}

        {/* Publish */}
        <button
          className="btn btn-primary btn-lg publish-btn"
          onClick={handlePublish}
        >
          <Send size={18} />
          Publish Now
        </button>
      </section>

      {/* ── RIGHT: Generated Content ── */}
      <section className="generated">
        {!generating && cards.length === 0 && mediaItems.length === 0 && (
          <div className="generated-empty animate-fadeIn">
            <Sparkles size={40} className="empty-icon" />
            <h2 className="empty-title">Your AI-generated content will appear here</h2>
            <p className="empty-sub">
              Write an idea on the left, pick your platforms, and hit{' '}
              <strong>AI Generate</strong>.
            </p>
          </div>
        )}

        {generating && (
          <div className="gen-grid">{renderSkeletons()}</div>
        )}

        {!generating && cards.length > 0 && (
          <div className="gen-grid">
            {cards.map((card, index) => {
              const Icon = CARD_ICONS[card.title] || Hash;
              const isLoading = loadingCardId === card.id;
              return (
                <div
                  key={card.id}
                  className="gen-card glass animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Card header */}
                  <div className="gen-card-header">
                    <Icon size={16} className="gen-card-platform-icon" />
                    <span className="gen-card-title">{card.title}</span>
                  </div>

                  {/* Card body */}
                  <div className={`gen-card-body ${isLoading ? 'shimmer-overlay' : ''}`}>
                    <pre className="gen-card-text">{card.body}</pre>
                  </div>

                  {/* Card actions */}
                  <div className="gen-card-actions">
                    <button
                      className="btn btn-ghost btn-sm gen-action"
                      onClick={() => handleCopy(card)}
                      title="Copy"
                    >
                      {copiedId === card.id ? (
                        <>
                          <Check size={14} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm gen-action"
                      onClick={() => handleCardAction(card.id)}
                      title="Regenerate"
                      disabled={isLoading}
                    >
                      <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm gen-action"
                      onClick={() => handleCardAction(card.id)}
                      title="More Viral"
                      disabled={isLoading}
                    >
                      <Flame size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm gen-action"
                      onClick={() => handleCardAction(card.id)}
                      title="More Professional"
                      disabled={isLoading}
                    >
                      <Briefcase size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm gen-action"
                      onClick={() => handleCardAction(card.id)}
                      title="More Funny"
                      disabled={isLoading}
                    >
                      <Smile size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!generating && mediaItems.length > 0 && (
          <div className="gen-grid">
            {mediaItems.map((media) => (
              <div key={media.id} className="gen-card glass animate-fadeInUp" style={{ padding: '24px' }}>
                <div className="gen-card-header" style={{ marginBottom: '16px' }}>
                  <span className="gen-card-title">AI Generated {media.type.toUpperCase()}</span>
                </div>
                {media.imageUrl && (
                  <img src={media.imageUrl} alt="Generated" style={{ width: '100%', borderRadius: '12px', marginBottom: '16px' }} />
                )}
                {media.audioUrl && (
                  <audio controls style={{ width: '100%', marginBottom: '16px' }}>
                    <source src={media.audioUrl} type="audio/mpeg" />
                  </audio>
                )}
                {media.videoUrl && (
                  <video controls style={{ width: '100%', borderRadius: '12px' }}>
                    <source src={media.videoUrl} type="video/mp4" />
                  </video>
                )}
                <div className="gen-card-actions">
                  {(media.imageUrl || media.audioUrl || media.videoUrl) && (
                    <button className="btn btn-secondary btn-sm" onClick={() => window.open(media.videoUrl || media.audioUrl || media.imageUrl, '_blank')}>
                      <Copy size={14} /> Download Asset
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
