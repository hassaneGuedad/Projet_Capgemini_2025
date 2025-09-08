import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../ui/input'

describe('Input Component', () => {
  it('should render input with placeholder', () => {
    render(<Input placeholder="Enter your name" />)
    expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument()
  })

  it('should handle value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} placeholder="Test input" />)
    
    const input = screen.getByPlaceholderText(/test input/i)
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('test value')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />)
    expect(screen.getByPlaceholderText(/disabled input/i)).toBeDisabled()
  })

  it('should apply custom className', () => {
    render(<Input className="custom-class" placeholder="Test" />)
    const input = screen.getByPlaceholderText(/test/i)
    expect(input).toHaveClass('custom-class')
  })

  it('should handle different input types', () => {
    render(<Input type="email" placeholder="Email" />)
    const input = screen.getByPlaceholderText(/email/i)
    expect(input).toHaveAttribute('type', 'email')
  })

  it('should handle controlled input', () => {
    render(<Input value="controlled value" placeholder="Test" />)
    const input = screen.getByPlaceholderText(/test/i)
    expect(input).toHaveValue('controlled value')
  })
}) 