import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request: Request) {
  const formData = await request.formData();
  
  // Set SendGrid API Key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

  // Setup email data
  const msg = {
    to: process.env.CONTACT_EMAIL || '',
    from: process.env.SENDGRID_VERIFIED_SENDER || '', // Must be verified in SendGrid
    subject: 'New Contact Form Submission',
    text: `Contact Type: ${formData.get('id_contact')}
Email: ${formData.get('email')}
Message: ${formData.get('message')}`,
    attachments: formData.get('attachment') ? [{
      filename: (formData.get('attachment') as File).name,
      content: Buffer.from(await (formData.get('attachment') as File).arrayBuffer()).toString('base64'),
      type: (formData.get('attachment') as File).type,
      disposition: 'attachment'
    }] : []
  };

  try {
    // Send mail using SendGrid
    await sgMail.send(msg);
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
