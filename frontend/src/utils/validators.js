export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
  return password && password.length >= 8;
}

export function validatePdf(fileName) {
  return fileName.toLowerCase().endsWith('.pdf');
}
