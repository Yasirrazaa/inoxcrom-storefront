import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const formData = await request.formData();
  
  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Setup email data
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.CONTACT_EMAIL,
    subject: 'New Contact Form Submission',
    text: `Contact Type: ${formData.get('id_contact')}
Email: ${formData.get('email')}
Message: ${formData.get('message')}`,
    attachments: formData.get('attachment') ? [{
      filename: (formData.get('attachment') as File).name,
      content: Buffer.from(await (formData.get('attachment') as File).arrayBuffer())
    }] : []
  };

  try {
    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
