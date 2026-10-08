import { NextResponse } from 'next/server';
import { INITIAL_SAFE_PLACES, NATIONAL_HELPLINES } from '@/lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  let filtered = INITIAL_SAFE_PLACES;
  if (type && type !== 'all') {
    filtered = filtered.filter((p) => p.type === type);
  }

  return NextResponse.json({
    success: true,
    safePlaces: filtered,
    helplines: NATIONAL_HELPLINES,
  });
}
