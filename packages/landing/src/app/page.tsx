import type { Metadata, NextPage } from 'next';
import type { FC } from 'react';
import CTA from '@/components/molecules/CTA';
import Features, { type Feature } from '@/components/molecules/Features';
import Hero from '@/components/molecules/Hero';
import SectionHead from '@/components/molecules/SectionHead';
import Terminal from '@/components/molecules/Terminal';
import {
  LuClock,
  LuCode,
  LuGlobe,
  LuMonitor,
  LuPalette,
  LuPlay,
} from 'react-icons/lu';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const GITHUB = 'https://github.com/hieudoanm/fr55';
const VSIX = `${GITHUB}/releases/download/latest/monkey-c.vsix`;

const FEATURES: Feature[] = [
  {
    icon: LuCode,
    title: 'Language support',
    body: 'Highlighting and editor configuration for .mc, .mb, .mcgen, and .jungle files.',
  },
  {
    icon: LuPalette,
    title: 'Formatting & theme',
    body: 'Built-in document formatter for Monkey C and Jungle, plus a dark color theme and file icons.',
  },
  {
    icon: LuPlay,
    title: 'Simulator preview',
    body: 'Builds the nearest Connect IQ package with your local SDK and developer key, then launches it in the simulator.',
  },
  {
    icon: LuMonitor,
    title: 'VS Code extension',
    body: 'Packaged as a .vsix from the rolling latest release. Install with the VS Code CLI or the Extensions view.',
  },
  {
    icon: LuGlobe,
    title: 'Zed extension',
    body: 'Loaded as a dev extension from source: Tree-sitter highlighting, external formatter, runtime-preview tasks, and the Monkey C theme and icons.',
  },
  {
    icon: LuClock,
    title: 'Watchfaces included',
    body: 'Four Connect IQ watchfaces for the Forerunner 55 ship in apps/ — hands, minimalism, maximalism, and timezones.',
  },
];

const HERO_LINES = [
  '$ code --install-extension monkey-c.vsix',
  "Extension 'monkey-c' was successfully installed.",
  '$ monkey-c-format source/HandsView.mc',
  'formatted HandsView.mc',
];

const DEMO_TERMINALS: { caption: string; lines: string[]; wide?: boolean }[] = [
  {
    caption: 'Install the VS Code extension',
    wide: true,
    lines: [
      '$ code --install-extension monkey-c.vsix',
      "Extension 'monkey-c' was successfully installed.",
    ],
  },
  {
    caption: 'Format a Monkey C file',
    lines: ['$ monkey-c-format source/HandsView.mc', 'formatted HandsView.mc'],
  },
  {
    caption: 'Build a watchface PRG',
    lines: ['$ cd apps/hands && make build DEVICE=fr55', 'Built bin/hands.prg'],
  },
];

const STEPS = [
  {
    title: 'Install the extension',
    body: 'Download the .vsix for VS Code, or load packages/extensions/zed as a dev extension in Zed.',
    snippet: 'monkey-c.vsix → Extensions',
  },
  {
    title: 'Configure helpers',
    body: 'Run the install script to symlink monkey-c-format and monkey-c-preview into ~/.local/bin so formatters and tasks find them.',
    snippet: './scripts/install.sh',
  },
  {
    title: 'Preview in the simulator',
    body: 'Open task: spawn and choose Monkey C: Runtime Preview or Build PRG — the extension builds the package with your SDK and launches the simulator.',
    snippet: 'task: Monkey C: Runtime Preview',
  },
];

const INSTALL_LINES = [
  '$ curl -fsSLO https://github.com/hieudoanm/fr55/releases/download/latest/monkey-c.vsix',
  '$ code --install-extension monkey-c.vsix',
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
      title="Monkey C & Jungle for Connect IQ watchfaces."
      description="Syntax highlighting, document formatting, a dark theme, file icons, and local SDK simulator preview for .mc and .jungle — in VS Code and Zed, targeting the Forerunner 55."
      primary={{ label: 'Download', href: '#install' }}
      secondary={{ label: 'See it in action', href: '#demo' }}
      stats={[
        { value: '2', label: 'editors' },
        { value: '4', label: 'watchfaces bundled' },
        { value: '1', label: 'vsix to install' },
      ]}>
      <Terminal lines={HERO_LINES} />
    </Hero>

    <Features
      title="Editor support for Monkey C"
      description="Everything needed to write Connect IQ apps without leaving your editor."
      features={FEATURES}
    />

    <section id="demo" className="bg-base-200 py-20">
      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHead
          title="See it in action"
          description="Install the extension, then format, preview, and build a watchface."
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

    <section id="how-it-works" className="py-20">
      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHead
          title="How it works"
          description="From download to simulator in three steps."
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
          title="Get the latest VSIX"
          description="Rolling latest release built from this repository — the VS Code extension package. Zed extensions load from source; there is no .vsix to download."
        />
        <Terminal lines={INSTALL_LINES} />
        <p className="text-base-content/60 mt-6 text-center text-sm">
          For Zed: open the Extensions page, choose{' '}
          <em>Install Dev Extension</em>, and select packages/extensions/zed —
          see the{' '}
          <a
            href={`${GITHUB}#readme`}
            target="_blank"
            rel="noreferrer"
            className="text-primary font-semibold">
            README
          </a>{' '}
          for the full setup.
        </p>
      </div>
    </section>

    <CTA
      title="Ready to build watchfaces?"
      description="Download the VS Code extension or load the Zed extension from source."
      primary={{ label: 'Download monkey-c.vsix', href: VSIX, external: true }}
      secondary={{ label: 'View on GitHub', href: GITHUB, external: true }}
    />
  </main>
);

export default HomePage;
