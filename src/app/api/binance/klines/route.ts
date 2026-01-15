import { NextRequest, NextResponse } from "next/server";

const MEXC_KLINES_URL = "https://api.mexc.com/api/v3/klines";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const interval = searchParams.get("interval") ?? "1h";
  const limit = searchParams.get("limit") ?? "100";

  if (!symbol) {
    return NextResponse.json(
      { error: "Missing required 'symbol' query parameter" },
      { status: 400 },
    );
  }

  const url = `${MEXC_KLINES_URL}?symbol=${encodeURIComponent(
    symbol,
  )}&interval=${encodeURIComponent(interval)}&limit=${encodeURIComponent(limit)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        {
          error: "Failed to fetch klines from MEXC",
          status: res.status,
          body: text,
        },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error proxying MEXC klines:", err);
    return NextResponse.json(
      { error: "Error fetching klines from MEXC" },
      { status: 500 },
    );
  }
}
