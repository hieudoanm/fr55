import CTA from '@/components/molecules/CTA';
import Features, { type Feature } from '@/components/molecules/Features';
import Hero from '@/components/molecules/Hero';
import SectionHead from '@/components/molecules/SectionHead';
import Terminal from '@/components/molecules/Terminal';
import Link from 'next/link';
import type { Metadata, NextPage } from 'next';
import type { FC } from 'react';
import {
  LuBookOpen,
  LuGlobe,
  LuHeartPulse,
  LuImages,
  LuWatch,
} from 'react-icons/lu';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const GITHUB = 'https://github.com/hieudoanm/fr55';

const FEATURES: Feature[] = [
  {
    icon: LuWatch,
    title: '16 watchfaces',
    body: 'hands, rings, dotmatrix, compass, and more — each a self-contained Connect IQ app under apps/ that builds independently.',
  },
  {
    icon: LuImages,
    title: 'Design previews',
    body: 'Every app ships with an SVG/PNG design preview — analog, minimal, world clock, chronograph, rings, binary, dot-matrix, and more.',
  },
  {
    icon: LuGlobe,
    title: 'World clock',
    body: 'The timezones face stacks London, your local time, and Melbourne at a glance.',
  },
  {
    icon: LuHeartPulse,
    title: 'Health at a glance',
    body: 'Minimalism and maximalism surface heart rate, battery, and the time in clean monochrome layouts.',
  },
  {
    icon: LuBookOpen,
    title: 'Docs included',
    body: 'Getting-started, Connect IQ concepts, and per-app guides — readable right here on the site.',
  },
  {
    icon: LuWatch,
    title: 'Forerunner 55 first',
    body: 'Targeted at the fr55 240×240 MIP display, with resolution-aware drawing for other Connect IQ devices.',
  },
];

const HERO_LINES = [
  '$ cd apps/hands && make build DEVICE=fr55',
  'Built bin/hands.prg',
  '$ monkeydo bin/hands.prg fr55',
  'Simulator running — hands watchface active',
];

const DEMO_TERMINALS: { caption: string; lines: string[]; wide?: boolean }[] = [
  {
    caption: 'Build a watchface PRG',
    wide: true,
    lines: ['$ cd apps/hands && make build DEVICE=fr55', 'Built bin/hands.prg'],
  },
  {
    caption: 'Direct SDK commands',
    lines: [
      '$ monkeyc -f apps/hands/monkey.jungle -d fr55 -o apps/hands/bin/hands.prg -y developer_key.der -w',
      'Built hands.prg',
    ],
  },
  {
    caption: 'Preview in the simulator',
    lines: ['$ monkeydo apps/hands/bin/hands.prg fr55', 'Simulator running'],
  },
];

const STEPS = [
  {
    title: 'Clone the repo',
    body: 'Each watchface lives in its own directory under apps/ with a Makefile, manifest, and Monkey C sources.',
    snippet: 'git clone https://github.com/hieudoanm/fr55.git',
  },
  {
    title: 'Build with the SDK',
    body: 'Point make at your Connect IQ SDK and developer key — no other dependencies.',
    snippet: 'make build DEVICE=fr55 SDK=… DEVELOPER_KEY=…',
  },
  {
    title: 'Install on the watch',
    body: 'Copy the .prg to GARMIN/APPS over USB, or launch it in the simulator with monkeydo.',
    snippet: 'cp bin/hands.prg /Volumes/GARMIN/APPS/',
  },
];

const INSTALL_LINES = [
  '$ cd apps/hands',
  '$ make build DEVICE=fr55 \\',
  '    SDK="$HOME/Library/Application Support/Garmin/ConnectIQ/Sdks/<sdk>" \\',
  '    DEVELOPER_KEY="$HOME/.config/garmin/developer_key"',
  'Built bin/hands.prg',
];

const StepCard: FC<{ step: (typeof STEPS)[number]; index: number }> = ({
  step,
  index,
}) => (
  <article className="card border-base-300 bg-base-100 rounded-2xl border p-6">
    <span className="text-accent mb-2 block font-mono text-sm font-semibold">
      {String(index + 1).padStart(2, '0')}
    </span>
    <h3 className="text-base-content m-0 mb-2 text-lg font-bold">
      {step.title}
    </h3>
    <p className="text-base-content/60 text-sm">{step.body}</p>
    <code className="border-base-300 bg-base-200 text-base-content/60 mt-4 block overflow-x-auto rounded-lg border px-3 py-0.5 font-mono text-xs">
      {step.snippet}
    </code>
  </article>
);

const HomePage: NextPage = () => (
  <main>
    <Hero
      title="Connect IQ watchfaces for the Garmin Forerunner 55."
      description="Sixteen buildable Monkey C watchfaces — hands, rings, dotmatrix, compass, and more — all targeting the fr55 240×240 MIP display."
      primary={{ label: 'Browse the gallery', href: '/gallery/' }}
      secondary={{ label: 'Build an app', href: '#build' }}
      stats={[
        { value: '16', label: 'watchface apps' },
        { value: '16', label: 'design previews' },
        { value: '240×240', label: 'MIP display' },
      ]}>
      <Terminal lines={HERO_LINES} />
    </Hero>

    <Features
      title="Watchfaces, not widgets"
      description="Purpose-built faces for the Forerunner 55 — glanceable time, health, and world clock in clean monochrome."
      features={FEATURES}
    />

    <section id="demo" className="bg-base-200 py-20">
      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHead
          title="See it in action"
          description="Build a .prg with the Connect IQ SDK, then preview it in the simulator."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {DEMO_TERMINALS.map((t) => (
            <Terminal
              key={t.caption}
              lines={t.lines}
              className={t.wide ? 'lg:col-span-2' : ''}
            />
          ))}
        </div>
      </div>
    </section>

    <section id="build" className="py-20">
      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHead
          title="Build and install"
          description="From clone to wrist in three steps."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>

    <section id="install" className="bg-base-200 py-20">
      <div className="mx-auto w-full max-w-3xl px-5">
        <SectionHead
          title="Build from source"
          description="There are no prebuilt binaries — each app compiles to a .prg with your own Connect IQ SDK and developer key."
        />
        <Terminal lines={INSTALL_LINES} />
        <p className="text-base-content/60 mt-6 text-center text-sm">
          Full walkthrough in the{' '}
          <Link
            href="/docs/getting-started/build-and-preview/"
            className="text-primary font-semibold">
            build and preview guide
          </Link>{' '}
          — or browse the{' '}
          <a
            href={`${GITHUB}`}
            target="_blank"
            rel="noreferrer"
            className="text-primary font-semibold">
            repository
          </a>
          .
        </p>
      </div>
    </section>

    <CTA
      title="Ready for a new face?"
      description="Pick a design from the gallery, or build any of the 16 apps yourself."
      primary={{ label: 'Open the gallery', href: '/gallery/' }}
      secondary={{ label: 'View on GitHub', href: GITHUB, external: true }}
    />
  </main>
);

export default HomePage;
