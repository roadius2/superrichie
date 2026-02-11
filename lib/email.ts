// Email utility for sending magic links
// In development, this will log to console
// In production, configure with a real email service like SendGrid, AWS SES, etc.

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // In development, just log the email
  if (process.env.NODE_ENV === "development") {
    console.log("📧 Email would be sent:");
    console.log("To:", options.to);
    console.log("Subject:", options.subject);
    console.log("HTML:", options.html);
    return;
  }

  // In production, implement actual email sending
  // Example with nodemailer:
  /*
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
  */
}

export function generateMagicLinkEmail(email: string, token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            background-color: #000000;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            padding: 40px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            border: 2px solid #00ff00;
            padding: 40px;
          }
          h1 {
            text-shadow: 0 0 10px #00ff00;
          }
          .button {
            display: inline-block;
            background-color: #00ff00;
            color: #000000;
            padding: 15px 30px;
            text-decoration: none;
            font-weight: bold;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #66ff66;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #00ff00;
            font-size: 12px;
            color: #00cc00;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>SuperRichie Magic Link</h1>
          <p>You're almost in! Click the button below to sign in to SuperRichie.</p>

          <a href="${magicLink}" class="button">
            SIGN IN TO SUPERRICHIE →
          </a>

          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #66ff66;">${magicLink}</p>

          <div class="footer">
            <p>This link will expire in 15 minutes.</p>
            <p>If you didn't request this email, you can safely ignore it.</p>
            <p>$ superrichie --secure --awesome</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
