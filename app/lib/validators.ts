export type ValidationErrors<T extends string> = Partial<Record<T, string>>;

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  const calc = (base: string, factor: number): number => {
    let total = 0;
    for (let index = 0; index < base.length; index += 1) {
      total += Number(base[index]) * (factor - index);
    }
    const result = (total * 10) % 11;
    return result === 10 ? 0 : result;
  };

  const d1 = calc(digits.slice(0, 9), 10);
  const d2 = calc(digits.slice(0, 10), 11);

  return d1 === Number(digits[9]) && d2 === Number(digits[10]);
}

function isValidCnpj(cnpj: string): boolean {
  const digits = onlyDigits(cnpj);
  if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) {
    return false;
  }

  const calc = (base: string, multipliers: number[]): number => {
    const total = base
      .split("")
      .reduce((sum, value, index) => sum + Number(value) * multipliers[index], 0);
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const d1 = calc(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calc(digits.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return d1 === Number(digits[12]) && d2 === Number(digits[13]);
}

export function isValidCpfOrCnpj(value: string): boolean {
  const digits = onlyDigits(value);
  return digits.length === 11 ? isValidCpf(digits) : isValidCnpj(digits);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateDocumentInline(value: string): string {
  const digits = onlyDigits(value);
  if (digits.length === 11) return isValidCpfOrCnpj(value) ? "" : "CPF inválido.";
  if (digits.length === 14) return isValidCpfOrCnpj(value) ? "" : "CNPJ inválido.";
  return "";
}

export function validatePhoneInline(value: string): string {
  const digits = onlyDigits(value);
  if (digits.length > 0 && digits.length < 10) return "Número incompleto.";
  return "";
}

export function maskDocument(value: string): string {
  const digits = onlyDigits(value).slice(0, 14);
  if (digits.length <= 11) {
    // CPF: XXX.XXX.XXX-XX
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
  }
  // CNPJ: XX.XXX.XXX/XXXX-XX
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  // (DDD) X XXXX-XXXX
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/\) (\d)(\d{4})(\d)/, ") $1 $2-$3")
    .replace(/-(\d{4})\d+$/, "-$1");
}
