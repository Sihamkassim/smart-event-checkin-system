import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  static async sendActivationEmail(to: string, name: string, activationToken: string) {
    const activationLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/setup-password?token=${activationToken}`;
    
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Smart Event System'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@smartevent.com'}>`,
      to,
      subject: 'Welcome! Activate your Staff Account',
      html: `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Smart Event System</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Staff Account Activation</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 40px 30px; color: #334155; line-height: 1.6;">
            <p style="font-size: 18px; margin-top: 0;">Hi <strong style="color: #0f172a;">${name}</strong>,</p>
            <p style="font-size: 16px;">Welcome aboard! An admin has created a staff account for you. To get started and access your dashboard, you need to set up your password.</p>
            
            <div style="text-align: center; margin: 45px 0;">
              <a href="${activationLink}" style="background: linear-gradient(to right, #3b82f6, #2563eb); color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);">Set My Password</a>
            </div>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 600; margin-bottom: 8px;">Or copy and paste this link into your browser:</p>
              <p style="margin: 0; word-break: break-all; color: #3b82f6; font-size: 14px; line-height: 1.5;">${activationLink}</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 13px; color: #94a3b8;">This is an automated message. If you did not request this, please safely ignore this email.</p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #cbd5e1;">&copy; ${new Date().getFullYear()} Smart Event System</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      // For ethereal testing
      if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }
  }
}
