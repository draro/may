import { NextRequest, NextResponse } from 'next/server';
import { ContactModel } from '@/models/Contact';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, projectType, budget } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Save to database
    const contact = await ContactModel.create({
      name,
      email,
      subject,
      message,
      projectType: projectType || '',
      budget: budget || '',
      status: 'new',
    });

    // Send to n8n webhook if configured
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (n8nWebhookUrl) {
      try {
        const webhookResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
            projectType: projectType || 'Not specified',
            budget: budget || 'Not specified',
            submittedAt: new Date().toISOString(),
          }),
        });

        if (!webhookResponse.ok) {
          console.error('n8n webhook failed:', await webhookResponse.text());
        }
      } catch (webhookError) {
        // Log webhook error but don't fail the request
        console.error('Error calling n8n webhook:', webhookError);
      }
    }

    return NextResponse.json(
      { message: 'Contact form submitted successfully', id: contact._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await ContactModel.findAll();
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
