import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createEvent } from "ics";

interface SchedulePayload {
  name: string;
  email: string;
  company?: string;
  message?: string;
  meetingType: string;
  duration: string;
  date: string;    // e.g. "April 15, 2026"
  time: string;    // e.g. "10:00 AM"
}

function parseDateTime(dateStr: string, timeStr: string): Date {
  const date = new Date(`${dateStr} ${timeStr}`);
  return date;
}

function parseDurationMinutes(duration: string): number {
  const num = parseInt(duration.split(" ")[0], 10);
  return isNaN(num) ? 30 : num;
}

function dateToArray(d: Date): [number, number, number, number, number] {
  return [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()];
}

export async function POST(req: NextRequest) {
  let body: SchedulePayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, company, message, meetingType, duration, date, time } = body;
  if (!name || !email || !date || !time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const startDate = parseDateTime(date, time);
  const durationMinutes = parseDurationMinutes(duration);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  // Build ICS calendar invite
  const { error: icsError, value: icsValue } = createEvent({
    title: `${meetingType} with Vinoth S`,
    description: `Meeting with Vinoth S (Full Stack Developer)\n\nMeeting Type: ${meetingType} (${duration})\n${company ? `Company: ${company}\n` : ""}${message ? `\nNote from ${name}:\n${message}` : ""}`,
    organizer: { name: "Vinoth S", email: process.env.SMTP_USER || "vinothg0618@gmail.com" },
    attendees: [{ name, email }],
    start: dateToArray(startDate),
    end: dateToArray(endDate),
    url: "https://meet.google.com",
    location: "Google Meet (link in email)",
    status: "CONFIRMED",
    busyStatus: "BUSY",
  });

  if (icsError || !icsValue) {
    console.error("ICS creation error:", icsError);
    return NextResponse.json({ error: "Failed to create calendar event" }, { status: 500 });
  }

  // Configure Nodemailer transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Email to the USER who scheduled
  const clientMailHTML = `
    <div style="font-family:'Manrope',Arial,sans-serif;max-width:600px;margin:0 auto;background:#060e20;color:#dee5ff;padding:48px 40px;border-radius:16px;">
      <p style="font-family:'Space Grotesk',Arial,sans-serif;text-transform:uppercase;letter-spacing:0.3em;font-size:11px;color:#a3a6ff;font-weight:700;margin-bottom:32px;">Meeting Confirmed</p>
      <h1 style="font-family:'Space Grotesk',Arial,sans-serif;font-size:32px;font-weight:900;margin:0 0 16px;letter-spacing:-0.03em;">You're booked, ${name}!</h1>
      <p style="color:rgba(222,229,255,0.65);font-size:16px;line-height:1.7;margin-bottom:32px;">Your <strong style="color:#a3a6ff;">${meetingType}</strong> with Vinoth S is confirmed for:</p>
      <div style="background:#091328;border-radius:12px;padding:24px;margin-bottom:32px;border:1px solid rgba(64,72,93,0.3);">
        <p style="margin:0 0 8px;font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;font-size:22px;">${date}</p>
        <p style="margin:0;color:#53ddfc;font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;">${time} IST · ${duration}</p>
      </div>
      ${message ? `<p style="color:rgba(222,229,255,0.55);font-size:14px;background:#091328;padding:16px;border-radius:8px;border-left:3px solid #a3a6ff;"><em>"${message}"</em></p>` : ""}
      <p style="color:rgba(222,229,255,0.45);font-size:13px;margin-top:40px;">A calendar invite (.ics) is attached. Import it to add this meeting to your calendar. If you need to reschedule, reply to this email.</p>
      <hr style="border:none;border-top:1px solid rgba(64,72,93,0.3);margin:40px 0;" />
      <p style="color:rgba(222,229,255,0.3);font-size:12px;font-family:'Space Grotesk',Arial,sans-serif;text-transform:uppercase;letter-spacing:0.2em;">Vinoth S — Digital Architect</p>
    </div>
  `;

  // Notification email to the owner
  const ownerMailHTML = `
    <div style="font-family:'Manrope',Arial,sans-serif;max-width:600px;background:#0f1930;color:#dee5ff;padding:40px;border-radius:12px;">
      <h2 style="font-family:'Space Grotesk',Arial,sans-serif;font-size:22px;margin:0 0 24px;">New Meeting Scheduled</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:rgba(222,229,255,0.5);width:120px;">Name</td><td style="padding:8px 0;font-weight:700;">${name}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(222,229,255,0.5);">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#a3a6ff;">${email}</a></td></tr>
        ${company ? `<tr><td style="padding:8px 0;color:rgba(222,229,255,0.5);">Company</td><td style="padding:8px 0;">${company}</td></tr>` : ""}
        <tr><td style="padding:8px 0;color:rgba(222,229,255,0.5);">Type</td><td style="padding:8px 0;">${meetingType} (${duration})</td></tr>
        <tr><td style="padding:8px 0;color:rgba(222,229,255,0.5);">Date & Time</td><td style="padding:8px 0;color:#53ddfc;font-weight:700;">${date} · ${time} IST</td></tr>
      </table>
      ${message ? `<div style="margin-top:24px;padding:16px;background:#141f38;border-radius:8px;"><p style="margin:0;font-size:14px;color:rgba(222,229,255,0.7);">${message}</p></div>` : ""}
    </div>
  `;

  try {
    // Send to attendee
    await transporter.sendMail({
      from: `"Vinoth S — Digital Architect" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Meeting Confirmed: ${meetingType} on ${date} at ${time} IST`,
      html: clientMailHTML,
      attachments: [{ filename: "meeting-invite.ics", content: icsValue, contentType: "text/calendar" }],
    });

    // Notify owner
    await transporter.sendMail({
      from: `"Portfolio Bot" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `[New Booking] ${meetingType} from ${name} on ${date}`,
      html: ownerMailHTML,
      attachments: [{ filename: "meeting-invite.ics", content: icsValue, contentType: "text/calendar" }],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
