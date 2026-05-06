import { LuTrendingUp, LuShieldCheck, LuRefreshCw } from "react-icons/lu";

export const caseStudies = [
  {
    id: "grayscale-ventures",
    company: "Grayscale Ventures",
    person: "James Whitfield",
    role: "Chief Investment Officer",
    initials: "JW",
    quote:
      "We moved from manual spot decisions to fully automated strategy runs. Aura handles what our 6-person trading desk used to do.",
    result: "+128%",
    resultLabel: "Quarterly profit growth",
    icon: LuTrendingUp,
    tag: "Growth",
    stats: [
      { label: "Initial Capital", value: "$350K" },
      { label: "Final Balance", value: "$779K" },
      { label: "Growth Factor", value: "2.2x" },
      { label: "Avg. Monthly Return", value: "22.3%" },
    ],
    monthlyPerformance: [
      { month: "January", plan: "Growth", capital: "$350,000", profit: "+14.2%", balance: "$399,700" },
      { month: "February", plan: "Growth", capital: "$399,700", profit: "+18.5%", balance: "$473,644" },
      { month: "March", plan: "Aggressive", capital: "$473,644", profit: "+24.1%", balance: "$587,792" },
      { month: "April", plan: "Aggressive", capital: "$587,792", profit: "+32.4%", balance: "$778,237" },
    ],
    content: [
      {
        heading: "The Challenge",
        body: "Grayscale Ventures was operating a legacy crypto desk where human emotion and 24/7 fatigue led to significant execution slippage. Their traditional strategies were failing to capture high-velocity market shifts during APAC hours, and manual position management was limiting their ability to scale capital effectively beyond their $350K initial test-run.",
      },
      {
        heading: "The Aura Solution",
        body: "By deploying the Aura Neural Engine, Grayscale transitioned to a fully autonomous execution layer. Aura's sub-15ms latency and algorithmic precision allowed for high-frequency adjustments that human traders simply couldn't match. The engine was configured with a 'Growth-First' bias, leveraging Aura's proprietary neural feedback loops to identify and exploit microstructure imbalances 24 hours a day.",
      },
      {
        heading: "Implementation Strategy",
        body: "The rollout began with Aura's 'Shadow Mode,' where the AI mirrored their live desk's intent but optimized entry/exit points. Within 10 days, Aura's optimized execution yielded 4.2% more efficiency than the human desk. Grayscale then enabled 'Full Autonomy,' allowing Aura to manage the entire lifecycle of their $350K capital across major pairs with integrated Risk Guard protection.",
      },
      {
        heading: "The Results",
        body: "Over the course of 120 days, Aura transformed the initial $350K into $779K. The most significant gains occurred during overnight volatility events where Aura's Risk Guard automatically hedged positions against sudden drops, preserving capital while maintaining upside exposure. Grayscale has since committed to migrating their entire institutional treasury to the Aura terminal.",
      },
    ],
  },
  {
    id: "blocktower-capital",
    company: "BlockTower Capital",
    person: "Sarah Chen",
    role: "Head of Risk Management",
    initials: "SC",
    quote:
      "Aura's Risk Guard is the most sophisticated protection layer we've ever deployed. It doesn't just stop losses; it actively defends the portfolio value.",
    result: "-34%",
    resultLabel: "Lower max drawdown",
    icon: LuShieldCheck,
    tag: "Risk",
    stats: [
      { label: "AUM Before", value: "$45M" },
      { label: "AUM After", value: "$84.8M" },
      { label: "Avg. Monthly Return", value: "17.2%" },
      { label: "Win Rate", value: "82%" },
    ],
    monthlyPerformance: [
      { month: "January", plan: "Balanced", capital: "$45,000,000", profit: "+12.4%", balance: "$50,580,000" },
      { month: "February", plan: "Risk Guard", capital: "$50,580,000", profit: "+15.8%", balance: "$58,571,640" },
      { month: "March", plan: "Risk Guard", capital: "$58,571,640", profit: "+21.2%", balance: "$70,988,827" },
      { month: "April", plan: "Balanced", capital: "$70,988,827", profit: "+19.5%", balance: "$84,831,648" },
    ],
    content: [
      {
        heading: "The Challenge",
        body: "BlockTower Capital managed a substantial $45M portfolio but lacked a systematic way to defend against 'Black Swan' events and rapid market corrections. Their manual stop-loss adjustments were consistently lagging behind market volatility, leading to unnecessary drawdowns and prolonged recovery periods that frustrated stakeholders.",
      },
      {
        heading: "The Aura Solution",
        body: "Aura AI was integrated as a dynamic 'Risk Guard' overlay. Unlike traditional tools, Aura's Risk Guard utilizes real-time neural analysis of 300+ on-chain signals to predict liquidity crunches before they happen. It doesn't just exit positions; it intelligently hedges using correlated assets to keep the portfolio's growth curve smooth even during turbulence.",
      },
      {
        heading: "Implementation Strategy",
        body: "BlockTower utilized Aura's 'Balanced Strategy' which combines growth-oriented trades with a constant defensive posture. The implementation focused on automating 'Volatility-Adjusted Sizing' — where Aura automatically reduces position sizes when market uncertainty rises, effectively acting as an automated Chief Risk Officer (CRO) for their institutional capital.",
      },
      {
        heading: "The Results",
        body: "The impact was immediate. During a major market correction in month 2, Aura's Risk Guard successfully mitigated a potential 20% drawdown, limiting it to just 4.2% while competitors faced double-digit losses. By the end of the quarter, the portfolio grew from $45M to over $84.8M, maintaining an incredible 82% win rate across all AI-managed executions.",
      },
    ],
  },
  {
    id: "pantera-digital",
    company: "Pantera Digital",
    person: "Michael Torres",
    role: "Portfolio Manager",
    initials: "MT",
    quote:
      "Aura's cross-market algorithmic execution is a game-changer. We've achieved capital efficiency that was previously only available to tier-1 banks.",
    result: "2.1x",
    resultLabel: "Faster rebalance cycles",
    icon: LuRefreshCw,
    tag: "Efficiency",
    stats: [
      { label: "AUM Before", value: "$8.5M" },
      { label: "AUM After", value: "$20.6M" },
      { label: "Avg. Monthly Return", value: "25.1%" },
      { label: "Markets Covered", value: "14" },
    ],
    monthlyPerformance: [
      { month: "January", plan: "Growth", capital: "$8,500,000", profit: "+13.5%", balance: "$9,647,500" },
      { month: "February", plan: "Growth", capital: "$9,647,500", profit: "+22.1%", balance: "$11,779,597" },
      { month: "March", plan: "Aggressive", capital: "$11,779,597", profit: "+28.4%", balance: "$15,124,996" },
      { month: "April", plan: "Aggressive", capital: "$15,124,996", profit: "+36.2%", balance: "$20,600,245" },
    ],
    content: [
      {
        heading: "The Challenge",
        body: "Pantera Digital was struggling with capital fragmentation across 14 different global markets. Their manual rebalancing cycles were slow, creating significant 'Capital Drift' where idle assets were not contributing to portfolio growth. They needed a way to synchronize their global liquidity without massive operational overhead.",
      },
      {
        heading: "The Aura Solution",
        body: "Aura's 'Autonomous Efficiency' engine was deployed to manage their cross-market liquidity. By treating their entire $8.5M AUM as a single, fluid pool of capital, Aura began 24/7 algorithmic rebalancing. The system identifies yield opportunities and liquidity gaps across all markets simultaneously, routing capital where it can be most effective within seconds.",
      },
      {
        heading: "Implementation Strategy",
        body: "The team configured Aura to run on an 'Aggressive Efficiency' profile. This enabled Aura to not only rebalance existing positions but also to proactively enter high-confidence trades identified by the Neural Engine. The implementation eliminated the human-driven delay between market analysis and execution, turning Pantera into a high-speed trading powerhouse.",
      },
      {
        heading: "The Results",
        body: "The results were transformative. Pantera's $8.5M capital grew to over $20.6M in just four months. By automating the entire rebalancing and entry lifecycle, Aura increased their capital efficiency by 110%, effectively doing the work of a 15-person quant team while operating with 2.1x faster execution cycles than their industry peers.",
      },
    ],
  },
];
