import { NextResponse } from 'next/server';
import { INITIAL_CONTACTS } from '@/lib/mockData';
import { EmergencyContact } from '@/lib/types';

let contactsCache: EmergencyContact[] = [...INITIAL_CONTACTS];

export async function GET() {
  return NextResponse.json({
    success: true,
    contacts: contactsCache,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newContact: EmergencyContact = {
      ...body,
      id: `contact-${Date.now()}`,
    };

    contactsCache = [...contactsCache, newContact];

    return NextResponse.json({
      success: true,
      contact: newContact,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create emergency contact' },
      { status: 500 }
    );
  }
}
