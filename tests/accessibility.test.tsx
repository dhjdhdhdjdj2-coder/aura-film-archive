import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { AuraExperience } from '../components/AuraExperience';

describe('release accessibility', () => {
  it('has no detectable WCAG A/AA violations in the default static state', async () => {
    const { container } = render(<AuraExperience />);

    expect(
      await axe(container, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
        },
      }),
    ).toHaveNoViolations();
  });

  it('closes the collection with a named archive index and authorship disclosure', () => {
    render(<AuraExperience />);

    const contentInfo = screen.getByRole('contentinfo');
    expect(contentInfo).toBeVisible();
    expect(contentInfo.closest('main')).toBeNull();
    expect(screen.getByRole('list', { name: /archive index/i })).toBeVisible();
    expect(
      screen.getByRole('heading', {
        name: 'END OF COLLECTION 01. THE ARCHIVE REMAINS OPEN.',
      }),
    ).toBeVisible();
    expect(screen.getByText('AI-GENERATED / HUMAN ART-DIRECTED')).toBeVisible();
  });
});
