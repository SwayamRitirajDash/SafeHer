import { NextResponse } from 'next/server';
import { INITIAL_INCIDENTS } from '@/lib/mockData';
import { IncidentReport } from '@/lib/types';

let incidentsCache: IncidentReport[] = [...INITIAL_INCIDENTS];

export async function GET() {
  return NextResponse.json({
    success: true,
    incidents: incidentsCache,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, title, description, locationName, latitude, longitude, severity, isAnonymous, reporterName } = body;

    const newIncident: IncidentReport = {
      id: `inc-${Date.now()}`,
      category: category || 'other',
      title,
      description,
      locationName,
      latitude: latitude || 28.6139,
      longitude: longitude || 77.2090,
      severity: severity || 3,
      isAnonymous: Boolean(isAnonymous),
      reporterName: isAnonymous ? undefined : reporterName,
      timestamp: 'Just now',
      upvotes: 1,
      verified: false,
    };

    incidentsCache = [newIncident, ...incidentsCache];

    return NextResponse.json({
      success: true,
      incident: newIncident,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create incident report' },
      { status: 500 }
    );
  }
}
