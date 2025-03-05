import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type Data = {
  success: boolean;
  message?: string;
  error?: string;
}

// Input validáció
const validateInput = (data: any) => {
  if (!data.email || !data.name || !data.subject || !data.message) {
    throw new Error('Minden kötelező mezőt ki kell tölteni');
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Érvénytelen email cím');
  }
  
  return true;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Input validáció
    const { name, email, phone, subject, message } = req.body;
    validateInput({ name, email, subject, message });

    // Email tartalom összeállítása
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff5c35;">Új üzenet érkezett a weboldalról</h2>
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px;">
          <p><strong>Név:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone || 'Nem megadott'}</p>
          <p><strong>Tárgy:</strong> ${subject}</p>
          <hr style="border: 1px solid #eee;">
          <p><strong>Üzenet:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `;

    // SMTP Transporter létrehozása
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailersend.net',
      port: 587,
      secure: false,
      auth: {
        user: 'MS_pmVEtl@vizitor.hu',
        pass: process.env.SMTP_PASSWORD
      }
    });

    // Email küldése
    await transporter.sendMail({
      from: 'info@vizitor.hu',
      to: 'info@vizitor.hu',
      subject: `Új kapcsolatfelvétel: ${subject}`,
      html: emailContent,
    });

    return res.status(200).json({ 
      success: true,
      message: 'Email sikeresen elküldve'
    });
  } catch (error: any) {
    console.error('Email küldési hiba:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Hiba történt az üzenet küldése közben. Kérjük próbálja újra később.'
    });
  }
} 