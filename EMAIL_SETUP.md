# Email Notifications Setup Guide

EduConnect uses **Nodemailer** with Gmail to send automated email notifications to users. This guide will help you configure email notifications for your application.

## 📧 Email Features

The application sends email notifications for the following events:

### 1. **User Registration**
- Sent when a new user (publisher or school) registers
- Confirms registration and notifies about account review

### 2. **Account Approval/Rejection**
- Sent when admin approves or rejects a user account
- Includes login link for approved accounts

### 3. **Order Confirmation**
- Sent to schools when they place an order
- Includes order details, items, and total amount

### 4. **New Order Notification (Publishers)**
- Sent to publishers when they receive a new order
- Includes order details and school information

### 5. **Order Status Updates**
- Sent to schools when order status changes (confirmed, delivered, cancelled)
- Includes current status and order tracking link

### 6. **Password Change Confirmation**
- Sent when a user changes their password
- Security notification for account changes

---

## 🔧 Configuration

### Step 1: Enable Gmail App Password

To send emails through Gmail, you need to create an **App Password**:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Click **Select app** → Choose **Mail**
5. Click **Select device** → Choose **Other (Custom name)**
6. Enter "EduConnect" and click **Generate**
7. Copy the 16-character password (remove spaces)

### Step 2: Update Environment Variables

Add the following to your `server/.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:8080
```

**Example:**
```env
EMAIL_USER=educonnect@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
FRONTEND_URL=http://localhost:8080
```

### Step 3: Restart Server

After updating the `.env` file, restart your backend server:

```bash
cd server
npm run dev
```

You should see: `📧 Email service ready` in the console.

---

## 🧪 Testing Email Notifications

### Test 1: Registration Email
1. Register a new user (publisher or school)
2. Check the email inbox for welcome message

### Test 2: Approval Email
1. Login as admin
2. Approve a pending user
3. Check the user's email for approval notification

### Test 3: Order Confirmation
1. Login as school
2. Place an order
3. Check school email for order confirmation
4. Check publisher email for new order notification

### Test 4: Password Change
1. Login as any user
2. Go to Settings → Change Password
3. Update password
4. Check email for confirmation

---

## 📝 Email Templates

All email templates are located in: `server/src/services/emailService.js`

### Available Functions:

| Function | Description | Triggered By |
|----------|-------------|--------------|
| `sendRegistrationEmail()` | Welcome email on signup | User registration |
| `sendApprovalEmail()` | Account status notification | Admin approval/rejection |
| `sendOrderConfirmationEmail()` | Order receipt for schools | Order placement |
| `sendNewOrderNotificationToPublisher()` | New order alert for publishers | Order placement |
| `sendOrderStatusUpdateEmail()` | Status change notification | Order status update |
| `sendPasswordChangeConfirmation()` | Password change alert | Password update |

---

## 🎨 Customizing Email Templates

To customize email templates, edit `server/src/services/emailService.js`:

```javascript
const sendRegistrationEmail = async ({ to, name, role }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Welcome to EduConnect',
    html: `
      <!-- Your custom HTML here -->
    `,
  };
  // ...
};
```

### Email Styling Tips:
- Use inline CSS (external stylesheets don't work in emails)
- Keep design simple and responsive
- Test across different email clients (Gmail, Outlook, etc.)
- Use tables for layout (better email client support)

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use App Passwords** instead of your actual Gmail password
3. **Enable 2-Factor Authentication** on your Gmail account
4. **Rotate App Passwords** periodically
5. **Use environment-specific emails** (dev, staging, production)

---

## 🚨 Troubleshooting

### Issue: "Email service verification failed"

**Solutions:**
1. Check if `EMAIL_USER` and `EMAIL_PASS` are set correctly in `.env`
2. Verify App Password is correct (no spaces)
3. Ensure 2-Step Verification is enabled on Gmail
4. Check if Gmail is blocking the app (check security alerts)

### Issue: Emails not being received

**Solutions:**
1. Check spam/junk folder
2. Verify recipient email address is correct
3. Check server logs for email sending errors
4. Test with a different email provider

### Issue: "Invalid login" error

**Solutions:**
1. Generate a new App Password
2. Make sure you're using App Password, not regular password
3. Check if Gmail account has 2FA enabled

---

## 📊 Monitoring Email Delivery

Check server logs for email status:

```bash
# Success
📧 Email service ready

# Warning (email not sent but app continues)
⚠️  Unable to send registration email: [error message]
```

---

## 🌐 Production Deployment

For production, consider using:

1. **SendGrid** - Reliable email service with analytics
2. **AWS SES** - Cost-effective for high volume
3. **Mailgun** - Developer-friendly API
4. **Postmark** - Fast transactional emails

### Switching to SendGrid (Example):

```javascript
// server/src/config/mailer.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const transporter = {
  sendMail: async (options) => {
    await sgMail.send({
      to: options.to,
      from: options.from,
      subject: options.subject,
      html: options.html,
    });
  },
};
```

---

## 📚 Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [Email HTML Best Practices](https://www.campaignmonitor.com/css/)

---

## ✅ Checklist

- [ ] Gmail App Password created
- [ ] Environment variables configured
- [ ] Server restarted
- [ ] Registration email tested
- [ ] Approval email tested
- [ ] Order confirmation tested
- [ ] Password change email tested
- [ ] Production email service selected (if applicable)

---

**Need Help?** Check the server logs or contact the development team.





