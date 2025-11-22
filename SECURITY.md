# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in scarmServer, please follow these steps:

### 1. Do Not Open a Public Issue

Please **do not** open a public GitHub issue for security vulnerabilities.

### 2. Contact Us Privately

Send an email to: **Scarmonit@gmail.com**

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-3 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Best effort

### 4. Disclosure Policy

- We will work with you to understand and resolve the issue
- We will credit you in the security advisory (if desired)
- We will coordinate public disclosure after a fix is available

## Security Best Practices

When using scarmServer:

### Environment Variables

- ✅ Always use `.env` files for sensitive data
- ✅ Never commit `.env` files to version control
- ✅ Use strong, unique API keys
- ✅ Rotate credentials regularly

### Input Validation

```javascript
import { validateRequired, validateEmail } from './utils/validation.js';

// Always validate external input
validateRequired(userInput, 'field');
validateEmail(email, 'email');
```

### Error Handling

```javascript
// Don't expose internal errors to users
try {
  await operation();
} catch (err) {
  error('Operation failed', err);
  // Return generic error to user
  throw new Error('An error occurred');
}
```

### Logging

```javascript
// Never log sensitive data
info('User logged in', { userId: user.id }); // ✓ Good
info('User logged in', { password: user.password }); // ✗ Bad
```

### Dependencies

- Keep dependencies up to date
- Run `npm audit` regularly
- Review security advisories

### Rate Limiting

- Implement rate limiting for public APIs
- Protect against brute force attacks
- Use timeouts for long-running operations

### HTTPS

- Always use HTTPS in production
- Enforce secure connections
- Use modern TLS versions

## Known Security Considerations

### Logging

- Logger outputs to console by default
- Ensure logs are properly secured in production
- Consider using external logging services

### Session Management

- Implement proper session timeout
- Use secure session storage
- Validate session tokens

### API Keys

- Store API keys in environment variables
- Never hardcode credentials
- Use principle of least privilege

## Security Updates

We will announce security updates through:

- GitHub Security Advisories
- Repository CHANGELOG.md
- Email to reported vulnerability contacts

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who help us improve scarmServer's security.

---

**Last Updated**: November 22, 2025  
**Contact**: Scarmonit@gmail.com
