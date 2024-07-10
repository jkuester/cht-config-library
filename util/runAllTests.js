/* eslint-disable no-console */
const { readdir } = require('fs').promises;
const { existsSync } = require('fs');
const { spawn } = require('child_process');
const Path = require('path');

const ROOT_DIR = Path.join(__dirname, '../');

const getDirectories = async (source) => (await readdir(source, { withFileTypes: true }))
  .filter(dirent => dirent.isDirectory())
  .map(dirent => Path.join(source, dirent.name));

const hasNpmConfig = source => existsSync(Path.join(source, 'package.json'));

const executeCommand = async command => {
  return new Promise((resolve, reject) => {
    const child = spawn(
      command,
      [ '--progress', '--colors' ],
      { shell: true, stdio: 'inherit' }
    );
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(code));
  });
};

const runNpmTest = async source => executeCommand(`npm run --prefix ${source} test`);

(async () => {
  const subProjects = (await getDirectories(ROOT_DIR))
    .filter(hasNpmConfig);
  for (const dir of subProjects) {
    const dirName = Path.basename(dir);
    console.log(`Running tests in ${dirName}...`);
    try {
      await runNpmTest(dir);
    } catch (error) {
      console.error(`Error running tests in ${dirName}: ${error}`);
      process.exit(1);
    }
  }
})();
