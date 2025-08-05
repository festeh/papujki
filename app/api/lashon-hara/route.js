import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'lashon-hara.json');

function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readCounter() {
  ensureDataDir();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading counter:', error);
  }
  return { days: 0, maxStreak: 0 };
}

function writeCounter(data) {
  ensureDataDir();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing counter:', error);
    return false;
  }
}

export async function GET() {
  const data = readCounter();
  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    const { days } = await request.json();
    
    if (typeof days !== 'number' || days < 0) {
      return NextResponse.json(
        { error: 'Invalid days value' },
        { status: 400 }
      );
    }

    const currentData = readCounter();
    const maxStreak = Math.max(days, currentData.maxStreak || 0);
    const newData = { days, maxStreak };

    const success = writeCounter(newData);
    
    if (success) {
      return NextResponse.json(newData);
    } else {
      return NextResponse.json(
        { error: 'Failed to save counter' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}