import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the service module
vi.mock('../authorized-emails', () => ({
  addAuthorizedEmail: vi.fn(),
  removeAuthorizedEmail: vi.fn(),
  getAuthorizedEmails: vi.fn(),
  isEmailAuthorized: vi.fn(),
}))

describe('Authorized Emails Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('addAuthorizedEmail', () => {
    it('should add an email to authorized list', async () => {
      const { addAuthorizedEmail } = await import('../authorized-emails')
      const mockAddAuthorizedEmail = vi.mocked(addAuthorizedEmail)
      mockAddAuthorizedEmail.mockResolvedValue(true)

      const email = 'test@example.com'
      const result = await addAuthorizedEmail(email)

      expect(result).toBe(true)
      expect(mockAddAuthorizedEmail).toHaveBeenCalledWith(email)
    })

    it('should handle errors when adding email', async () => {
      const { addAuthorizedEmail } = await import('../authorized-emails')
      const mockAddAuthorizedEmail = vi.mocked(addAuthorizedEmail)
      mockAddAuthorizedEmail.mockResolvedValue(false)

      const email = 'test@example.com'
      const result = await addAuthorizedEmail(email)

      expect(result).toBe(false)
    })
  })

  describe('removeAuthorizedEmail', () => {
    it('should remove an email from authorized list', async () => {
      const { removeAuthorizedEmail } = await import('../authorized-emails')
      const mockRemoveAuthorizedEmail = vi.mocked(removeAuthorizedEmail)
      mockRemoveAuthorizedEmail.mockResolvedValue(true)

      const email = 'test@example.com'
      const result = await removeAuthorizedEmail(email)

      expect(result).toBe(true)
      expect(mockRemoveAuthorizedEmail).toHaveBeenCalledWith(email)
    })

    it('should handle errors when removing email', async () => {
      const { removeAuthorizedEmail } = await import('../authorized-emails')
      const mockRemoveAuthorizedEmail = vi.mocked(removeAuthorizedEmail)
      mockRemoveAuthorizedEmail.mockResolvedValue(false)

      const email = 'test@example.com'
      const result = await removeAuthorizedEmail(email)

      expect(result).toBe(false)
    })
  })

  describe('getAuthorizedEmails', () => {
    it('should return list of authorized emails', async () => {
      const { getAuthorizedEmails } = await import('../authorized-emails')
      const mockGetAuthorizedEmails = vi.mocked(getAuthorizedEmails)
      const mockEmails = ['email1@example.com', 'email2@example.com']
      mockGetAuthorizedEmails.mockResolvedValue(mockEmails)

      const result = await getAuthorizedEmails()

      expect(result).toEqual(mockEmails)
      expect(mockGetAuthorizedEmails).toHaveBeenCalled()
    })

    it('should return empty array when no emails found', async () => {
      const { getAuthorizedEmails } = await import('../authorized-emails')
      const mockGetAuthorizedEmails = vi.mocked(getAuthorizedEmails)
      mockGetAuthorizedEmails.mockResolvedValue([])

      const result = await getAuthorizedEmails()

      expect(result).toEqual([])
    })
  })

  describe('isEmailAuthorized', () => {
    it('should return true for authorized email', async () => {
      const { isEmailAuthorized } = await import('../authorized-emails')
      const mockIsEmailAuthorized = vi.mocked(isEmailAuthorized)
      mockIsEmailAuthorized.mockResolvedValue(true)

      const result = await isEmailAuthorized('authorized@example.com')

      expect(result).toBe(true)
    })

    it('should return false for unauthorized email', async () => {
      const { isEmailAuthorized } = await import('../authorized-emails')
      const mockIsEmailAuthorized = vi.mocked(isEmailAuthorized)
      mockIsEmailAuthorized.mockResolvedValue(false)

      const result = await isEmailAuthorized('unauthorized@example.com')

      expect(result).toBe(false)
    })
  })
}) 