const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');

const PB_VERSION = '0.39.9';

const pocketbaseDir = path.resolve(__dirname, '..');

function getPlatform() {
  switch (process.platform) {
    case 'win32':
      return 'windows';
    case 'darwin':
      return 'darwin';
    case 'linux':
      return 'linux';
    default:
      throw new Error(`Unsupported operating system: ${process.platform}`);
  }
}

function getArchitecture() {
  switch (process.arch) {
    case 'x64':
      return 'amd64';
    case 'arm64':
      return 'arm64';
    default:
      throw new Error(`Unsupported CPU architecture: ${process.arch}`);
  }
}

const platform = getPlatform();
const architecture = getArchitecture();

const extension = platform === 'windows' ? '.exe' : '';

const fileName =
  `pocketbase_${PB_VERSION}_${platform}_${architecture}.zip`;

const downloadUrl =
  `https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/${fileName}`;

const zipPath = path.join(pocketbaseDir, fileName);
const executablePath = path.join(
  pocketbaseDir,
  `pocketbase${extension}`
);

console.log('');
console.log('PocketBase installer');
console.log('--------------------');
console.log(`Version:    ${PB_VERSION}`);
console.log(`OS:         ${platform}`);
console.log(`CPU:        ${architecture}`);
console.log(`Download:   ${downloadUrl}`);
console.log('');

if (fs.existsSync(executablePath)) {
  console.log('PocketBase is already installed.');
  console.log(`Location: ${executablePath}`);
  process.exit(0);
}

fs.mkdirSync(pocketbaseDir, { recursive: true });

function download(url, destination) {
  return new Promise((resolve, reject) => {
    console.log('Downloading PocketBase...');

    const request = https.get(url, (response) => {
      // Follow GitHub redirects
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        response.resume();
        return download(response.headers.location, destination)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        response.resume();
        reject(
          new Error(
            `Download failed. HTTP status: ${response.statusCode}`
          )
        );
        return;
      }

      const file = fs.createWriteStream(destination);

      response.pipe(file);

      file.on('finish', () => {
        file.close(resolve);
      });

      file.on('error', (error) => {
        fs.unlink(destination, () => {});
        reject(error);
      });
    });

    request.on('error', reject);
  });
}

async function extractZip() {
  console.log('Extracting PocketBase...');

  if (platform === 'win32') {
    // Windows PowerShell
    execFileSync(
      'powershell',
      [
        '-NoProfile',
        '-Command',
        `Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${pocketbaseDir}' -Force`
      ],
      { stdio: 'inherit' }
    );
  } else {
    // macOS/Linux
    execFileSync(
      'unzip',
      ['-o', zipPath, '-d', pocketbaseDir],
      { stdio: 'inherit' }
    );

    fs.chmodSync(executablePath, 0o755);
  }
}

async function main() {
  try {
    await download(downloadUrl, zipPath);
    await extractZip();

    // Remove downloaded ZIP
    fs.unlinkSync(zipPath);

    if (!fs.existsSync(executablePath)) {
      throw new Error(
        `PocketBase executable was not found after extraction:\n${executablePath}`
      );
    }

    console.log('');
    console.log('PocketBase installed successfully!');
    console.log(`Location: ${executablePath}`);
    console.log('');
  } catch (error) {
    console.error('');
    console.error('Failed to install PocketBase.');
    console.error(error.message);
    console.error('');

    process.exit(1);
  }
}

main();
