// Funções utilitárias para validação de formulários

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email é obrigatório';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password.trim()) return 'Senha obrigatória';
  if (password.length < 8) return 'Mínimo 8 caracteres';
  return null;
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (confirm !== password) return 'Senhas não coincidem';
  return null;
}

export function validateRequired(field: string, label: string): string | null {
  if (!field.trim()) return `${label} é obrigatório`;
  return null;
}
