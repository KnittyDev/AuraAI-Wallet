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
        body: "The best thing about Aura was that it had been trained using Claude Opus 4.8, and during our discussions with the founders, we learned how Aura AI was trained to learn strategies and which datasets it used, because we were transitioning to autonomous investing and this was a critical strategy for the company’s funds; by selecting a strategy focused on aggressive and rapid growth, the AI opened positions, and it understood our needs and what we wanted",
      },
      {
        heading: "The Results",
        body: "Over the course of 120 days, Aura transformed the initial $350K into $779K. The most significant gains occurred during overnight volatility events where Aura's Risk Guard automatically hedged positions against sudden drops, preserving capital while maintaining upside exposure. Grayscale has since committed to migrating their entire institutional treasury to the Aura terminal.",
      },
    ],
  },
  {
    id: "solidchain-estate",
    company: "SolidChain",
    person: "Joseph N",
    role: "CEO",
    initials: "SC",
    quote:
      "Aura's fund protection feature is one of the best systems we've seen to date; as a crypto investor, I've made a 30% profit on the funds I've invested in.",
    result: "-34%",
    resultLabel: "Lower max drawdown",
    icon: LuShieldCheck,
    tag: "Risk",
    stats: [
      { label: "Starter Fund", value: "$45.000" },
      { label: "2 Months of Trading", value: "$60.742" },
      { label: "Total Growth", value: "+34%" },
      { label: "Win Rate", value: "82%" },
    ],
    monthlyPerformance: [
      { month: "April 2026", plan: "Balanced", capital: "$45,000", profit: "+4.4%", balance: "$47,000" },
      { month: "May 2026", plan: "Risk Guard", capital: "$47,000", profit: "+15.8%", balance: "$50,500" },
      { month: "June 2026", plan: "Risk Guard", capital: "$40,500", profit: "+21.2%", balance: "$43,742" },
      { month: "July 2026", plan: "Balanced", capital: "$40,742", profit: "+19.5%", balance: "$60,742" },
    ],
    content: [
      {
        heading: "The Challenge",
        body: "SolidChain, a crypto-based real estate platform, found that the profits we were generating were insufficient for our employees, so we allocated a portion of our revenue to invest in AuraAI.",
      },
      {
        heading: "The Aura Solution",
        body: "We delegated the investment decisions to Aura AI, and it began analyzing the market for us, and we have since increased the percentage of profits we make in our company.",
      },
      {
        heading: "Implementation Strategy",
        body: "We handed over our investment decisions to Aura AI; it opened a few positions and began analyzing the market for us, and since then, we’ve increased our company’s profit margin by 50%, which has been a lifesaver for us.",
      },
      {
        heading: "The Results",
        body: "The impact was felt immediately. During the major market correction in the second month, Aura’s Risk Guard feature successfully prevented a potential 20% loss, limiting it to just 4.2%; we were happy with that alone, but even better news followed: AuraAI, having detected the loss in the portfolio, enabled us to make a 10% profit three days later and over 40% profit in the following three weeks.",
      },
    ],
  },
  {
    id: "customer-2",
    company: "Customer",
    person: "Customer",
    role: "Teacher",
    initials: "CC",
    quote:
      "I was always afraid of investing in crypto because I was afraid of losing my money, but AuraAI gave me the confidence to start.",
    result: "2.1x",
    resultLabel: "Faster rebalance cycles",
    icon: LuRefreshCw,
    tag: "Efficiency",
    stats: [
      { label: "Starter Fund", value: "$4500" },
      { label: "4 Months of Trading", value: "$8900" },
      { label: "Total Growth", value: "+97%" },
      { label: "Win Rate", value: "82%" },
    ],
    monthlyPerformance: [
      { month: "January", plan: "Growth", capital: "$4500", profit: "+13.5%", balance: "$5120" },
      { month: "February", plan: "Growth", capital: "$5120", profit: "+22.1%", balance: "$6250" },
      { month: "March", plan: "Aggressive", capital: "$6250", profit: "+28.4%", balance: "$8000" },
      { month: "April", plan: "Aggressive", capital: "$8000", profit: "+36.2%", balance: "$10900" },
    ],
    content: [
      {
        heading: "The Challenge",
        body: "As a teacher, I don't have much time to research and trade cryptocurrencies, so I decided to use AuraAI to manage my portfolio, and I haven't regretted it since.",
      },
      {
        heading: "The Aura Solution",
        body: "I was always afraid of investing in crypto because I was afraid of losing my money, but AuraAI gave me the confidence to start.",
      },
      {
        heading: "Implementation Strategy",
        body: "I started with the little money, and I was able to make a profit of over 90% in just four months. I was so impressed with AuraAI that I decided to upgrade to the Professional plan.",
      },
      {
        heading: "The Results",
        body: "I was able to make a profit of over 90% in just four months. I was so impressed with AuraAI that I decided to start recommending it to my friends and family.",
      },
    ],
  },
];
