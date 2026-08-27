import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ArchiveHeader } from '../components/ArchiveHeader';

describe('ArchiveHeader', () => {
  it('shows archive chapters and exposes the motion control', async () => {
    const setMode = vi.fn();
    render(<ArchiveHeader mode="full" setMode={setMode} />);

    expect(screen.getByRole('navigation', { name: /archive chapters/i })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Archive' }).className).toMatch(
      /chapterLink/,
    );
    expect(screen.getByText('COLLECTION 01 / 08 FILMS')).toBeVisible();
    const toggle = screen.getByRole('button', { name: /motion: full/i });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(toggle);
    expect(setMode).toHaveBeenCalledWith('reduced');
  });
});
