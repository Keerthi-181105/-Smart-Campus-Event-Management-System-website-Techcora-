import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

function loadEnvFromDotenv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^"|"$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFromDotenv();

const prisma = new PrismaClient();

async function main() {
  // Hash passwords for sample users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const organizerPassword = await bcrypt.hash('organizer123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@srmist.edu.in' },
    update: {},
    create: {
      name: 'SRM Admin',
      email: 'admin@srmist.edu.in',
      password: adminPassword,
      role: 'ADMIN' as any,
    }
  });

  const organizerA = await prisma.user.upsert({
    where: { email: 'organizer1@srmist.edu.in' },
    update: {},
    create: {
      name: 'Organizer One',
      email: 'organizer1@srmist.edu.in',
      password: organizerPassword,
      role: 'ORGANIZER' as any,
    }
  });

  const organizerB = await prisma.user.upsert({
    where: { email: 'organizer2@srmist.edu.in' },
    update: {},
    create: {
      name: 'Organizer Two',
      email: 'organizer2@srmist.edu.in',
      password: organizerPassword,
      role: 'ORGANIZER' as any,
    }
  });

  const studentEmails = ['student1@srmist.edu.in','student2@srmist.edu.in','student3@srmist.edu.in','student4@srmist.edu.in','student5@srmist.edu.in']
  for (const email of studentEmails) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name: email.split('@')[0], email, password: studentPassword, role: 'STUDENT' as any }
    })
  }

  const now = new Date();
  const morning = (d: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, 9, 0, 0)
  const afternoon = (d: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, 14, 0, 0)
  const evening = (d: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, 18, 0, 0)

  const events = [
    { title: 'AI/ML Bootcamp', category: 'Tech', venue: 'Tech Park', start: morning(1), end: afternoon(1), price: 0, priceType: 'free', capacity: 150, imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71' },
    { title: 'Cybersecurity 101', category: 'Tech', venue: 'Library Hall', start: afternoon(2), end: evening(2), price: 199, priceType: 'paid', capacity: 120, imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296' },
    { title: 'Music Night', category: 'Cultural', venue: 'Main Auditorium', start: evening(3), end: evening(3), price: 0, priceType: 'free', capacity: 500, imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d' },
    { title: 'Dance Workshop', category: 'Cultural', venue: 'Seminar Hall', start: afternoon(4), end: evening(4), price: 99, priceType: 'paid', capacity: 200, imageUrl: 'https://images.unsplash.com/photo-1514511542633-38f42f0aa6c3' },
    { title: 'Cricket Tournament', category: 'Sports', venue: 'Sports Complex', start: morning(5), end: afternoon(5), price: 0, priceType: 'free', capacity: 300, imageUrl: 'https://images.unsplash.com/photo-1553969738-b4fdc6c87ca6' },
    { title: 'Basketball League', category: 'Sports', venue: 'Sports Complex', start: afternoon(6), end: evening(6), price: 0, priceType: 'free', capacity: 250, imageUrl: 'https://images.unsplash.com/photo-1519455953755-af066f52f1ea' },
    { title: 'Guest Lecture: AI Ethics', category: 'Academic', venue: 'Seminar Hall', start: morning(7), end: afternoon(7), price: 0, priceType: 'donation', capacity: 200, imageUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0' },
    { title: 'Research Presentations', category: 'Academic', venue: 'Library Hall', start: afternoon(8), end: evening(8), price: 0, priceType: 'free', capacity: 100, imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da' },
    { title: "Fresher's Party", category: 'Social', venue: 'Main Auditorium', start: evening(9), end: evening(9), price: 299, priceType: 'paid', capacity: 400, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819' },
    { title: 'Alumni Meet', category: 'Social', venue: 'Tech Park', start: afternoon(10), end: evening(10), price: 0, priceType: 'donation', capacity: 350, imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac' },
  ]

  for (const [i, ev] of events.entries()) {
    const data: any = {
      title: ev.title,
      description: `${ev.title} at ${ev.venue}`,
      venue: ev.venue,
      category: ev.category,
      startTime: ev.start,
      endTime: ev.end,
      capacity: ev.capacity,
      price: ev.price,
      imageUrl: ev.imageUrl,
      organizerId: i % 2 === 0 ? organizerA.id : organizerB.id,
      analytics: { create: {} }
    };
    if (ev.priceType) data.priceType = ev.priceType;
    await prisma.event.create({ data })
  }

  console.log('Seed completed');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
