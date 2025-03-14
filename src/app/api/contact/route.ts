import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Log environment variables (excluding API key for security)
console.log('Environment check:', {
  hasApiKey: !!process.env.RESEND_API_KEY,
  fromEmail: process.env.RESEND_FROM_EMAIL,
  recipientEmail: process.env.CONTACT_FORM_RECIPIENT
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const formData = await request.formData();
  
  // Get form data
  const contactType = formData.get('id_contact');
  const senderEmail = formData.get('email');
  const message = formData.get('message');
  const attachment = formData.get('attachment') as File | null;

  const recipientEmail = process.env.CONTACT_FORM_RECIPIENT;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  
  if (!recipientEmail) {
    console.error('CONTACT_FORM_RECIPIENT not configured');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  // Prepare attachments if any
  const attachments = [];
  if (attachment) {
    const buffer = Buffer.from(await attachment.arrayBuffer());
    attachments.push({
      filename: attachment.name,
      content: buffer
    });
  }

  try {
    console.log('Preparing to send email with Resend...');
    console.log('Configuration:', {
      to: recipientEmail,
      from: fromEmail,
      replyTo: senderEmail,
      hasAttachment: !!attachment
    });
    
    const contactTypeText = contactType === '3' ? 'Corporate gifts & B2B' : 'Customer service';
    
    // Create HTML content
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Contact Type:</strong> ${contactTypeText}</p>
      <p><strong>From Email:</strong> ${senderEmail}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space: pre-wrap;">${message}</pre>
      <hr>
      <p style="color: #666; font-size: 12px;">This email was sent from the Inoxcrom contact form.</p>
    `;

    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: senderEmail as string,
      subject: `New Contact Form Submission - ${contactTypeText}`,
      html: htmlContent,
      text: `New contact form submission:

Contact Type: ${contactTypeText}
From Email: ${senderEmail}
Message:
${message}

---
This email was sent from the Inoxcrom contact form.`,
      attachments: attachments
    });

    console.log('Resend response:', emailResponse);
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Detailed error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: errorMessage },
      { status: 500 }
    );
  }
}
