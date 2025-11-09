export const welcomeUserEmail = (userName) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      color: #333;
    }
    .content {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
    }
    .button {
      margin: 20px 0;
      text-align: center;
    }
    .button a {
      background-color: #0073aa;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #999;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to Our Website!</h1>
    </div>
    <div class="content">
      <p>Hi ${userName},</p>
      <p>Thank you for registering with us! We're excited to have you on board.</p>
      <p>You can now log in to your account, explore our features, and stay updated.</p>
      <p>If you have any questions or need help getting started, feel free to reply to this email.</p>
      <p>Welcome again, and enjoy your experience!</p>

      <p>– The Plannerify.io Team</p>
    </div>

    <div class="footer">
      © 2025 plannerify.io. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const activationCodeEmail = (code: number) => `
  <div style="max-width: 480px; margin: 0 auto; padding: 24px; font-family: Arial, sans-serif; text-align: center; color: #333;">
    <h2 style="color: #4CAF50; margin-bottom: 8px;">Welcome to Plannerify.io!</h2>
    <p style="font-size: 16px; margin-bottom: 24px;">
      Use the activation code below to verify your account and start planning smarter.
    </p>
    <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 12px 24px; background-color: #f4f4f4; border-radius: 8px; display: inline-block;">
      ${code}
    </div>
    <p style="font-size: 14px; color: #666; margin-top: 24px;">
      This code will expire in 10 minutes. If you did not request this, please ignore this email.
    </p>
  </div>
`;

export const passwordRecoveryEmail = (code: number) => `
  <div style="max-width: 480px; margin: 0 auto; padding: 24px; font-family: Arial, sans-serif; text-align: center; color: #333;">
    <h2 style="color: #4CAF50; margin-bottom: 8px;">Welcome to Plannerify.io!</h2>
    <p style="font-size: 16px; margin-bottom: 24px;">
      Use the activation code below to verify your account and start planning smarter.
    </p>
    <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 12px 24px; background-color: #f4f4f4; border-radius: 8px; display: inline-block;">
      ${code}
    </div>
    <p style="font-size: 14px; color: #666; margin-top: 24px;">
      This code will expire in 10 minutes. If you did not request this, please ignore this email.
    </p>
  </div>
`;
