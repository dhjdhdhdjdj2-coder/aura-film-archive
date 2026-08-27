import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { films } from '../data/films';
import { Landing } from '../components/Landing';

describe('Landing', () => {
  it('renders the exhibition identity and an eager semantic poster before WebGL', () => {
    render(<Landing heroFilm={films[0]} tier="static" reducedMotion={false} />);

    expect(screen.getByRole('heading', { name: /aura film archive/i })).toBeVisible();
    expect(screen.getByText('Cinema that never existed, preserved as if it did.')).toBeVisible();
    expect(screen.getByRole('link', { name: /enter archive/i })).toHaveAttribute(
      'href',
      '#archive',
    );
    const poster = screen.getByRole('img', { name: films[0].poster.alt });
    expect(poster).toHaveAttribute('fetchpriority', 'high');
    expect(poster).not.toHaveAttribute('loading', 'lazy');
    expect(poster).toHaveAttribute('sizes');
    expect(poster.getAttribute('sizes')).toContain('(max-width: 896px) 224px');
    expect(poster.getAttribute('srcset')).toContain('afterlight-480.jpg 480w');
  });

  it('marks the poster scan as reduced when motion is reduced', () => {
    const { container } = render(
      <Landing heroFilm={films[0]} tier="static" reducedMotion />,
    );
    expect(container.querySelector('#top')).toHaveAttribute(
      'data-reduced-motion',
      'true',
    );
  });
});
