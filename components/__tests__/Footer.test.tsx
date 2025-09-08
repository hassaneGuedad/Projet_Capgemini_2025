import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer Component', () => {
  it('should render the footer', () => {
    render(<Footer />)
    
    // Check if footer is present
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('should render copyright text', () => {
    render(<Footer />)
    
    // Check if copyright text is present
    expect(screen.getByText(/capgemini/i)).toBeInTheDocument()
  })

  it('should render social media links', () => {
    render(<Footer />)
    
    // Check if social media links are present
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })
}) 