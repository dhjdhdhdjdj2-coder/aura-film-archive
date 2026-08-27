import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VisualLaboratory } from '../components/VisualLaboratory';
import { defaultLabState, labReducer } from '../lib/labReducer';

describe('labReducer', () => {
  it('clamps numeric controls to their supported ranges', () => {
    expect(
      labReducer(defaultLabState, { type: 'setTemperature', value: 9000 })
        .temperature,
    ).toBe(7000);
    expect(labReducer(defaultLabState, { type: 'setTint', value: -30 }).tint).toBe(
      -20,
    );
    expect(
      labReducer(defaultLabState, { type: 'setContrast', value: 0.2 }).contrast,
    ).toBe(0.8);
  });

  it('limits atmosphere to two simultaneous effects', () => {
    let state = labReducer(defaultLabState, {
      type: 'toggleAtmosphere',
      value: 'mist',
    });
    state = labReducer(state, {
      type: 'toggleAtmosphere',
      value: 'radiance',
    });
    expect(state.atmosphere).toEqual(['mist', 'radiance']);
  });

  it('resets every parameter', () => {
    let changed = labReducer(defaultLabState, { type: 'setTemperature', value: 7000 });
    changed = labReducer(changed, { type: 'setTint', value: 14 });
    changed = labReducer(changed, { type: 'setContrast', value: 1.35 });
    changed = labReducer(changed, { type: 'setMaterial', value: 'metal' });
    changed = labReducer(changed, { type: 'toggleAtmosphere', value: 'mist' });
    expect(labReducer(changed, { type: 'reset' })).toEqual(defaultLabState);
  });
});

describe('VisualLaboratory', () => {
  it('updates the live recipe and preserves real form semantics', () => {
    render(<VisualLaboratory />);

    fireEvent.change(screen.getByRole('slider', { name: /temperature/i }), {
      target: { value: '6200' },
    });
    fireEvent.click(screen.getByRole('radio', { name: /metal/i }));
    fireEvent.click(screen.getByRole('button', { name: /view recipe/i }));

    const recipe = screen.getByRole('complementary', { name: /current recipe/i });
    expect(recipe).toHaveTextContent('6200K');
    expect(recipe).toHaveTextContent('metal');
  });

  it('resets the study and announces the action', () => {
    render(<VisualLaboratory />);

    fireEvent.change(screen.getByRole('slider', { name: /temperature/i }), {
      target: { value: '6200' },
    });
    fireEvent.click(screen.getByRole('button', { name: /reset study/i }));

    expect(screen.getByRole('slider', { name: /temperature/i })).toHaveValue('3600');
    expect(screen.getByRole('status', { name: /study updates/i })).toHaveTextContent(
      'STUDY RESET',
    );
  });

  it('binds atmosphere controls to the rendered study state', () => {
    const { container } = render(<VisualLaboratory />);

    fireEvent.click(screen.getByRole('checkbox', { name: /mist/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /radiance/i }));

    expect(screen.getByRole('checkbox', { name: /grain/i })).not.toBeChecked();
    expect(container.querySelector('[data-atmosphere]')).toHaveAttribute(
      'data-atmosphere',
      'mist radiance',
    );
  });
});
