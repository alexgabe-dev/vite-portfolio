import sgMail from '@sendgrid/mail';

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
  // Csak POST kérések engedélyezése
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting ellenőrzés
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (isRateLimited(clientIp)) {
      return res.status(429).json({ error: 'Túl sok kérés. Kérjük próbálja újra később.' });
    }

    // Input validáció
    const { name, email, phone, subject, message } = req.body;
    validateInput({ name, email, subject, message });

    // HTML email sablon
    const htmlContent = `
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
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Ez egy automatikusan generált üzenet a weboldalról.
        </p>
      </div>
    `;

    // SendGrid konfiguráció és email küldés
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API kulcs nincs beállítva');
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    await sgMail.send({
      to: 'info@vizitor.hu',
      from: process.env.VERIFIED_SENDER || 'info@vizitor.hu',
      subject: `Új kapcsolatfelvétel: ${subject}`,
      html: htmlContent,
      replyTo: email, // A válasz email a feladónak megy
    });

    res.status(200).json({ 
      success: true,
      message: 'Email sikeresen elküldve!'
    });
  } catch (error: any) {
    console.error('Email sending error:', error);
    
    // Felhasználóbarát hibaüzenet
    let errorMessage = 'Hiba történt az email küldése közben.';
    
    if (error.response) {
      console.error(error.response.body);
      // SendGrid specifikus hibák kezelése
      switch (error.code) {
        case 401:
          errorMessage = 'Hitelesítési hiba történt.';
          break;
        case 429:
          errorMessage = 'Túl sok kérés. Kérjük próbálja újra később.';
          break;
        default:
          errorMessage = 'Hiba történt az email küldése közben. Kérjük próbálja újra később.';
      }
    }

    res.status(500).json({ 
      error: 'Failed to send email',
      message: errorMessage
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