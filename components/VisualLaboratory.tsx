'use client';

import { useReducer, useState, type CSSProperties } from 'react';
import {
  defaultLabState,
  labReducer,
  type LabAtmosphere,
  type LabMaterial,
} from '../lib/labReducer';
import styles from './VisualLaboratory.module.css';

const materials: LabMaterial[] = ['paper', 'glass', 'metal'];
const atmospheres: LabAtmosphere[] = ['mist', 'grain', 'radiance'];

type LabStyle = CSSProperties & {
  '--lab-temperature': number;
  '--lab-temperature-shift': string;
  '--lab-tint': string;
  '--lab-contrast': number;
};

export function VisualLaboratory() {
  const [state, dispatch] = useReducer(labReducer, defaultLabState);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const previewStyle: LabStyle = {
    '--lab-temperature': state.temperature,
    '--lab-temperature-shift': `${((state.temperature - 5100) / 1900) * 12}deg`,
    '--lab-tint': `${state.tint * 0.7}deg`,
    '--lab-contrast': state.contrast,
  };

  const resetStudy = () => {
    dispatch({ type: 'reset' });
    setAnnouncement('STUDY RESET');
  };

  return (
    <section id="laboratory" aria-labelledby="lab-title" className={styles.lab}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Material study / Live system</p>
        <h2 id="lab-title">Visual Laboratory</h2>
        <p>
          Re-light one artwork through controlled color, surface and atmosphere.
          Every adjustment remains reproducible.
        </p>
      </header>

      <div className={styles.workspace}>
        <div
          className={styles.preview}
          data-material={state.material}
          data-atmosphere={state.atmosphere.join(' ')}
          style={previewStyle}
        >
          <div className={styles.imageFrame}>
            <picture>
              <source
                type="image/avif"
                srcSet="/posters/glass-tide-800.avif 800w, /posters/glass-tide-1200.avif 1200w"
                sizes="(max-width: 760px) 82vw, 47vw"
              />
              <source
                type="image/webp"
                srcSet="/posters/glass-tide-800.webp 800w, /posters/glass-tide-1200.webp 1200w"
                sizes="(max-width: 760px) 82vw, 47vw"
              />
              <img
                src="/posters/glass-tide-1200.jpg"
                srcSet="/posters/glass-tide-800.jpg 800w, /posters/glass-tide-1200.jpg 1200w"
                sizes="(max-width: 760px) 82vw, 47vw"
                alt="Glass Tide laboratory study"
                width="1200"
                height="1800"
                loading="lazy"
              />
            </picture>
            <span className={styles.materialSheen} aria-hidden="true" />
            <span className={styles.mist} aria-hidden="true" />
            <span className={styles.grain} aria-hidden="true" />
            <span className={styles.radiance} aria-hidden="true" />
          </div>

          <div className={styles.readout} aria-hidden="true">
            <span>STUDY 07</span>
            <span>{state.temperature}K</span>
            <span>{state.material.toUpperCase()}</span>
          </div>
        </div>

        <div className={styles.axis} aria-hidden="true">
          <span>COLOR</span>
          <i />
          <span>MATERIAL</span>
          <i />
          <span>ATMOSPHERE</span>
        </div>

        <form className={styles.controls} onSubmit={(event) => event.preventDefault()}>
          <p className={styles.panelLabel}>Experiment controls</p>

          <ControlRange
            id="lab-temperature"
            label="Temperature"
            min={3200}
            max={7000}
            step={100}
            value={state.temperature}
            output={`${state.temperature}K`}
            onChange={(value) => dispatch({ type: 'setTemperature', value })}
          />
          <ControlRange
            id="lab-tint"
            label="Tint"
            min={-20}
            max={20}
            step={1}
            value={state.tint}
            output={state.tint > 0 ? `+${state.tint}` : `${state.tint}`}
            onChange={(value) => dispatch({ type: 'setTint', value })}
          />
          <ControlRange
            id="lab-contrast"
            label="Contrast"
            min={0.8}
            max={1.4}
            step={0.05}
            value={state.contrast}
            output={`${state.contrast.toFixed(2)}×`}
            onChange={(value) => dispatch({ type: 'setContrast', value })}
          />

          <fieldset className={styles.optionGroup}>
            <legend>Material</legend>
            <div className={styles.segmented}>
              {materials.map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="material"
                    checked={state.material === value}
                    onChange={() => dispatch({ type: 'setMaterial', value })}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.optionGroup}>
            <legend>
              Atmosphere <small>Maximum 2</small>
            </legend>
            <div className={styles.checks}>
              {atmospheres.map((value) => (
                <label key={value}>
                  <input
                    type="checkbox"
                    checked={state.atmosphere.includes(value)}
                    onChange={() => dispatch({ type: 'toggleAtmosphere', value })}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.actions}>
            <button type="button" onClick={() => setRecipeOpen(true)}>
              View recipe
            </button>
            <button type="button" onClick={resetStudy}>
              Reset study
            </button>
          </div>
        </form>

        {recipeOpen ? (
          <aside className={styles.recipe} aria-label="Current recipe">
            <div>
              <p className={styles.panelLabel}>Study 07 / Recipe</p>
              <button type="button" onClick={() => setRecipeOpen(false)}>
                Close recipe
              </button>
            </div>
            <dl>
              <dt>Temperature</dt>
              <dd>{state.temperature}K</dd>
              <dt>Tint</dt>
              <dd>{state.tint > 0 ? `+${state.tint}` : state.tint}</dd>
              <dt>Contrast</dt>
              <dd>{state.contrast.toFixed(2)}×</dd>
              <dt>Material</dt>
              <dd>{state.material}</dd>
              <dt>Atmosphere</dt>
              <dd>{state.atmosphere.join(', ') || 'clean'}</dd>
            </dl>
          </aside>
        ) : null}
      </div>

      <p
        role="status"
        aria-label="Study updates"
        aria-live="polite"
        className="visually-hidden"
      >
        {announcement}
      </p>
    </section>
  );
}

interface ControlRangeProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  output: string;
  onChange: (value: number) => void;
}

function ControlRange({
  id,
  label,
  min,
  max,
  step,
  value,
  output,
  onChange,
}: ControlRangeProps) {
  return (
    <label className={styles.range} htmlFor={id}>
      <span>{label}</span>
      <output htmlFor={id}>{output}</output>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
