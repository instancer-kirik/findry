import { supabase } from '@/integrations/supabase/client';

export const EMAIL_TEMPLATES = {
  confirmation: {
    subject: 'Welcome to Findry - Verify Your Email',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://findry.app/logo.png" alt="Findry Logo" style="max-width: 150px; margin-bottom: 20px;">
          <h1 style="color: #333; margin-bottom: 10px;">Welcome to Findry!</h1>
          <p style="color: #666; margin-bottom: 20px;">We're excited to have you join our community of artists and event enthusiasts.</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 15px;">Verify Your Email</h2>
          <p style="color: #666; margin-bottom: 20px;">To complete your registration and start using Findry, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
          </div>
          
          <p style="color: #666; margin-top: 20px; font-size: 14px;">If the button above doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">{{ .ConfirmationURL }}</p>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>This email was sent to {{ .Email }}. If you didn't create an account with Findry, you can safely ignore this email.</p>
          <p style="margin-top: 20px;">© {{ .Year }} Findry. All rights reserved.</p>
        </div>
      </div>
    `,
  },
  magicLink: {
    subject: 'Your Findry Login Link',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://findry.app/logo.png" alt="Findry Logo" style="max-width: 150px; margin-bottom: 20px;">
          <h1 style="color: #333; margin-bottom: 10px;">Your Login Link</h1>
          <p style="color: #666; margin-bottom: 20px;">Click the button below to sign in to your Findry account:</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <div style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Sign In to Findry</a>
          </div>
          
          <p style="color: #666; margin-top: 20px; font-size: 14px;">If the button above doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">{{ .ConfirmationURL }}</p>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>This link will expire in 24 hours. If you didn't request this login link, you can safely ignore this email.</p>
          <p style="margin-top: 20px;">© {{ .Year }} Findry. All rights reserved.</p>
        </div>
      </div>
    `,
  },
};

export const updateEmailTemplates = async () => {
  try {
    // Update confirmation email template
    await supabase.auth.admin.updateEmailTemplate({
      template: 'confirmation',
      subject: EMAIL_TEMPLATES.confirmation.subject,
      content: EMAIL_TEMPLATES.confirmation.content,
    });

    // Update magic link email template
    await supabase.auth.admin.updateEmailTemplate({
      template: 'magic-link',
      subject: EMAIL_TEMPLATES.magicLink.subject,
      content: EMAIL_TEMPLATES.magicLink.content,
    });

    console.log('Email templates updated successfully');
  } catch (error) {
    console.error('Error updating email templates:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}; 