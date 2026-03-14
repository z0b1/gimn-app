"use server";

import nodemailer from "nodemailer";

interface ErrorReportingData {
  message: string;
  digest?: string;
  url?: string;
  timestamp: string;
}

export async function reportError(data: ErrorReportingData) {
  // Check for required Gmail credentials per user request
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.warn("Gmail credentials missing. Error reporting via email is disabled.");
    return { success: false, error: "Gmail credentials missing" };
  }

  try {
    // Configure transporter for Gmail service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    const { message, digest, url, timestamp } = data;
    
    // Recipients as specified by user
    const recipients = ["yu4tmb@gmail.com", "parlamentucenickiparlament@gmail.com"];

    await transporter.sendMail({
      from: `"GimnApp Support" <${GMAIL_USER}>`,
      to: recipients.join(", "),
      subject: `🚨 Greška u aplikaciji: ${digest || "Nepoznato"}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px; text-align: center;">
                <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 12px; border-radius: 16px; margin-bottom: 16px;">
                  <span style="font-size: 32px;">🚨</span>
                </div>
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Sistemski Izveštaj</h1>
                <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500;">Otkrivena je nova greška u GimnApp-u</p>
              </div>

              <!-- Content -->
              <div style="padding: 32px;">
                <div style="margin-bottom: 32px;">
                  <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 18px; font-weight: 700;">Detalji incidenta</h2>
                  <div style="display: grid; gap: 12px;">
                    <div style="background: #f1f5f9; padding: 16px; border-radius: 12px;">
                      <span style="display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Error Digest ID</span>
                      <code style="font-family: 'SF Mono', SFMono-Regular, ui-monospace, 'DejaVu Sans Mono', Menlo, Consolas, monospace; color: #4f46e5; font-size: 14px; font-weight: 600;">${digest || "N/A"}</code>
                    </div>
                  </div>
                </div>

                <!-- Error Message -->
                <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 16px; padding: 20px; margin-bottom: 32px;">
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="width: 8px; height: 8px; background: #e11d48; border-radius: 50%; margin-right: 8px;"></div>
                    <span style="font-size: 12px; font-weight: 700; color: #9f1239; text-transform: uppercase;">Poruka o grešci</span>
                  </div>
                  <p style="margin: 0; color: #be123c; font-size: 15px; font-weight: 500; line-height: 1.6;">${message}</p>
                </div>

                <!-- Context -->
                <div style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
                  <div style="display: flex; flex-wrap: wrap; gap: 24px;">
                    <div style="flex: 1; min-width: 200px;">
                      <span style="display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Vreme incidenta</span>
                      <span style="font-size: 14px; color: #334155; font-weight: 500;">${timestamp}</span>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                      <span style="display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Lokacija (URL)</span>
                      <span style="font-size: 14px; color: #334155; font-weight: 500; word-break: break-all;">${url || "Nepoznato"}</span>
                    </div>
                  </div>
                </div>

                <div style="margin-top: 40px; text-align: center;">
                  <a href="${url || '#'}" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; text-decoration: none; transition: background 0.2s;">Pregledaj stranicu</a>
                </div>
              </div>

              <!-- Footer -->
              <div style="background: #f8fafc; padding: 24px; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: 500;">
                  Ovo je automatski generisan izveštaj poslat sa <strong>GimnApp</strong> produkcionog servera.
                </p>
                <div style="margin-top: 8px; font-size: 12px; color: #cbd5e1;">© ${new Date().getFullYear()} Šabačka gimnazija</div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send error report email via Gmail:", error);
    return { success: false, error: "Failed to send email" };
  }
}
