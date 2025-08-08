import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import nodemailer from 'nodemailer';

// Mock nodemailer
vi.mock('nodemailer');

const mockSendMail = vi.fn();

vi.mocked(nodemailer.createTransport).mockReturnValue({
  sendMail: mockSendMail,
} as any);

describe('API Route: /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 OK and success:true on valid submission', async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: '123' });

    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'This is a test message.',
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledWith({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: 'Nouveau message de contact de John Doe',
      text: 'Nom: John Doe\nEmail: john.doe@example.com\n\nMessage:\nThis is a test message.',
      replyTo: 'john.doe@example.com',
    });
  });

  it('should return 400 Bad Request if fields are missing', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        // email is missing
        message: 'This is a test message.',
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: 'Champs manquants.' });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it('should return 500 Internal Server Error if sendMail fails', async () => {
    mockSendMail.mockRejectedValueOnce(new Error('Failed to send email'));

    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        message: 'Another test message.',
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: 'Erreur lors de l\'envoi.' });
    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });
});
