import { NextResponse } from 'next/server';
import { SOSAlert } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { latitude, longitude, address, contacts } = body;

    const newAlert: SOSAlert = {
      id: `sos-${Date.now()}`,
      timestamp: new Date().toISOString(),
      latitude: latitude || 28.6139,
      longitude: longitude || 77.2090,
      address: address || 'Live Geolocation Pin',
      batteryLevel: 84,
      status: 'active',
      dispatchedTo: contacts || ['Unified Police (112)', 'Emergency Circle'],
    };

    // Simulated SMS / WhatsApp dispatcher payload
    const dispatchLog = {
      alertId: newAlert.id,
      recipients: newAlert.dispatchedTo,
      message: `🚨 SafeHer SOS: Distress alert triggered at https://maps.google.com/?q=${newAlert.latitude},${newAlert.longitude}`,
      timestamp: new Date().toISOString(),
      status: 'DISPATCHED_SUCCESSFULLY',
    };

    return NextResponse.json({
      success: true,
      alert: newAlert,
      dispatchLog,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to dispatch SOS alert' },
      { status: 500 }
    );
  }
}
