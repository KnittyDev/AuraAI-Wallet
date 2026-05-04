import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether&vs_currencies=usd&include_24hr_change=true',
      {
        next: { revalidate: 60 } // Cache prices for 60 seconds
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch from CoinGecko');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Price fetch error:', error);
    return NextResponse.json(
      {
        bitcoin: { usd: 65000, usd_24h_change: 0 },
        ethereum: { usd: 3500, usd_24h_change: 0 },
        solana: { usd: 145, usd_24h_change: 0 },
        tether: { usd: 1, usd_24h_change: 0 }
      },
      { status: 200 } // Return fallback data instead of failing
    );
  }
}
