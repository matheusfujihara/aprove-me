import { describe, expect, it } from "vitest";
import { isValidCpfOrCnpj, isValidEmail, onlyDigits } from "@/lib/validators";

describe("validators", () => {
  it("normaliza caracteres nao numericos", () => {
    expect(onlyDigits("11.222.333/0001-81")).toBe("11222333000181");
  });

  it("valida CPF e CNPJ corretos", () => {
    expect(isValidCpfOrCnpj("529.982.247-25")).toBe(true);
    expect(isValidCpfOrCnpj("11.222.333/0001-81")).toBe(true);
  });

  it("rejeita documentos invalidos", () => {
    expect(isValidCpfOrCnpj("11111111111")).toBe(false);
    expect(isValidCpfOrCnpj("12345678900")).toBe(false);
  });

  it("valida e-mail basico", () => {
    expect(isValidEmail("alguem@empresa.com")).toBe(true);
    expect(isValidEmail("email-invalido")).toBe(false);
  });
});
