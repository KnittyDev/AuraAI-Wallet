"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "tr";

type TranslationDictionary = {
  [key in Language]: {
    [category: string]: {
      [key: string]: any;
    };
  };
};

const translations: TranslationDictionary = {
  en: {
    header: {
      pricing: "Pricing",
      features: "Features",
      results: "Results",
      caseStudies: "Case Studies",
      faq: "FAQ",
      resources: "Resources",
      insights: "Insights",
      learn: "Learn",
      blog: "Blog",
      stories: "Customer stories",
      storiesSoon: "Soon",
      news: "Aura news",
      academy: "Academy",
      support: "Support Center",
      tutorials: "Tutorials",
      careers: "Careers",
      contactSales: "Contact sales",
      tryNow: "Try Now",
      dashboard: "Dashboard"
    },
    hero: {
      eyebrow: "Claude Opus 4.7 — Max",
      title1: "Let AI Manage ",
      title2: "Your Portfolio",
      subtitle: "Aura AI continuously analyzes markets, manages risk, and executes trades — so your portfolio keeps working even when you don't.",
      ctaDashboard: "Go to Dashboard",
      ctaStart: "Start for Free",
      ctaTalk: "Let's Talk"
    },
    prompt: {
      assetsManaged: "Assets Managed",
      uptime: "Uptime",
      avgResponse: "Avg. Response",
      ticker: "Aura AI is running live strategies"
    },
    marquee: {
      title: "Trusted by Institutional Partners & Crypto Apps"
    },
    pricing: {
      title: "Pricing",
      free: {
        name: "Free",
        price: "$0",
        description: "A limited but powerful automated portfolio experience for new users.",
        features: [
          "Opus 4.6 AI Model",
          "5 automated trades per day",
          "1 managed portfolio",
          "Basic weekly performance reports",
          "Basic buy/sell suggestions",
          "Automated flow using general strategies",
          "1 withdrawal every 3 days",
          "And more"
        ],
        cta: "Start Free"
      },
      pro: {
        name: "Pro",
        price: "$15 / 3 months",
        description: "Full autonomous mode: AI manages trades 24/7. Billed every 3 months.",
        features: [
          "Opus 4.7 Max AI Model",
          "Capital Protection: 15% Loss Recovery",
          "Unlimited automated trades",
          "Unlimited portfolio management",
          "Instant withdrawals",
          "Daily and weekly performance reports",
          "Auto sell / auto buy",
          "24/7 autonomous trade execution and management",
          "Fully autonomous portfolio operations",
          "And more"
        ],
        cta: "Upgrade to Pro"
      },
      enterprise: {
        name: "Enterprise",
        price: "Custom",
        description: "Built exclusively for company investment operations with protected capital frameworks.",
        features: [
          "Company-only investment model",
          "Security deposit / guarantee collateral setup",
          "Partial loss recovery returned to the company",
          "Custom capital protection terms",
          "Enterprise-grade risk monitoring",
          "Dedicated investment support"
        ],
        cta: "Contact Sales"
      }
    },
    features: {
      prediction: {
        title: "Easy to use",
        description: "Even if you have no knowledge of trading, cryptocurrency, or stock market, the Aura Opus 4.7 model handles all your trades fully autonomously!",
        button: "Start Trading",
        status: "System Status",
        trading: "Autonomous Trading",
        active: "Model: Active",
        standby: "Model: Standby",
        profit: "Total Profit",
        live: "Global Live"
      },
      ai: {
        title: "Trade with AI",
        description: "Use model-powered portfolio ideas and instantly convert them into actionable trade logic with a single prompt.",
        button: "Generate Strategy",
        strategy: "Growth Strategy"
      },
      sleep: {
        title: "Let it run while you sleep",
        description: "While you sleep, Aura autonomously executes trades based on your configured strategy and provides real-time notifications.",
        button: "Automate Now",
        success: "Execution Success",
        mode: "Aura Autonomous Mode",
        profit: "Profit realized"
      },
      risk: {
        title: "Low Risk High Returns",
        description: "Aura monitors market risk and automatically adjusts or pauses trading to protect your capital and maximize yield.",
        button: "View Performance",
        guard: "Risk Guard Active",
        stability: "System Stability"
      }
    },
    results: {
      title: "Real Results",
      disclaimer: "*Illustrative 30-day estimate based on historical strategy benchmarks. (Opus 4.7 model)",
      invest: "You invest in 1 month",
      auraEarn: "You earn with Aura AI Wallet*",
      manualEarn: "You earn with manual trading",
      monthlyInvested: "Monthly invested",
      profitDifference: "Profit difference",
      monthlyProfitUsd: "Monthly profit (USD)",
      manualLabel: "Manual",
      auraLabel: "Aura AI"
    },
    benchmark: {
      title: "AI Benchmark",
      topModel: "Top Model",
      scoreLead: "Score lead",
      compositeDesc: "*Composite score from 10,000+ live crypto scenarios. BTC, ETH, SOL pairs. May 2026.",
      compositeIndex: "Composite Index",
      accuracy: "Prediction accuracy",
      liveMarkets: "Live crypto markets",
      latency: "Execution latency",
      edgeRuntime: "Edge Runtime",
      sharpe: "Sharpe ratio",
      riskReturns: "Risk-adjusted returns",
      financialScore: "Financial Intelligence Score"
    },
    caseStudies: {
      eyebrow: "Proven Outcomes",
      title: "Case Studies",
      subtitle: "Real portfolio teams using Aura to optimize autonomous trade operations in production.",
      readFull: "Read full case study",
      tags: {
        growth: "Growth",
        risk: "Risk",
        efficiency: "Efficiency"
      },
      roles: {
        grayscale: "Chief Investment Officer",
        solidchain: "CEO",
        customer: "Teacher"
      },
      resultLabels: {
        grayscale: "Quarterly profit growth",
        solidchain: "Lower max drawdown",
        customer: "Faster rebalance cycles"
      },
      quotes: {
        grayscale: "We moved from manual spot decisions to fully automated strategy runs. Aura handles what our 6-person trading desk used to do.",
        solidchain: "Aura's fund protection feature is one of the best systems we've seen to date; as a crypto investor, I've made a 30% profit on the funds I've invested in.",
        customer: "I was always afraid of investing in crypto because I was afraid of losing my money, but AuraAI gave me the confidence to start."
      }
    },
    faq: {
      title: "Questions?",
      subtitle: "Everything you need to know before you start.",
      items: [
        {
          question: "What exactly is Aura AI?",
          answer: "Aura is an AI-native autonomous trading and portfolio management platform. It uses advanced language models and real-time market data to execute complex investment strategies, manage risk, and optimize your crypto holdings without requiring manual intervention."
        },
        {
          question: "How does the AI make trading decisions?",
          answer: "Aura AI leverages the Claude Opus 4.7 model, utilizing advanced artificial intelligence specifically trained in the domains of investment and cryptocurrency. The system continuously analyzes real-time news, social sentiment, on-chain data, and live market streams. It autonomously executes trades based on its assessment of these signals to optimize performance in line with your risk profile."
        },
        {
          question: "Is my capital secure with Aura?",
          answer: "Security is our top priority. Aura uses institutional-grade encryption for all data and API connections. We never have direct access to withdraw your funds from connected exchanges; the system only has 'Trade' and 'View' permissions. Additionally, we use multi-sig cold storage for any assets held within the Aura ecosystem."
        },
        {
          question: "Which assets and exchanges are supported?",
          answer: "Aura currently supports all major cryptocurrencies including BTC, ETH, SOL, and USDT. We provide seamless integration with top-tier exchanges like Binance, Coinbase, and Kraken, as well as direct on-chain execution for decentralized protocols."
        },
        {
          question: "How does the Pro plan differ from the Free plan?",
          answer: "While the Free plan allows you to explore basic portfolio tracking and manual AI suggestions, the Pro plan ($15/mo) unlocks 24/7 fully autonomous trading, instant withdrawals, advanced risk guardrails, and priority execution on all strategies."
        },
        {
          question: "How does Aura handle extreme market volatility?",
          answer: "Aura includes 'Neural Risk Guards' that monitor market stress 24/7. In the event of a flash crash or extreme volatility, the AI can automatically move assets to stables, tighten stop-losses, or hedge positions using shorts to protect your capital from significant drawdowns."
        },
        {
          question: "Are there any hidden fees per trade?",
          answer: "No. Aura does not charge any percentage-based commissions or hidden spreads on your trades. You only pay your monthly subscription fee (if on Pro) and the standard transaction fees charged by the underlying exchanges or blockchain networks."
        },
        {
          question: "Can I cancel my subscription at any time?",
          answer: "Yes. You can downgrade or cancel your Pro subscription at any time with a single click. There are no long-term contracts or cancellation fees."
        },
        {
          question: "Why is there a monthly subscription fee?",
          answer: "Operating a 24/7 autonomous AI requires significant compute resources. Your subscription directly covers the high cost of Claude Opus 4.7 tokens (which Aura 'burns' as it analyzes data), high-frequency market data streams, and the secure cloud infrastructure required to execute trades with millisecond latency across global markets."
        },
        {
          question: "Is manual approval required for deposits or withdrawals?",
          answer: "Absolutely not. When you create an account, your crypto wallets are automatically generated. Deposits and withdrawals are handled automatically by the system and the blockchain exclusively through these dedicated wallets, ensuring a seamless and fully autonomous experience."
        }
      ]
    },
    footer: {
      product: "Product",
      company: "Company",
      legal: "Legal",
      about: "About",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      status: "System Status",
      rights: "Aura. All rights reserved.",
      desc: "Autonomous portfolio intelligence with always-on execution and clear performance insights.",
      binance: "Binance infrastructure",
      swissEng: "Engineered in Switzerland",
      swissQuality: "Swiss Quality & Precision",
      euCompliant: "Compliant with EU Standards",
      euPlatform: "EU Compliant Platform"
    },
    auth: {
      login: {
        title1: "Invest fast, ",
        title2: "grow faster.",
        subtitle: "Analyze in chat, invest with Aura. The intelligence engine for modern portfolios.",
        google: "Continue with Google",
        or: "OR",
        emailPlaceholder: "Enter your email",
        passwordPlaceholder: "Enter your password",
        submit: "Continue with email",
        submitting: "Signing in...",
        policy: "By continuing, you acknowledge Aura's ",
        policyLink: "Privacy Policy",
        policyEnd: ".",
        noAccount: "Don't have an account? ",
        createOne: "Create one",
        downloadApp: "Download desktop app",
        twoFactor: {
          title: "Two-Factor Verification",
          subtitle: "Enter the 6-digit code from your authenticator app to continue.",
          refresh: "Code refreshes every 30 seconds",
          submit: "Verify & Continue",
          submitting: "Verifying...",
          cancel: "Cancel Login",
          invalidCode: "Invalid code. Please try again."
        }
      },
      register: {
        title1: "Join the future, ",
        title2: "start today.",
        subtitle: "Create your account and let Aura manage your institutional-grade portfolio.",
        google: "Join with Google",
        or: "OR",
        fullName: "Full Name",
        username: "Public Username",
        anonymous: "I want to be an anonymous investor",
        emailAddress: "Email address",
        createPassword: "Create a password",
        strength: {
          weak: "Weak Password",
          fair: "Fair Security",
          good: "Good Password",
          strong: "Strong / Secure"
        },
        submit: "Create Account",
        submitting: "Creating account...",
        policy: "By signing up, you acknowledge Aura's ",
        policyLink1: "Privacy Policy",
        policyAnd: " and ",
        policyLink2: "Terms",
        policyEnd: ".",
        alreadyAccount: "Already have an account? ",
        signIn: "Sign in",
        downloadApp: "Download desktop app"
      }
    }
  },
  tr: {
    header: {
      pricing: "Fiyatlandırma",
      features: "Özellikler",
      results: "Sonuçlar",
      caseStudies: "Vaka Çalışmaları",
      faq: "SSS",
      resources: "Kaynaklar",
      insights: "Analizler",
      learn: "Öğrenin",
      blog: "Blog",
      stories: "Müşteri Hikayeleri",
      storiesSoon: "Yakında",
      news: "Aura Haberleri",
      academy: "Akademi",
      support: "Destek Merkezi",
      tutorials: "Eğitimler",
      careers: "Kariyer",
      contactSales: "Satışla Görüş",
      tryNow: "Şimdi Dene",
      dashboard: "Panel"
    },
    hero: {
      eyebrow: "Claude Opus 4.7 — En Üst Seviye",
      title1: "Bırakın AI Yönetsin: ",
      title2: "Portföyünüzü",
      subtitle: "Aura AI piyasaları sürekli analiz eder, riskleri yönetir ve işlemleri gerçekleştirir — siz dinlenirken bile portföyünüz çalışmaya devam eder.",
      ctaDashboard: "Paneli Aç",
      ctaStart: "Ücretsiz Başla",
      ctaTalk: "Görüşelim"
    },
    prompt: {
      assetsManaged: "Yönetilen Varlık",
      uptime: "Çalışma Süresi",
      avgResponse: "Ort. Yanıt",
      ticker: "Aura AI canlı stratejileri yürütüyor"
    },
    marquee: {
      title: "Kurumsal Ortaklar ve Kripto Uygulamaları Tarafından Güvenilen"
    },
    pricing: {
      title: "Fiyatlandırma",
      free: {
        name: "Ücretsiz",
        price: "$0",
        description: "Yeni kullanıcılar için sınırlı fakat güçlü bir otomatik portföy deneyimi.",
        features: [
          "Opus 4.6 AI Modeli",
          "Günde 5 otonom işlem",
          "1 yönetilen portföy",
          "Temel haftalık performans raporları",
          "Temel al/sat önerileri",
          "Genel stratejilerle otomatik akış",
          "3 günde 1 çekim hakkı",
          "Ve dahası"
        ],
        cta: "Ücretsiz Başla"
      },
      pro: {
        name: "Pro",
        price: "$15 / 3 ay",
        description: "Tam otonom mod: AI işlemleri 7/24 yönetir. 3 ayda bir faturalandırılır.",
        features: [
          "Opus 4.7 Max AI Modeli",
          "Sermaye Koruması: %15 Kayıp Telafisi",
          "Sınırsız otonom işlem",
          "Sınırsız portföy yönetimi",
          "Anında para çekme",
          "Günlük ve haftalık performans raporları",
          "Otomatik alım / otomatik satım",
          "7/24 otonom işlem yürütme ve yönetimi",
          "Tamamen otonom portföy operasyonları",
          "Ve dahası"
        ],
        cta: "Pro'ya Yükselt"
      },
      enterprise: {
        name: "Kurumsal",
        price: "Özel",
        description: "Şirket yatırım operasyonları için korumalı sermaye çerçeveleriyle özel olarak tasarlandı.",
        features: [
          "Şirkete özel yatırım modeli",
          "Güvence teminatı / garanti kolateral kurulumu",
          "Şirkete iade edilen kısmi kayıp telafisi",
          "Özel sermaye koruma şartları",
          "Kurumsal düzeyde risk izleme",
          "Özel yatırım desteği"
        ],
        cta: "Satışla Görüş"
      }
    },
    features: {
      prediction: {
        title: "Kullanımı Kolay",
        description: "Ticaret, kripto para veya borsa hakkında hiçbir bilginiz olmasa bile, Aura Opus 4.7 modeli tüm işlemlerinizi tamamen otonom olarak yönetir!",
        button: "İşlemlere Başla",
        status: "Sistem Durumu",
        trading: "Otonom İşlemler",
        active: "Model: Aktif",
        standby: "Model: Beklemede",
        profit: "Toplam Kâr",
        live: "Küresel Canlı"
      },
      ai: {
        title: "AI ile İşlem Yapın",
        description: "Model destekli portföy fikirlerini kullanın ve bunları tek bir istemle anında uygulanabilir işlem mantığına dönüştürün.",
        button: "Strateji Üret",
        strategy: "Büyüme Stratejisi"
      },
      sleep: {
        title: "Siz Uyurken Çalışsın",
        description: "Siz uyurken Aura, yapılandırdığınız stratejiye göre işlemleri otonom olarak gerçekleştirir ve gerçek zamanlı bildirimler sunar.",
        button: "Şimdi Otomatikleştir",
        success: "Başarılı Yürütme",
        mode: "Aura Otonom Modu",
        profit: "Gerçekleşen Kâr"
      },
      risk: {
        title: "Düşük Risk Yüksek Getiri",
        description: "Aura piyasa riskini izler ve sermayenizi korumak ile getiriyi en üst düzeye çıkarmak için işlemleri otomatik olarak ayarlar veya duraklatır.",
        button: "Performansı İncele",
        guard: "Risk Koruması Aktif",
        stability: "Sistem Kararlılığı"
      }
    },
    results: {
      title: "Gerçek Sonuçlar",
      disclaimer: "*Tarihsel strateji kriterlerine dayalı açıklayıcı 30 günlük tahmin. (Opus 4.7 modeli)",
      invest: "1 ayda yatırdığınız tutar",
      auraEarn: "Aura AI Cüzdanı ile kazancınız*",
      manualEarn: "Manuel işlemlerle kazancınız",
      monthlyInvested: "Aylık yatırılan",
      profitDifference: "Kâr farkı",
      monthlyProfitUsd: "Aylık kâr (USD)",
      manualLabel: "Manuel",
      auraLabel: "Aura AI"
    },
    benchmark: {
      title: "AI Kıyaslaması",
      topModel: "En İyi Model",
      scoreLead: "Skor Liderliği",
      compositeDesc: "*10.000'den fazla canlı kripto senaryosunun birleşik skoru. BTC, ETH, SOL çiftleri. Mayıs 2026.",
      compositeIndex: "Birleşik Endeks",
      accuracy: "Tahmin doğruluğu",
      liveMarkets: "Canlı kripto piyasaları",
      latency: "Yürütme gecikmesi",
      edgeRuntime: "Edge Çalışma Zamanı",
      sharpe: "Sharpe oranı",
      riskReturns: "Risk ayarlı getiriler",
      financialScore: "Finansal Zeka Skoru"
    },
    caseStudies: {
      eyebrow: "Kanıtlanmış Sonuçlar",
      title: "Vaka Çalışmaları",
      subtitle: "Üretimde otonom ticaret operasyonlarını optimize etmek için Aura'yı kullanan gerçek portföy ekipleri.",
      readFull: "Vaka çalışmasının tamamını oku",
      tags: {
        growth: "Büyüme",
        risk: "Risk",
        efficiency: "Verimlilik"
      },
      roles: {
        grayscale: "Yatırım Müdürü",
        solidchain: "CEO",
        customer: "Öğretmen"
      },
      resultLabels: {
        grayscale: "Çeyreklik kâr büyümesi",
        solidchain: "Düşük maksimum düşüş",
        customer: "Daha hızlı yeniden dengeleme döngüsü"
      },
      quotes: {
        grayscale: "Manuel spot kararlardan tamamen otomatik strateji çalışmalarına geçtik. Aura, 6 kişilik ticaret masamızın yaptığı işi tek başına hallediyor.",
        solidchain: "Aura'nın fon koruma özelliği bugüne kadar gördüğümüz en iyi sistemlerden biri; bir kripto yatırımcısı olarak, yatırdığım fonlardan %30 kâr elde ettim.",
        customer: "Kayıp yaşamaktan korktuğum için kriptoya yatırım yapmaktan hep çekiniyordum, ancak AuraAI bana başlama güvenini verdi."
      }
    },
    faq: {
      title: "Sorularınız mı Var?",
      subtitle: "Başlamadan önce bilmeniz gereken her şey.",
      items: [
        {
          question: "Aura AI tam olarak nedir?",
          answer: "Aura, yapay zekaya dayalı otonom bir ticaret ve portföy yönetimi platformudur. Gelişmiş dil modellerini ve gerçek zamanlı piyasa verilerini kullanarak karmaşık yatırım stratejilerini yürütür, riskleri yönetir ve manuel müdahale gerektirmeden kripto varlıklarınızı optimize eder."
        },
        {
          question: "Yapay zeka işlem kararlarını nasıl alıyor?",
          answer: "Aura AI, yatırım ve kripto para birimleri alanlarında özel olarak eğitilmiş gelişmiş yapay zeka Claude Opus 4.7 modelini kullanır. Sistem; gerçek zamanlı haberleri, sosyal medya eğilimlerini, zincir üstü verileri ve canlı piyasa akışlarını sürekli olarak analiz eder. Bu sinyallerden çıkardığı değerlendirmelere göre, risk profilinize uygun performansı optimize etmek amacıyla otonom olarak işlemler gerçekleştirir."
        },
        {
          question: "Sermayem Aura ile güvende mi?",
          answer: "Güvenlik en büyük önceliğimizdir. Aura, tüm veriler og API bağlantıları için kurumsal düzeyde şifreleme kullanır. Bağlı borsalardan fonlarınızı çekmek için hiçbir zaman doğrudan erişimimiz yoktur; sistem yalnızca 'İşlem Yapma' ve 'Görüntüleme' yetkilerine sahiptir. Ayrıca Aura ekosisteminde tutulan tüm varlıklar için çoklu imzalı (multi-sig) soğuk cüzdanlar kullanıyoruz."
        },
        {
          question: "Hangi varlıklar ve borsalar destekleniyor?",
          answer: "Aura şu anda BTC, ETH, SOL ve USDT dahil tüm büyük kripto para birimlerini desteklemektedir. Binance, Coinbase ve Kraken gibi birinci sınıf borsalarla sorunsuz entegrasyonun yanı sıra merkeziyetsiz protokoller için doğrudan zincir üstü yürütme sağlıyoruz."
        },
        {
          question: "Pro planın Ücretsiz plandan farkı nedir?",
          answer: "Ücretsiz plan temel portföy takibini ve manuel yapay zeka önerilerini keşfetmenize olanak tanırken, Pro plan (aylık $15) 7/24 tam otonom işlemlerin, anında para çekmenin, gelişmiş risk korumalarının ve tüm stratejilerde öncelikli yürütmenin kapılarını açar."
        },
        {
          question: "Aura aşırı piyasa oynaklığını nasıl yönetiyor?",
          answer: "Aura, piyasa stresini 7/24 izleyen 'Nöral Risk Korumalarına' sahiptir. Ani bir düşüş veya aşırı oynaklık durumunda yapay zeka, sermayenizi büyük düşüşlerden korumak için varlıkları otomatik olarak stabil coinlere taşıyabilir, zarar durdurma limitlerini daraltabilir veya açığa satış işlemlerle pozisyonları hedge edebilir."
        },
        {
          question: "İşlem başına herhangi bir gizli ücret var mı?",
          answer: "Hayır. Aura, işlemlerinizden yüzdeye dayalı herhangi bir komisyon veya gizli spread almaz. Yalnızca aylık abonelik ücretinizi (Pro plandaysanız) ve ilgili borsaların veya blokzincir ağlarının uyguladığı standart işlem ücretlerini ödersiniz."
        },
        {
          question: "Aboneliğimi istediğim zaman iptal edebilir miyim?",
          answer: "Evet. İstediğiniz zaman tek bir tıklamayla Pro aboneliğinizi düşürebilir veya iptal edebilirsiniz. Uzun vadeli sözleşmeler veya iptal ücretleri yoktur."
        },
        {
          question: "Neden aylık abonelik ücreti var?",
          answer: "7/24 otonom çalışan bir yapay zekayı işletmek ciddi hesaplama kaynakları gerektirir. Aboneliğiniz; Aura'nın veri analiz ederken harcadığı Claude Opus 4.7 tokenlarının maliyetini, yüksek frekanslı piyasa verisi akışlarını ve küresel piyasalarda milisaniye düzeyinde gecikmeyle işlemler yürütebilmesi için gereken güvenli bulut altyapısını doğrudan karşılar."
        },
        {
          question: "Yatırma veya çekme işlemleri için manuel onay gerekiyor mu?",
          answer: "Kesinlikle hayır. Hesap oluşturduğunuzda kripto cüzdanlarınız otomatik olarak oluşturulur. Yatırma ve çekme işlemleri, sistem ve blokzincir tarafından yalnızca bu özel cüzdanlar üzerinden otomatik olarak gerçekleştirilir; böylece kesintisiz ve tamamen otonom bir deneyim sunulur."
        }
      ]
    },
    footer: {
      product: "Ürün",
      company: "Şirket",
      legal: "Yasal",
      about: "Hakkımızda",
      contact: "İletişim",
      privacy: "Gizlilik",
      terms: "Koşullar",
      status: "Sistem Durumu",
      rights: "Aura. Tüm hakları saklıdır.",
      desc: "Sürekli çalışan yürütme gücü ve net performans analizleriyle otonom portföy zekası.",
      binance: "Binance altyapısı",
      swissEng: "İsviçre'de Geliştirilmiştir",
      swissQuality: "İsviçre Kalitesi ve Hassasiyeti",
      euCompliant: "AB Standartlarına Uygundur",
      euPlatform: "AB Uyumlu Platform"
    },
    auth: {
      login: {
        title1: "Hızlı yatırım yapın, ",
        title2: "daha hızlı büyüyün.",
        subtitle: "Sohbette analiz edin, Aura ile yatırım yapın. Modern portföyler için yapay zeka zekası.",
        google: "Google ile Devam Et",
        or: "VEYA",
        emailPlaceholder: "E-postanızı girin",
        passwordPlaceholder: "Şifrenizi girin",
        submit: "E-posta ile devam et",
        submitting: "Giriş yapılıyor...",
        policy: "Devam ederek Aura'nın ",
        policyLink: "Gizlilik Politikası'nı",
        policyEnd: " kabul etmiş olursunuz.",
        noAccount: "Hesabınız yok mu? ",
        createOne: "Yeni bir tane oluşturun",
        downloadApp: "Masaüstü uygulamasını indir",
        twoFactor: {
          title: "İki Adımlı Doğrulama",
          subtitle: "Devam etmek için kimlik doğrulama uygulamanızdaki 6 haneli kodu girin.",
          refresh: "Kod her 30 saniyede bir yenilenir",
          submit: "Doğrula ve Devam Et",
          submitting: "Doğrulanıyor...",
          cancel: "Girişi İptal Et",
          invalidCode: "Geçersiz kod. Lütfen tekrar deneyin."
        }
      },
      register: {
        title1: "Geleceğe katılın, ",
        title2: "bugün başlayın.",
        subtitle: "Hesabınızı oluşturun ve bırakın kurumsal düzeydeki portföyünüzü Aura yönetsin.",
        google: "Google ile Katıl",
        or: "VEYA",
        fullName: "Adınız Soyadınız",
        username: "Kullanıcı Adı",
        anonymous: "Anonim bir yatırımcı olmak istiyorum",
        emailAddress: "E-posta adresi",
        createPassword: "Şifre oluşturun",
        strength: {
          weak: "Zayıf Şifre",
          fair: "Orta Düzey Güvenlik",
          good: "İyi Şifre",
          strong: "Güçlü / Güvenli"
        },
        submit: "Hesap Oluştur",
        submitting: "Hesap oluşturuluyor...",
        policy: "Kaydolarak Aura'nın ",
        policyLink1: "Gizlilik Politikası'nı",
        policyAnd: " ve ",
        policyLink2: "Kullanım Koşulları'nı",
        policyEnd: " kabul etmiş olursunuz.",
        alreadyAccount: "Zaten bir hesabınız var mı? ",
        signIn: "Giriş yapın",
        downloadApp: "Masaüstü uygulamasını indir"
      }
    }
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  // Load language preference from local storage or browser language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("aura_language") as Language;
    if (savedLang === "en" || savedLang === "tr") {
      setLanguageState(savedLang);
      document.documentElement.setAttribute("lang", savedLang);
    } else {
      const browserLang = navigator.language.split("-")[0];
      const defaultLang: Language = browserLang === "tr" ? "tr" : "en";
      setLanguageState(defaultLang);
      document.documentElement.setAttribute("lang", defaultLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("aura_language", lang);
    document.documentElement.setAttribute("lang", lang);
  };

  const t = (key: string): any => {
    const parts = key.split(".");
    let current: any = translations[language];

    for (const part of parts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        // Fallback to English if translation key is missing in Turkish
        let englishFallback: any = translations["en"];
        for (const fallbackPart of parts) {
          if (englishFallback && englishFallback[fallbackPart] !== undefined) {
            englishFallback = englishFallback[fallbackPart];
          } else {
            return key; // return the key itself if all fails
          }
        }
        return englishFallback;
      }
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
