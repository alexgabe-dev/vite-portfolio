import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Környezeti változók betöltése
dotenv.config();

// Email küldő konfiguráció
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vizitordesign@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // Input validáció
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Minden kötelező mezőt ki kell tölteni' });
    }

    // Ellenőrizzük, hogy van-e beállítva a jelszó
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail app password is not set in environment variables');
      return res.status(500).json({ error: 'Email konfiguráció hiba' });
    }

    // Email tartalom összeállítása
    const mailOptions = {
      from: 'vizitordesign@gmail.com',
      to: 'info@vizitor.hu',
      subject: `Új kapcsolatfelvétel: ${subject}`,
      html: `
        <h2>Új üzenet érkezett a weboldalról</h2>
        <p><strong>Név:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'Nem megadott'}</p>
        <p><strong>Tárgy:</strong> ${subject}</p>
        <p><strong>Üzenet:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Email küldése
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: 'Hiba történt az email küldése közben' });
  }
} 