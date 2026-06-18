import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const cronHeader = req.headers.get("x-vercel-cron");
    const isDev = process.env.NODE_ENV === "development";
    
    if (cronHeader !== "1" && !isDev) {
      return new Response("Unauthorized", { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Fetch existing Market news to avoid duplicates
    const { data: existingNews, error: selectError } = await supabaseAdmin
      .from("news")
      .select("title, external_url")
      .eq("category", "Market");

    if (selectError) throw selectError;

    const existingTitles = new Set(existingNews?.map(n => n.title.toLowerCase()) || []);
    const existingUrls = new Set(existingNews?.map(n => n.external_url?.toLowerCase()).filter(Boolean) || []);

    // 2. Fetch fresh news from Google News RSS feed
    const query = encodeURIComponent("finance economy crypto");
    const rssRes = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3D${query}%26hl%3Den-US%26gl%3DUS%26ceid%3DUS%3Aen`,
      { cache: "no-store" }
    );
    
    if (!rssRes.ok) {
      throw new Error(`Failed to fetch RSS feed: ${rssRes.statusText}`);
    }

    const rssData = await rssRes.json();
    const newArticles: any[] = [];

    if (rssData.items && Array.isArray(rssData.items)) {
      for (const item of rssData.items) {
        const title = item.title;
        const url = item.link;
        
        // Skip if title or url already exists in DB
        if (existingTitles.has(title.toLowerCase()) || (url && existingUrls.has(url.toLowerCase()))) {
          continue;
        }

        // Clean HTML tags from description and slice
        const cleanBody = item.description
          ? item.description.replace(/<[^>]*>?/gm, "").slice(0, 300) + "..."
          : "Read the full story on the publisher's website.";

        newArticles.push({
          title: title,
          body: cleanBody,
          source: item.author || "Global News",
          external_url: url || null,
          image_url: item.enclosure?.link || `https://images.unsplash.com/photo-1611974714658-dd472454b6c8?auto=format&fit=crop&q=80&w=800`,
          category: "Market",
          published_at: new Date(item.pubDate).toISOString()
        });
      }
    }

    // 3. Insert new articles
    if (newArticles.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from("news")
        .insert(newArticles);
      
      if (insertError) throw insertError;
    }

    // 4. Prune old news articles (Keep latest 30 Market news)
    const { data: allMarketNews, error: listError } = await supabaseAdmin
      .from("news")
      .select("id")
      .eq("category", "Market")
      .order("published_at", { ascending: false });

    if (!listError && allMarketNews && allMarketNews.length > 30) {
      const idsToDelete = allMarketNews.slice(30).map(n => n.id);
      await supabaseAdmin
        .from("news")
        .delete()
        .in("id", idsToDelete);
    }

    return NextResponse.json({
      status: "success",
      syncedCount: newArticles.length
    });

  } catch (error: any) {
    console.error("Cron sync-news error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
