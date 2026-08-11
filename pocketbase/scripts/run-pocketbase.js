const path = require('path');
const { spawn } = require('child_process');

const pocketbaseDir =
  path.resolve(__dirname, '..');

const executableName =
  process.platform === 'win32'
    ? 'pocketbase.exe'
    : 'pocketbase';

const executablePath =
  path.join(
    pocketbaseDir,
    executableName
  );

const args = [
  'serve',
  '--http=0.0.0.0:8090'
];

console.log('');
console.log('Starting PocketBase...');
console.log(`Executable: ${executablePath}`);
console.log(`Address:    http://0.0.0.0:8090`);
console.log('');

const pocketbase = spawn(
  executablePath,
  args,
  {
    cwd: pocketbaseDir,
    stdio: 'inherit'
  }
);

pocketbase.on('error', (error) => {
  console.error('');
  console.error('Failed to start PocketBase.');
  console.error(error.message);
  console.error('');

  process.exit(1);
});

pocketbase.on('close', (code) => {
  console.log(`PocketBase stopped with code ${code}`);
  process.exit(code ?? 0);
});
