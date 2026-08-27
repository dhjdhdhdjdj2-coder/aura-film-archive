export type DirectorStageKind =
  | 'inspiration'
  | 'analysis'
  | 'prompt'
  | 'generation'
  | 'art-direction';

export interface FilmPalette {
  name: string;
  hex: `#${string}`;
  use: string;
}

export interface DirectorStage {
  kind: DirectorStageKind;
  title: string;
  summary: string;
  details: readonly string[];
}

export interface Film {
  archiveId: `AF–00${number}`;
  slug: string;
  title: string;
  year: 2026;
  genre: string;
  runtime: string;
  tagline: string;
  concept: string;
  poster: {
    avifSrcSet: string;
    webpSrcSet: string;
    jpgSrcSet: string;
    jpg: string;
    alt: string;
  };
  palette: readonly FilmPalette[];
  keywords: readonly string[];
  process: readonly DirectorStage[];
  provenance: {
    model: string;
    version: string;
    seed: string;
    ratio: '2:3';
    iterations: number;
    humanEdits: readonly string[];
  };
}

const widths = [480, 800, 1200, 1600] as const;

function posterAsset(slug: string, alt: string): Film['poster'] {
  return {
    avifSrcSet: widths
      .map((width) => sitePath(`/posters/${slug}-${width}.avif`) + ` ${width}w`)
      .join(', '),
    webpSrcSet: widths
      .map((width) => sitePath(`/posters/${slug}-${width}.webp`) + ` ${width}w`)
      .join(', '),
    jpgSrcSet: widths
      .map((width) => sitePath(`/posters/${slug}-${width}.jpg`) + ` ${width}w`)
      .join(', '),
    jpg: sitePath(`/posters/${slug}-1200.jpg`),
    alt,
  };
}

function process(
  inspiration: readonly string[],
  analysis: readonly string[],
  prompt: readonly string[],
  generation: readonly string[],
  artDirection: readonly string[],
): readonly DirectorStage[] {
  return [
    {
      kind: 'inspiration',
      title: 'Inspiration',
      summary: 'The visual references that established the world before generation.',
      details: inspiration,
    },
    {
      kind: 'analysis',
      title: 'Visual Analysis',
      summary: 'A deliberate hierarchy of focus, shadow, scale and title-safe space.',
      details: analysis,
    },
    {
      kind: 'prompt',
      title: 'Prompt',
      summary: 'The production brief translated into six controllable visual clauses.',
      details: prompt,
    },
    {
      kind: 'generation',
      title: 'Generation',
      summary: 'Four iterations were compared for composition, restraint and material truth.',
      details: generation,
    },
    {
      kind: 'art-direction',
      title: 'Final Art Direction',
      summary: 'Human decisions complete the image after the model stops.',
      details: artDirection,
    },
  ];
}

const sharedProvenance = {
  model: 'Aura Diffusion XL',
  version: '2.6',
  ratio: '2:3' as const,
  iterations: 4,
};

export const films = [
  {
    archiveId: 'AF–001',
    slug: 'afterlight',
    title: 'AFTERLIGHT',
    year: 2026,
    genre: 'Solar noir',
    runtime: '112 MIN',
    tagline: 'THE SUN DISAPPEARED. ITS MEMORY DID NOT.',
    concept:
      'The last sunrise is stored beneath a city that has forgotten daylight. Each screening restores one hour of warmth while erasing a memory from the archivist assigned to protect it.',
    poster: posterAsset(
      'afterlight',
      'A solitary figure faces an eclipsed amber sun above a monumental black structure.',
    ),
    palette: [
      { name: 'Void', hex: '#050505', use: 'Architectural shadow' },
      { name: 'Amber', hex: '#C98A43', use: 'Stored sunlight' },
      { name: 'Ash', hex: '#8B8173', use: 'Atmospheric depth' },
      { name: 'Bone', hex: '#E8DDCB', use: 'Figure edge light' },
      { name: 'Ember', hex: '#6A2E1C', use: 'Solar residue' },
    ],
    keywords: ['eclipse', 'monument', 'memory', 'amber light', 'negative space', 'solar noir'],
    process: process(
      ['1960s eclipse photography', 'Brutalist memorials', 'Tungsten-lit 35mm interiors'],
      ['Sun positioned above optical center', 'Figure held below title-safe zone', 'Black mass occupies sixty percent of frame'],
      ['Subject: lone archive keeper', 'Composition: monumental low angle', 'Light: eclipsed 3400K corona', 'Lens: restrained anamorphic bloom', 'Material: volcanic stone and dust', 'Negative: no typography, no neon, no interface graphics'],
      ['V1 rejected: corona too decorative', 'V2 rejected: figure too heroic', 'V3 retained: quiet scale and clear silhouette', 'V4 selected: stronger black geometry'],
      ['Rebuilt title-safe negative space', 'Reduced orange saturation', 'Painted cleaner rim light around the figure'],
    ),
    provenance: {
      ...sharedProvenance,
      seed: 'AF001-73921',
      humanEdits: ['Typography', 'Mask cleanup', 'Selective color', 'Atmospheric compositing'],
    },
  },
  {
    archiveId: 'AF–002',
    slug: 'mother-of-static',
    title: 'MOTHER OF STATIC',
    year: 2026,
    genre: 'Biopunk',
    runtime: '104 MIN',
    tagline: 'EVERY SIGNAL REMEMBERS WHO MADE IT.',
    concept:
      'A maintenance engineer discovers that a decommissioned broadcast array has grown a nervous system and is transmitting the lullaby of the woman who designed it decades earlier.',
    poster: posterAsset(
      'mother-of-static',
      'A maternal machine emerges from wet brushed metal and a veil of analog signal noise.',
    ),
    palette: [
      { name: 'Machine Black', hex: '#070808', use: 'Chassis and void' },
      { name: 'Mercury', hex: '#B9B8B3', use: 'Wet metal' },
      { name: 'Signal Green', hex: '#6F806D', use: 'Living circuitry' },
      { name: 'Flesh Rose', hex: '#9B625B', use: 'Biological trace' },
      { name: 'Oxide', hex: '#644438', use: 'Age and corrosion' },
    ],
    keywords: ['maternal machine', 'analog noise', 'wet metal', 'bio-circuitry', 'broadcast tower'],
    process: process(
      ['Early broadcast hardware', 'Macro photographs of mycelium', 'Clinical maternity portrait lighting'],
      ['Face suggested through hardware, never literal', 'Signal haze contains the brightest values', 'Lower third preserved for archive typography'],
      ['Subject: nurturing transmission organism', 'Composition: frontal icon at human scale', 'Light: damp silver edge light', 'Lens: macro texture with shallow haze', 'Material: wet brushed steel and living cable', 'Negative: no robot eyes, no cyberpunk neon, no text'],
      ['V1 rejected: conventional humanoid robot', 'V2 rejected: biology became grotesque', 'V3 retained: ambiguous maternal silhouette', 'V4 selected: quieter signal field'],
      ['Removed synthetic eye highlights', 'Integrated cable roots by hand', 'Compressed green into a single focal trace'],
    ),
    provenance: {
      ...sharedProvenance,
      seed: 'AF002-41008',
      humanEdits: ['Compositing', 'Cable retouching', 'Grain matching', 'Typography'],
    },
  },
  {
    archiveId: 'AF–003',
    slug: 'orbital-nocturne',
    title: 'ORBITAL NOCTURNE',
    year: 2026,
    genre: 'Cosmic romance',
    runtime: '126 MIN',
    tagline: 'THEY MEET ONCE EVERY NINETY-SEVEN YEARS.',
    concept:
      'Two cartographers orbit the same dead moon in opposite directions. Their vessels align for eleven minutes, forcing an entire relationship to exist between recurring eclipses.',
    poster: posterAsset(
      'orbital-nocturne',
      'Two distant human figures are separated by a midnight-blue orbital arc around a dark moon.',
    ),
    palette: [
      { name: 'Deep Orbit', hex: '#07101A', use: 'Space field' },
      { name: 'Cobalt', hex: '#263D5A', use: 'Orbital trace' },
      { name: 'Moon Silver', hex: '#AAB0B5', use: 'Lunar edge' },
      { name: 'Signal Ivory', hex: '#E7E0D6', use: 'Figures' },
      { name: 'Distant Gold', hex: '#AC8C59', use: 'Meeting point' },
    ],
    keywords: ['orbital arc', 'distance', 'blue hour', 'dual figure', 'lunar silence', 'romance'],
    process: process(
      ['Long-exposure astronomical plates', 'Minimalist opera staging', 'Maritime navigation charts'],
      ['Two figures balance across the diagonal', 'Orbit line acts as narrative clock', 'Gold appears only at the point of encounter'],
      ['Subject: two separated lunar cartographers', 'Composition: opposing figures and one orbit', 'Light: midnight blue with a warm coordinate', 'Lens: deep focus, no star bloom', 'Material: matte lunar dust and thin glass', 'Negative: no spacecraft spectacle, no neon, no text'],
      ['V1 rejected: crowded star field', 'V2 rejected: figures too close', 'V3 retained: readable orbit geometry', 'V4 selected: smallest human scale'],
      ['Removed secondary stars', 'Redrew orbit line', 'Separated silhouettes for clearer longing'],
    ),
    provenance: {
      ...sharedProvenance,
      seed: 'AF003-99842',
      humanEdits: ['Orbit redraw', 'Silhouette cleanup', 'Color separation', 'Typography'],
    },
  },
  {
    archiveId: 'AF–004',
    slug: 'glass-tide',
    title: 'GLASS TIDE',
    year: 2026,
    genre: 'Oceanic surrealism',
    runtime: '98 MIN',
    tagline: 'THE OCEAN LEARNED TO HOLD ITS SHAPE.',
    concept:
      'A coastal architect wakes to find the sea frozen into transparent rooms. Inside each chamber, a different version of her life continues beneath the pressure of the tide.',
    poster: posterAsset(
      'glass-tide',
      'A refracted body stands inside transparent tidal architecture above a silver ocean.',
    ),
    palette: [
      { name: 'Abyss', hex: '#081012', use: 'Deep water' },
      { name: 'Glass', hex: '#B9C5C5', use: 'Transparent structure' },
      { name: 'Sea Silver', hex: '#7F9295', use: 'Ocean surface' },
      { name: 'Skin Light', hex: '#D6B5A5', use: 'Human refraction' },
      { name: 'Cold Mist', hex: '#DCE3DF', use: 'Atmospheric lift' },
    ],
    keywords: ['refraction', 'glass architecture', 'silver sea', 'body', 'pressure', 'surrealism'],
    process: process(
      ['Aquarium refraction studies', 'Modernist coastal houses', 'Underwater dance stills'],
      ['Body is fragmented but recognizable', 'Horizon remains perfectly level', 'Transparent volume creates the title-safe zone'],
      ['Subject: architect inside solid tide', 'Composition: vertical body within glass chamber', 'Light: silver overcast caustics', 'Lens: long focal compression', 'Material: water behaving as architectural glass', 'Negative: no fantasy palace, no blue neon, no text'],
      ['V1 rejected: glass looked synthetic', 'V2 rejected: body distortion unreadable', 'V3 retained: natural water weight', 'V4 selected: cleaner horizon'],
      ['Painted physically plausible caustics', 'Reduced cyan cast', 'Aligned horizon and chamber geometry'],
    ),
    provenance: {
      ...sharedProvenance,
      seed: 'AF004-22317',
      humanEdits: ['Refraction paint', 'Horizon cleanup', 'Tone curve', 'Typography'],
    },
  },
  {
    archiveId: 'AF–005',
    slug: 'the-last-bloom',
    title: 'THE LAST BLOOM',
    year: 2026,
    genre: 'Eco science fiction',
    runtime: '118 MIN',
    tagline: 'ONE FLOWER CARRIES THE WEATHER OF A WORLD.',
    concept:
      'The final flowering plant is sealed inside a climate laboratory. When it begins producing snow, its caretaker must choose between preserving the specimen and releasing its impossible season.',
    poster: posterAsset(
      'the-last-bloom',
      'A black botanical specimen releases pale spores inside a sealed laboratory greenhouse.',
    ),
    palette: [
      { name: 'Botanical Black', hex: '#050706', use: 'Plant silhouette' },
      { name: 'Spore Ivory', hex: '#E4E0D1', use: 'Airborne spores' },
      { name: 'Lab Green', hex: '#697466', use: 'Glass reflections' },
      { name: 'Stem Bronze', hex: '#806449', use: 'Living structure' },
      { name: 'Cold White', hex: '#C9D0CE', use: 'Artificial weather' },
    ],
    keywords: ['black flower', 'spores', 'greenhouse', 'specimen', 'artificial weather', 'ecology'],
    process: process(
      ['Victorian botanical plates', 'Seed-vault interiors', 'Black iris macro photography'],
      ['Bloom centered like a scientific specimen', 'Spores form a quiet weather system', 'Laboratory grid remains almost invisible'],
      ['Subject: last flowering organism', 'Composition: singular botanical icon', 'Light: sterile overhead with bronze stem', 'Lens: large-format botanical clarity', 'Material: matte petal, sealed glass, suspended spore', 'Negative: no lush jungle, no fantasy glow, no text'],
      ['V1 rejected: conventional green plant', 'V2 rejected: spore cloud too explosive', 'V3 retained: black petal silhouette', 'V4 selected: clinical enclosure'],
      ['Separated individual spores', 'Darkened greenhouse grid', 'Rebuilt petal edges for print clarity'],
    ),
    provenance: {
      ...sharedProvenance,
      seed: 'AF005-66531',
      humanEdits: ['Petal masking', 'Spore compositing', 'Glass cleanup', 'Typography'],
    },
  },
  {
    archiveId: 'AF–006',
    slug: 'a-memory-of-rain',
    title: 'A MEMORY OF RAIN',
    year: 2026,
    genre: 'Neo-noir',
    runtime: '109 MIN',
    tagline: 'THE CITY FORGETS EVERYTHING EXCEPT THE WEATHER.',
    concept:
      'A detective who can only remember events during rainfall follows a red car through a dry city, waiting for the storm that will reveal why he has been following himself.',
    poster: posterAsset(
      'a-memory-of-rain',
      'A solitary profile watches red tail lights dissolve through rain on a black city street.',
    ),
    palette: [
      { name: 'Rain Black', hex: '#050607', use: 'City night' },
      { name: 'Tail Light', hex: '#A13D32', use: 'Narrative focal point' },
      { name: 'Wet Asphalt', hex: '#495157', use: 'Street reflection' },
      { name: 'Sodium', hex: '#A77A4D', use: 'Distant lamps' },
      { name: 'Fog Grey', hex: '#A9ADAA', use: 'Profile edge' },
    ],
    keywords: ['night rain', 'red tail lights', 'profile', 'wet asphalt', 'memory', 'neo-noir'],
    process: process(
      ['1970s street photography', 'Rain on rear projection', 'Minimal neo-noir one-sheets'],
      ['Red appears in one compact region', 'Profile reads through reflected light', 'Street perspective pulls toward the disappearing car'],
      ['Subject: detective watching his own car', 'Composition: profile against receding street', 'Light: red tail light and sodium mist', 'Lens: rain-streaked anamorphic glass', 'Material: wet asphalt and fogged window', 'Negative: no gun, no neon signs, no text'],
      ['V1 rejected: too much city detail', 'V2 rejected: obvious detective costume', 'V3 retained: anonymous profile', 'V4 selected: single red vanishing point'],
      ['Removed signage', 'Repainted rain streak direction', 'Compressed red reflections'],
    ),
    provenance: {
      ...sharedProvenance,
      seed: 'AF006-18405',
      humanEdits: ['Rain paint', 'Sign removal', 'Red isolation', 'Typography'],
    },
  },
  {
    archiveId: 'AF–007',
    slug: 'echoes-from-ix',
    title: 'ECHOES FROM IX',
    year: 2026,
    genre: 'Brutalist epic',
    runtime: '134 MIN',
    tagline: 'THE BUILDING ANSWERED BEFORE THEY CALLED.',
    concept:
      'An archaeological team enters a structure older than the planet beneath it. Every room repeats a question the explorers have not yet asked, leading them toward the voice that designed their arrival.',
    poster: posterAsset(
      'echoes-from-ix',
      'A tiny explorer stands before a brutalist megastructure disappearing into desert dust.',
    ),
    palette: [
      { name: 'Concrete', hex: '#77736B', use: 'Megastructure' },
      { name: 'Dust', hex: '#AA9270', use: 'Atmosphere' },
      { name: 'Chasm', hex: '#070707', use: 'Architectural void' },
      { name: 'Signal Gold', hex: '#C0A060', use: 'Ancient transmission' },
      { name: 'Suit White', hex: '#D8D4C9', use: 'Human scale' },
    ],
    keywords: ['megastructure', 'brutalism', 'dust', 'tiny explorer', 'ancient signal', 'scale'],
    process: process(
      ['Desert observatories', 'Late modern concrete infrastructure', 'Archaeological survey photography'],
      ['Human figure occupies less than one percent', 'Signal slit establishes a vertical path', 'Dust removes the structure boundary'],
      ['Subject: explorer before impossible ruin', 'Composition: extreme architectural scale', 'Light: dry overcast with one gold signal', 'Lens: survey-camera perspective', 'Material: weathered concrete and mineral dust', 'Negative: no spaceship, no glowing runes, no text'],
      ['V1 rejected: decorative sci-fi panels', 'V2 rejected: warm heroic sunset', 'V3 retained: severe concrete plane', 'V4 selected: deeper dust occlusion'],
      ['Removed panel seams', 'Reduced sky contrast', 'Added small suit highlight for scale'],
    ),
    provenance: {
      ...sharedProvenance,
      seed: 'AF007-85220',
      humanEdits: ['Structure cleanup', 'Dust compositing', 'Scale figure paint', 'Typography'],
    },
  },
  {
    archiveId: 'AF–008',
    slug: 'sleepwalker-2084',
    title: 'SLEEPWALKER 2084',
    year: 2026,
    genre: 'Dream dystopia',
    runtime: '101 MIN',
    tagline: 'SLEEP IS THE LAST UNLICENSED COUNTRY.',
    concept:
      'In a city where dreams are regulated, a technician finds her sleeping body walking through restricted memories while her waking self remains trapped inside a white clinical chamber.',
    poster: posterAsset(
      'sleepwalker-2084',
      'A weightless human figure floats inside a cold white sleep chamber surrounded by black space.',
    ),
    palette: [
      { name: 'Clinical White', hex: '#E3E5E1', use: 'Sleep chamber' },
      { name: 'Dream Black', hex: '#050505', use: 'Surrounding void' },
      { name: 'Monitor Grey', hex: '#8E9695', use: 'Equipment detail' },
      { name: 'Pulse Blue', hex: '#657C87', use: 'Restricted signal' },
      { name: 'Skin', hex: '#C8A99A', use: 'Human presence' },
    ],
    keywords: ['sleep chamber', 'weightless body', 'clinical white', 'dream control', 'void', 'dystopia'],
    process: process(
      ['Sleep-clinic photography', 'Zero-gravity body studies', 'International Style interiors'],
      ['White chamber acts as a frame within frame', 'Body remains anatomically calm', 'Black surround makes the room feel confiscated'],
      ['Subject: unconscious technician in zero gravity', 'Composition: white room suspended in black', 'Light: clinical top light without glow', 'Lens: orthographic surveillance distance', 'Material: enamel, linen and smoked glass', 'Negative: no holograms, no cyberpunk city, no text'],
      ['V1 rejected: dramatic floating pose', 'V2 rejected: excessive medical equipment', 'V3 retained: quiet chamber geometry', 'V4 selected: smallest pulse-blue trace'],
      ['Corrected hand anatomy', 'Removed interface marks', 'Balanced white point against skin'],
    ),
    provenance: {
      ...sharedProvenance,
      seed: 'AF008-30714',
      humanEdits: ['Anatomy retouching', 'Interface removal', 'White balance', 'Typography'],
    },
  },
] as const satisfies readonly Film[];

export function getFilmBySlug(slug: string): Film | undefined {
  return films.find((film) => film.slug === slug);
}
import { sitePath } from '../lib/sitePath';
