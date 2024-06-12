import { spawn } from 'node:child_process';

/**
 * Get latest GitHub release from ordinals/ord
 * @return {Promise<string>}
 */
async function getLatestTag() {
  const response = await fetch('https://api.github.com/repos/ordinals/ord/releases/latest');
  const { tag_name } = await response.json();
  if (tag_name.match(/^[0-9]+\.[0-9]+\.[0-9]+$/)) {
    return tag_name;
  }
  throw new Error(`Unexpected tag_name: ${tag_name}`);
}

async function run(version, type) {
  const args = [
    'buildx',
    'build',
    '.',
    '--progress=plain',
    '-t',
    `ghcr.io/vetumorg/ord:${version}`,
    '--build-arg',
    `ORD_VERSION=${version}`,
    '--cache-from',
    'type=registry,ref=ghcr.io/vetumorg/ord:build-cache',
  ];

  if (type === 'push') {
    args.push(
      '-t',
      'ghcr.io/vetumorg/ord:latest',
      '--output',
      'type=registry',
      '--platform',
      'linux/amd64,linux/arm64',
      '--cache-to',
      'type=registry,ref=ghcr.io/vetumorg/ord:build-cache',
    );
  }

  spawn('docker', args, { stdio: 'inherit' });
}

const tag = await getLatestTag();
await run(tag, process.argv[2]);
