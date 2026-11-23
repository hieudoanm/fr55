import type { Metadata } from 'next';
import Link from 'next/link';
import type { FC } from 'react';
import { FaDownload } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Downloads',
  description:
    'Download compiled .prg watchfaces for the Garmin Forerunner 55 and sideload them onto your watch.',
  alternates: { canonical: '/downloads/' },
};

const RELEASES = 'https://github.com/hieudoanm/fr55/releases/latest/download';
const RELEASE_PAGE = 'https://github.com/hieudoanm/fr55/releases/latest';

const WATCHFACES = [
  'barcode',
  'binary',
  'chronograph',
  'compass',
  'dotmatrix',
  'ecg',
  'hands',
  'maximalism',
  'minimalism',
  'moon',
  'pie',
  'rings',
  'roman',
  'spiral',
  'split',
  'timezones',
];

const Downloads: FC = () => (
  <main>
    <section className="py-20">
      <div className="mx-auto w-full max-w-6xl px-5">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="m-0 text-4xl leading-tight tracking-normal text-balance">
            Download watchfaces
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Compiled <code>.prg</code> binaries for the Garmin Forerunner 55,
            built by CI on every push to master. See the{' '}
            <Link href="/gallery/" className="text-primary">
              gallery
            </Link>{' '}
            for previews, or the{' '}
            <a href={RELEASE_PAGE} className="text-primary">
              latest release
            </a>{' '}
            for all assets.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {WATCHFACES.map((slug) => (
            <a
              key={slug}
              href={`${RELEASES}/fr55-${slug}.prg`}
              download
              className="card border-base-300 bg-base-100 hover:border-primary flex items-center justify-between gap-2 border p-4 transition-colors">
              <span className="text-base-content text-sm font-semibold">
                {slug}
              </span>
              <FaDownload className="text-primary h-4 w-4 shrink-0" />
            </a>
          ))}
        </div>

        <div className="border-base-300 bg-base-200/50 rounded-2xl border p-6">
          <h2 className="text-base-content m-0 mb-2 text-lg leading-tight">
            Install on your watch
          </h2>
          <p className="text-base-content/60 mb-4 text-sm">
            Connect the Forerunner 55 over USB and copy the <code>.prg</code>{' '}
            file into the <code>GARMIN/APPS</code> folder, then eject safely:
          </p>
          <pre className="bg-base-300 overflow-x-auto rounded-lg p-4 font-mono text-sm">
            <code>{`cp fr55-hands.prg /Volumes/GARMIN/APPS/
# safely eject, then pick the watchface in watch settings`}</code>
          </pre>
          <p className="text-base-content/60 mt-4 text-sm">
            These builds are signed with an ephemeral CI key — fine for
            sideloading, but they cannot go to the Connect IQ store. To build
            your own, see the{' '}
            <Link href="/docs/" className="text-primary">
              build docs
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  </main>
);

export default Downloads;
