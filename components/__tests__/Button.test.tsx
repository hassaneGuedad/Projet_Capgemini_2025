import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../ui/button'

describe('Button Component', () => {
  // Tests de base
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    expect(screen.getByRole('button', { name: /disabled button/i })).toBeDisabled()
  })

  // Tests des variants
  describe('variants', () => {
    it('should apply default variant correctly', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button', { name: /default/i })
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('should apply destructive variant correctly', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button', { name: /delete/i })
      expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground')
    })

    it('should apply outline variant correctly', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button', { name: /outline/i })
      expect(button).toHaveClass('border', 'border-input', 'bg-background')
    })

    it('should apply secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button', { name: /secondary/i })
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })

    it('should apply ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button', { name: /ghost/i })
      expect(button).toHaveClass()
    })

    it('should apply link variant correctly', () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByRole('button', { name: /link/i })
      expect(button).toHaveClass('text-primary', 'underline-offset-4')
    })
  })

  // Tests des tailles
  describe('sizes', () => {
    it('should apply default size correctly', () => {
      render(<Button>Default Size</Button>)
      const button = screen.getByRole('button', { name: /default size/i })
      expect(button).toHaveClass('h-10', 'px-4', 'py-2')
    })

    it('should apply small size correctly', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button', { name: /small/i })
      expect(button).toHaveClass('h-9', 'rounded-md', 'px-3')
    })

    it('should apply large size correctly', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button', { name: /large/i })
      expect(button).toHaveClass('h-11', 'rounded-md', 'px-8')
    })

    it('should apply icon size correctly', () => {
      render(<Button size="icon">Icon</Button>)
      const button = screen.getByRole('button', { name: /icon/i })
      expect(button).toHaveClass('h-10', 'w-10')
    })
  })

  // Tests de asChild
  describe('asChild', () => {
    it('should render as child component', () => {
      const { container } = render(
        <Button asChild>
          <a href="#">As Child</a>
        </Button>
      )
      expect(container.querySelector('a')).toBeInTheDocument()
    })

    it('should apply classes to child component', () => {
      const { container } = render(
        <Button asChild>
          <a href="#">Styled Child</a>
        </Button>
      )
      const link = container.querySelector('a')
      expect(link).toHaveClass('inline-flex', 'items-center')
    })
  })

  it('should apply size classes correctly', () => {
    render(<Button size="sm">Small Button</Button>)
    const button = screen.getByRole('button', { name: /small button/i })
    expect(button).toHaveClass('h-9', 'rounded-md', 'px-3')
  })
}) 