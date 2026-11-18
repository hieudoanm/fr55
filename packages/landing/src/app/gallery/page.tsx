import type { Metadata } from 'next';
import type { FC } from 'react';
import SectionHead from '@/components/molecules/SectionHead';

export const metadata: Metadata = {
  title: 'Watchface Gallery',
  description:
    'Watchface design previews for the Forerunner 55 — analog, minimal, maximal, world clock, chronograph, progress rings, binary, and dot-matrix concepts.',
  alternates: { canonical: '/gallery/' },
  openGraph: {
    title: 'Watchface Gallery — FR55',
    description:
      '16 watchface design previews for the Garmin Forerunner 55 — analog, minimal, maximal, world clock, chronograph, progress rings, binary, and dot-matrix concepts.',
    url: 'https://hieudoanm.github.io/fr55/gallery/',
    images: ['/og.png'],
  },
};

const WATCHFACE_BASE =
  process.env.NODE_ENV === 'production' ? '/fr55/watchfaces' : '/watchfaces';

const RELEASE_BASE =
  'https://github.com/hieudoanm/fr55/releases/download/latest';

interface Watchface {
  name: string;
  slug: string;
  description: string;
  file: string;
}

const WATCHFACES: Watchface[] = [
  {
    name: 'Hands',
    description:
      'Pure analog — red hour and minute hands on black, no numerals or text.',
    slug: 'hands',
    file: 'hands.svg',
  },
  {
    name: 'Minimalism',
    description:
      'Hour and minute dots on an invisible ring with centered heart rate or time.',
    slug: 'minimalism',
    file: 'minimalism.svg',
  },
  {
    name: 'Maximalism',
    description:
      '12-dot hour ring with the current hour highlighted, minute marker, and status text.',
    slug: 'maximalism',
    file: 'maximalism.svg',
  },
  {
    name: 'TimeZones',
    description:
      'Three stacked world-clock rows — London, local, and Melbourne.',
    slug: 'timezones',
    file: 'timezones.svg',
  },
  {
    name: 'Chronograph',
    description:
      'Full 60-tick minute track with bold hour markers and a sweeping second hand.',
    slug: 'chronograph',
    file: 'chronograph.svg',
  },
  {
    name: 'Rings',
    description:
      'Concentric progress arcs for hours, minutes, and seconds around a digital readout.',
    slug: 'rings',
    file: 'rings.svg',
  },
  {
    name: 'Binary',
    description:
      'Hour and minute rendered as binary dot rows — a nerdy BCD-style display.',
    slug: 'binary',
    file: 'binary.svg',
  },
  {
    name: 'DotMatrix',
    description: 'Classic 3×5 dot-matrix digits spelling out the time.',
    slug: 'dotmatrix',
    file: 'dotmatrix.svg',
  },
  {
    name: 'Roman',
    description:
      'Roman numerals at the cardinal points with classic analog hands.',
    slug: 'roman',
    file: 'roman.svg',
  },
  {
    name: 'Pie',
    description:
      'Twelve pie sectors for the hours — the current hour filled red.',
    slug: 'pie',
    file: 'pie.svg',
  },
  {
    name: 'ECG',
    description:
      'Heartbeat pulse trace with the time up top — pairs with heart-rate apps.',
    slug: 'ecg',
    file: 'ecg.svg',
  },
  {
    name: 'Barcode',
    description:
      'Hour and minute encoded as vertical bar patterns, sci-fi style.',
    slug: 'barcode',
    file: 'barcode.svg',
  },
  {
    name: 'Spiral',
    description:
      'Golden-angle dot spiral with the latest dots marking the time.',
    slug: 'spiral',
    file: 'spiral.svg',
  },
  {
    name: 'Split',
    description: 'Mini analog dial on top, big digital readout below.',
    slug: 'split',
    file: 'split.svg',
  },
  {
    name: 'Compass',
    description:
      'Cardinal N/E/S/W markers with a red needle for the minute hand.',
    slug: 'compass',
    file: 'compass.svg',
  },
  {
    name: 'Moon',
    description: 'Waxing moon phase over a starfield with the time underneath.',
    slug: 'moon',
    file: 'moon.svg',
  },
];

const WatchfaceCard: FC<{ watchface: Watchface }> = ({ watchface }) => (
  <article className="card border-base-300 bg-base-100 rounded-2xl border p-5">
    <div className="bg-base-200 mx-auto mb-4 flex aspect-square w-full max-w-56 items-center justify-center overflow-hidden rounded-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${WATCHFACE_BASE}/${watchface.file}`}
        alt={`${watchface.name} watchface preview`}
        className="h-full w-full object-cover"
      />
    </div>
    <h2 className="text-base-content m-0 mb-1 text-lg font-bold">
      {watchface.name}
    </h2>
    <p className="text-base-content/60 m-0 text-sm">{watchface.description}</p>
    <a
      href={`${RELEASE_BASE}/fr55-${watchface.slug}.prg`}
      className="btn btn-outline btn-sm mt-4"
      download>
      Download .prg
    </a>
  </article>
);

const GalleryPage: FC = () => (
  <main>
    <h1 className="sr-only">Watchface gallery for the Garmin Forerunner 55</h1>
    <section className="py-20">
      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHead
          title="Watchface gallery"
          description="Design previews for the Forerunner 55 — black MIP faces with red accents, 240×240 circular displays. All 16 ship as buildable apps; download the compiled .prg for each."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WATCHFACES.map((watchface) => (
            <WatchfaceCard key={watchface.name} watchface={watchface} />
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default GalleryPage;
