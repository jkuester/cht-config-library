/* eslint-disable no-console */
const { readdir } = require('fs').promises;
const { spawn } = require('child_process');
const Path = require('path');

// Projects with tests that should only be run on CI (or when CI envar = true)
const CI_DEPENDANT = process.env.CI ? [] : ['google-drive'];
const IGNORED_DIRS = ['node_modules', 'util', '.github', '.git', '.idea', ...CI_DEPENDANT];
const ROOT_DIR = Path.join(__dirname, '../');

const getDirectories = async (source) => (await readdir(source, { withFileTypes: true }))
  .filter(dirent => dirent.isDirectory())
  .map(dirent => Path.join(source, dirent.name));

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
    .map(dir => Path.basename(dir))
    .filter(dir => !IGNORED_DIRS.includes(dir));
  for (const dir of subProjects) {
    console.log(`Running tests in ${dir}...`);
    try {
      await runNpmTest(dir);
    } catch (error) {
      console.error(`Error running tests in ${dir}: ${error}`);
      process.exit(1);
    }
  }
})();
