import { describe, it, expect } from 'vitest'

// Fonction de validation d'email simple
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  // Vérifications supplémentaires pour les cas edge
  if (email.includes('..') || email.endsWith('.') || email.startsWith('.')) {
    return false
  }
  return emailRegex.test(email)
}

// Fonction de validation de mot de passe
const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
}

describe('Validation Service', () => {
  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@example')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isValidEmail('test@example..com')).toBe(false)
      expect(isValidEmail('test..name@example.com')).toBe(false)
      expect(isValidEmail('test@example.com.')).toBe(false)
    })
  })

  describe('Password Validation', () => {
    it('should validate strong passwords', () => {
      expect(isValidPassword('StrongPass123')).toBe(true)
      expect(isValidPassword('MySecurePwd1')).toBe(true)
      expect(isValidPassword('ComplexPassword123')).toBe(true)
    })

    it('should reject weak passwords', () => {
      expect(isValidPassword('weak')).toBe(false) // trop court
      expect(isValidPassword('weakpassword')).toBe(false) // pas de majuscule ni chiffre
      expect(isValidPassword('WEAKPASSWORD')).toBe(false) // pas de minuscule ni chiffre
      expect(isValidPassword('weakpass123')).toBe(false) // pas de majuscule
      expect(isValidPassword('WEAKPASS123')).toBe(false) // pas de minuscule
      expect(isValidPassword('WeakPass')).toBe(false) // pas de chiffre
    })

    it('should handle edge cases', () => {
      expect(isValidPassword('')).toBe(false)
      expect(isValidPassword('12345678')).toBe(false) // pas de lettres
      expect(isValidPassword('abcdefgh')).toBe(false) // pas de majuscule ni chiffre
    })
  })
}) 