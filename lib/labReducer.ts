export type LabMaterial = 'paper' | 'glass' | 'metal';
export type LabAtmosphere = 'mist' | 'grain' | 'radiance';

export interface LabState {
  temperature: number;
  tint: number;
  contrast: number;
  material: LabMaterial;
  atmosphere: LabAtmosphere[];
}

export type LabAction =
  | { type: 'setTemperature'; value: number }
  | { type: 'setTint'; value: number }
  | { type: 'setContrast'; value: number }
  | { type: 'setMaterial'; value: LabMaterial }
  | { type: 'toggleAtmosphere'; value: LabAtmosphere }
  | { type: 'reset' };

export const defaultLabState: LabState = {
  temperature: 3600,
  tint: 0,
  contrast: 1,
  material: 'glass',
  atmosphere: ['grain'],
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function labReducer(state: LabState, action: LabAction): LabState {
  switch (action.type) {
    case 'setTemperature':
      return {
        ...state,
        temperature: clamp(action.value, 3200, 7000),
      };
    case 'setTint':
      return { ...state, tint: clamp(action.value, -20, 20) };
    case 'setContrast':
      return { ...state, contrast: clamp(action.value, 0.8, 1.4) };
    case 'setMaterial':
      return { ...state, material: action.value };
    case 'toggleAtmosphere': {
      const isActive = state.atmosphere.includes(action.value);
      const atmosphere = isActive
        ? state.atmosphere.filter((value) => value !== action.value)
        : [...state.atmosphere, action.value].slice(-2);
      return { ...state, atmosphere };
    }
    case 'reset':
      return { ...defaultLabState, atmosphere: [...defaultLabState.atmosphere] };
    default:
      return state;
  }
}
