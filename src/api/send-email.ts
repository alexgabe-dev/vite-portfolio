import nodemailer from 'nodemailer';

// Email küldő konfiguráció
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vizitordesign@gmail.com',
    pass: 'ldhi kkoi mkib tbem'
  }
});

export default async function handler(req: any, res: any) {
  // Csak POST kéréseket fogadunk
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // Input validáció
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Minden kötelező mezőt ki kell tölteni' });
    }

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

    // Email küldése
    await transporter.sendMail({
      from: 'vizitordesign@gmail.com',
      to: 'info@vizitor.hu',
      subject: `Új kapcsolatfelvétel: ${subject}`,
      html: emailContent,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: 'Hiba történt az email küldése közben' });
  }
} 