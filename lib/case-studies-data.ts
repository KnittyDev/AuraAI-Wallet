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
      { label: "AUM Before", value: "$12M" },
      { label: "AUM After", value: "$27.4M" },
      { label: "Team Size Reduced", value: "6 → 2" },
      { label: "Avg. Monthly Return", value: "8.2%" },
    ],
    content: [
      {
        heading: "The Challenge",
        body: "Grayscale Ventures was running a traditional crypto trading desk with six full-time traders monitoring markets around the clock. Despite their expertise, the team struggled with emotional decision-making during high-volatility events and consistently missed overnight opportunities in Asian markets. Operating costs were climbing, and the manual approach couldn't scale with their growing AUM.",
      },
      {
        heading: "The Solution",
        body: "In Q3 2024, Grayscale onboarded Aura AI Wallet as their primary execution layer. The integration took less than 48 hours. Aura's neural engine was configured with their existing risk parameters and began autonomous trading across BTC, ETH, and SOL pairs. The system operates 24/7, executing trades with 12ms average latency and applying institutional-grade risk controls at every position.",
      },
      {
        heading: "The Implementation",
        body: "The transition was phased over two weeks. During the first week, Aura ran in shadow mode — executing paper trades alongside the human desk to validate its decision-making. By day 8, Aura's paper portfolio outperformed the live desk by 3.2%. The team switched to full autonomous mode on day 10. Four traders were reassigned to research and strategy development roles, while two remained as oversight supervisors.",
      },
      {
        heading: "The Results",
        body: "Within the first quarter of deployment, Grayscale saw a 128% increase in trading profits. The system's ability to react instantly to market microstructure changes — something impossible for human traders — was the primary driver. Overnight trades in APAC hours, which were previously missed entirely, now account for 34% of total profits. Operating costs dropped by 60% while AUM more than doubled from $12M to $27.4M.",
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
      "Aura's risk guards cut our drawdown significantly while maintaining upside exposure across volatile market conditions.",
    result: "-34%",
    resultLabel: "Lower max drawdown",
    icon: LuShieldCheck,
    tag: "Risk",
    stats: [
      { label: "Max Drawdown Before", value: "-18.4%" },
      { label: "Max Drawdown After", value: "-12.1%" },
      { label: "Sharpe Ratio", value: "2.8" },
      { label: "Win Rate", value: "74%" },
    ],
    content: [
      {
        heading: "The Challenge",
        body: "BlockTower Capital managed a $45M digital asset portfolio with aggressive growth targets. However, their risk management was largely reactive — stop-losses were manually adjusted, and portfolio rebalancing happened on a weekly cadence. During the March 2024 correction, their portfolio experienced an 18.4% drawdown that took six weeks to recover from. The board demanded a systematic approach to risk.",
      },
      {
        heading: "The Solution",
        body: "BlockTower integrated Aura AI's risk management engine as an overlay on their existing portfolio. Rather than replacing their investment thesis, Aura acted as an intelligent risk guardian — monitoring 200+ on-chain and off-chain signals in real-time to detect early signs of market stress. The system was configured to automatically hedge positions, reduce exposure, and tighten stop-losses when volatility exceeded defined thresholds.",
      },
      {
        heading: "The Implementation",
        body: "Sarah Chen's team worked with Aura's configuration layer to encode their risk tolerance matrix — defining acceptable drawdown limits per asset class, correlation thresholds for portfolio concentration, and volatility-adjusted position sizing rules. The system was calibrated using 18 months of historical portfolio data to ensure it understood BlockTower's specific risk profile.",
      },
      {
        heading: "The Results",
        body: "In the six months following deployment, BlockTower's maximum drawdown decreased by 34% — from -18.4% to -12.1%. Critically, this risk reduction didn't come at the expense of returns. The portfolio's Sharpe ratio improved from 1.9 to 2.8, indicating significantly better risk-adjusted performance. The win rate on individual trades increased to 74%, and recovery time from drawdowns shortened from weeks to days.",
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
      "Continuous rebalancing improved our capital efficiency dramatically. We no longer miss overnight opportunities in Asian markets.",
    result: "2.1x",
    resultLabel: "Faster rebalance cycles",
    icon: LuRefreshCw,
    tag: "Efficiency",
    stats: [
      { label: "Rebalance Frequency", value: "24/7" },
      { label: "Capital Efficiency", value: "+110%" },
      { label: "Slippage Reduction", value: "-62%" },
      { label: "Markets Covered", value: "14" },
    ],
    content: [
      {
        heading: "The Challenge",
        body: "Pantera Digital operated across 14 different crypto markets spanning three continents. Their portfolio required frequent rebalancing to maintain target allocations, but the process was slow and manual. By the time the New York team completed a rebalancing cycle, Asian markets had already shifted — creating persistent allocation drift that eroded returns. Slippage on large rebalancing orders was eating into performance.",
      },
      {
        heading: "The Solution",
        body: "Pantera deployed Aura AI as their continuous rebalancing engine. Unlike traditional periodic rebalancing (weekly or monthly), Aura monitors allocation drift in real-time and executes micro-adjustments throughout the day. The system uses intelligent order routing to minimize market impact and slippage, breaking large rebalancing trades into optimally-timed smaller orders.",
      },
      {
        heading: "The Implementation",
        body: "Michael Torres and his team defined target allocations and acceptable drift bands for each of their 14 market positions. Aura's engine was connected to their exchange accounts via API and began monitoring in real-time. The system was configured to prioritize capital efficiency — routing rebalancing flows through the most liquid venues and timing executions to coincide with peak liquidity windows across global markets.",
      },
      {
        heading: "The Results",
        body: "Rebalancing cycles that previously took 4-6 hours and happened weekly now occur continuously with zero human intervention. Capital efficiency improved by 110%, meaning Pantera's portfolio generates significantly more return per dollar deployed. Slippage on rebalancing trades decreased by 62% thanks to Aura's intelligent order splitting. The overnight gap in Asian markets was completely eliminated — the system now captures opportunities 24/7 across all 14 markets simultaneously.",
      },
    ],
  },
];
