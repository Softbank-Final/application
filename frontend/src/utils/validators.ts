// 기본 인증 유효성 검사
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 보안 정책 강화
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 도메인 특화 유효성 검사
export const validateFunctionName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z0-9-_]+$/;
  return name.length >= 3 && name.length <= 50 && nameRegex.test(name);
};

export const validateTimeout = (timeout: number): boolean => {
  return timeout >= 1 && timeout <= 900;
};

export const validateMemory = (memory: number): boolean => {
  const validMemorySizes = [128, 256, 512, 1024, 2048, 4096, 8192];
  return validMemorySizes.includes(memory);
};
