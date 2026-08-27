import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuraExperience } from '../components/AuraExperience';
import { useArchiveUrlState } from '../hooks/useArchiveUrlState';

describe('archive flow', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('opens and closes a film while restoring focus and URL state', async () => {
    const user = userEvent.setup();
    render(<AuraExperience />);
    const trigger = screen.getByRole('link', { name: /view afterlight/i });

    await user.click(trigger);

    expect(screen.getByRole('dialog', { name: /afterlight/i })).toBeVisible();
    expect(window.location.search).toContain('film=afterlight');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('filters the wall immediately and clears the selection', async () => {
    const user = userEvent.setup();
    render(<AuraExperience />);

    await user.selectOptions(screen.getByLabelText('Genre'), 'Neo-noir');
    expect(screen.getByText('01 FILM RETRIEVED')).toBeVisible();
    expect(screen.getByRole('link', { name: /view a memory of rain/i })).toBeVisible();
    expect(screen.queryByRole('link', { name: /view afterlight/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(screen.getByText('08 FILMS RETRIEVED')).toBeVisible();
  });

  it('normalizes unknown film and filter values from the URL', async () => {
    window.history.replaceState(
      {},
      '',
      '/?film=missing&genre=invalid&palette=unknown&model=nope&year=2030',
    );
    render(<AuraExperience />);

    await waitFor(() => expect(screen.getByText('08 FILMS RETRIEVED')).toBeVisible());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(window.location.search).toBe('');
  });

  it('writes one history entry per update in Strict Mode', () => {
    const push = vi.spyOn(window.history, 'pushState');
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StrictMode>{children}</StrictMode>
    );
    const { result } = renderHook(() => useArchiveUrlState(), { wrapper });

    act(() => result.current.update({ genre: 'Neo-noir' }));

    expect(push).toHaveBeenCalledTimes(1);
    push.mockRestore();
  });
});
