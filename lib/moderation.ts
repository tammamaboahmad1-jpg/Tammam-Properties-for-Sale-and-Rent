export function phoneOrEmailFound(text: string) {
  const phoneRegex = /(\+?\d[\d\-\s]{5,}\d)/g;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
  const phones = text.match(phoneRegex) || [];
  const emails = text.match(emailRegex) || [];
  return { phones, emails, blocked: phones.length > 0 || emails.length > 0 };
}
