import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuraExperience } from '../components/AuraExperience';

describe('AuraExperience', () => {
  it('renders the archive identity and chapter navigation', () => {
    const { container } = render(<AuraExperience />);

    expect(
      screen.getByRole('heading', { name: /aura film archive/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('navigation', { name: /archive chapters/i }),
    ).toBeVisible();

    const skipLink = screen.getByRole('link', { name: /skip to archive/i });
    expect(skipLink).toHaveAttribute('href', '#main');
    expect(container.querySelector('#main')).toBeInTheDocument();

    for (const link of screen.getByRole('navigation').querySelectorAll('a')) {
      const target = link.getAttribute('href');
      expect(target).toMatch(/^#/);
      expect(container.querySelector(target!)).toBeInTheDocument();
    }
  });
});
