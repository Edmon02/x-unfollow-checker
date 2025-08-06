# Security Policy

## 🔒 Security Overview

X Unfollow Checker takes security and privacy seriously. This document outlines
our security practices and how to report security vulnerabilities.

## 🛡️ Security Features

### Data Privacy

- **Local Storage Only**: All user data is stored locally on your device
- **No External Transmission**: No data is sent to external servers
- **No Analytics**: We don't collect usage analytics or personal information
- **No Tracking**: No user behavior tracking or fingerprinting

### Extension Security

- **Manifest V3**: Uses the latest Chrome extension security model
- **Minimal Permissions**: Requests only the permissions necessary for
  functionality
- **Content Security Policy**: Strict CSP prevents code injection attacks
- **Sandboxed Environment**: Runs in Chrome's secure extension sandbox

### Code Security

- **No eval()**: No dynamic code execution
- **Input Validation**: All user inputs are validated and sanitized
- **XSS Prevention**: Protected against cross-site scripting attacks
- **Safe APIs Only**: Uses only secure browser APIs

## 🚨 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Fully supported |
| 0.9.x   | ⚠️ Limited support |
| < 0.9   | ❌ No support      |

## 📢 Reporting a Vulnerability

We take security vulnerabilities seriously and appreciate responsible
disclosure.

### How to Report

**For security vulnerabilities, please DO NOT open a public issue.**

Instead, please report security issues privately:

1. **Email**: Send details to the project maintainer
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Include

```
Subject: [SECURITY] Brief description

Vulnerability Details:
- Type: [e.g., XSS, Code Injection, Data Leak]
- Severity: [Critical/High/Medium/Low]
- Affected Versions: [e.g., 1.0.0, all versions]

Reproduction Steps:
1. Step one
2. Step two
3. etc.

Impact:
- What data could be accessed/modified?
- What actions could an attacker perform?

Evidence:
- Screenshots (if applicable)
- Console logs
- Network traces

Suggested Fix:
[Optional: your suggestions for fixing the issue]
```

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Status Updates**: Every 7 days until resolved
- **Resolution**: Target within 30 days for critical issues

### Disclosure Policy

- We follow responsible disclosure principles
- Security fixes will be prioritized and released ASAP
- Public disclosure only after fix is available
- Credit will be given to security researchers (if desired)

## 🔍 Security Best Practices for Users

### Installation

- Only install from official sources (Chrome Web Store, GitHub releases)
- Verify the publisher before installation
- Check reviews and ratings

### Usage

- Keep the extension updated to the latest version
- Review permissions before granting access
- Report suspicious behavior immediately

### Data Protection

- Regularly export your allowlists as backups
- Clear extension data when uninstalling
- Don't share exported data files publicly

## 🛠️ Security Testing

### Automated Testing

- Regular dependency vulnerability scans
- Static code analysis for security issues
- Permission auditing

### Manual Testing

- Code reviews for all changes
- Security-focused testing scenarios
- Third-party security assessments (planned)

## 📋 Security Checklist for Developers

When contributing to this project, please ensure:

- [ ] No hardcoded secrets or credentials
- [ ] All user inputs are validated and sanitized
- [ ] No use of `eval()` or `innerHTML` with user data
- [ ] Proper error handling without information leakage
- [ ] Minimal privilege principle followed
- [ ] No unnecessary permissions requested
- [ ] Secure defaults for all settings
- [ ] Input validation on all data boundaries

## 🔒 Threat Model

### In Scope

- Extension code vulnerabilities
- Data privacy issues
- Permission escalation
- Cross-site scripting (XSS)
- Code injection attacks
- Man-in-the-middle attacks on extension updates

### Out of Scope

- X.com website vulnerabilities
- Browser vulnerabilities
- Operating system vulnerabilities
- Social engineering attacks
- Physical device access
- Network infrastructure attacks

## 📚 Security Resources

### External Resources

- [Chrome Extension Security](https://developer.chrome.com/docs/extensions/mv3/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Extension Security](https://extensionworkshop.com/documentation/develop/build-a-secure-extension/)

### Internal Documentation

- [Privacy Policy](PRIVACY.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## 🆘 Incident Response

In case of a security incident:

1. **Immediate Response**
   - Assess the scope and impact
   - Contain the vulnerability if possible
   - Document all findings

2. **Communication**
   - Notify affected users via GitHub
   - Provide clear instructions for mitigation
   - Prepare security advisory

3. **Resolution**
   - Develop and test fix
   - Release emergency update
   - Monitor for additional issues

4. **Post-Incident**
   - Conduct post-mortem analysis
   - Update security measures
   - Improve prevention strategies

## 📞 Contact Information

For security-related inquiries:

- **GitHub Issues**: For non-sensitive security discussions
- **Private Contact**: For confidential vulnerability reports

---

**Remember**: Security is a shared responsibility. Thank you for helping keep X
Unfollow Checker secure for everyone!
