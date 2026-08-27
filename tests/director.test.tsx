import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DirectorMode } from '../components/DirectorMode';
import { films } from '../data/films';

describe('DirectorMode', () => {
  it('renders all five stages and the generation provenance', () => {
    render(<DirectorMode film={films[0]} />);

    for (const label of [
      'Inspiration',
      'Visual Analysis',
      'Prompt',
      'Generation',
      'Final Art Direction',
    ]) {
      expect(screen.getByRole('heading', { name: label })).toBeVisible();
    }
    expect(screen.getByText(/aura diffusion xl/i)).toBeVisible();
    expect(screen.getByText(/human edits/i)).toBeVisible();
    expect(screen.getByRole('slider', { name: /before and after/i })).toBeVisible();
  });

  it('copies the active prompt and announces completion', async () => {
    const user = userEvent.setup();
    render(<DirectorMode film={films[0]} />);

    await user.click(screen.getByRole('button', { name: 'Prompt' }));
    await user.click(screen.getByRole('button', { name: /copy prompt/i }));

    expect(screen.getByText('PROMPT COPIED')).toBeInTheDocument();
  });

  it('reports a clipboard rejection without claiming success', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(
      new DOMException('Permission denied', 'NotAllowedError'),
    );
    render(<DirectorMode film={films[0]} />);

    await user.click(screen.getByRole('button', { name: 'Prompt' }));
    await user.click(screen.getByRole('button', { name: /copy prompt/i }));

    expect(await screen.findByText('COPY FAILED — SELECT PROMPT MANUALLY')).toBeVisible();
    expect(screen.queryByText('PROMPT COPIED')).not.toBeInTheDocument();
  });
});
