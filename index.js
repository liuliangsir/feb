const program = require('commander');

const cmdGulp = require('./command/gulp');
const cmdInit = require('./command/init');
const cmdHelp = require('./command/help');
const cmdPush = require('./command/push');
const cmRelease = require('./command/release');

const cmdPrompt = require('./command/prompt');

const version = require('./package.json').version;


function run() {
  program
    .version(version);
    // .allowUnknownOption();

  program
    .command('dev').alias('d').action(() => {
      cmdGulp('dev');
    });

  program
    .command('output').alias('o')
    .option('-s')
    .action((cmd) => {
      if (cmd.S) global.FEB_NO_BS = true; // 用于不开启 browser-sync
      // processCmd('output');
      cmdGulp('output');
    });

  program
    .command('help').alias('h').action(() => {
      cmdHelp();
    });

  program
    .command('init').alias('i').action(() => {
      cmdInit('init');
    });

  program
    .command('push').alias('p')
    .option('-m <msg>')
    .action((cmd) => {
      cmdPush(cmd.M);
    });

  program
    .command('release').alias('r')
    .option('-m <msg>')
    .option('-p')
    .action((cmd) => {
      if (cmd.P) {
        cmdPush(cmd.M).then(() => cmRelease(cmd.M));
      } else {
        cmRelease(cmd.M);
      }
    });

  program
    .command('*')
    .action(() => {
      cmdPrompt();
    });

  program.parse(process.argv);

  if (!program.args.length) {
    cmdPrompt();
  }
}

module.exports = run;
