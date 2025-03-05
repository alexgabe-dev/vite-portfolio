import nodemailer from 'nodemailer';

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

// Rate limiting - egyszerű memória alapú megoldás
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 perc
  max: 5, // maximum 5 kérés / IP
  store: new Map(),
};

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const windowStart = now - rateLimit.windowMs;
  
  // Régi rekordok törlése
  for (const [key, timestamp] of rateLimit.store.entries()) {
    if (timestamp < windowStart) {
      rateLimit.store.delete(key);
    }
  }
  
  // IP kéréseinek számolása
  const requests = Array.from(rateLimit.store.entries())
    .filter(([key, _]) => key.startsWith(ip))
    .length;
    
  if (requests >= rateLimit.max) {
    return true;
  }
  
  // Új kérés rögzítése
  rateLimit.store.set(`${ip}_${now}`, now);
  return false;
};

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
      secure: false, // TLS
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

    console.log('Email sikeresen elküldve');
    return res.status(200).json({ 
      success: true,
      message: 'Email sikeresen elküldve'
    });
  } catch (error: any) {
    console.error('Email küldési hiba:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Hiba történt az üzenet küldése közben. Kérjük próbálja újra később.'
    });
  }
}

// CORS beállítások
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
}; 