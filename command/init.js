const inquirer = require('inquirer');
const chalk = require('chalk');
const shell = require('shelljs');

module.exports = function () {
  console.log(chalk.yellow.bold('！注意，种子项目只是为了展示 FEB 的使用，并非项目的最佳实践。请结合实际情况参考使用。'));

  const question = {
    type: 'rawlist',
    name: 'type',
    message: '请选择项目类型：',
    choices: [
      {
        value: 'seed-jquery-pc',
        name: 'jQuery PC'
      },
      {
        value: 'seed-jquery-mob',
        name: 'jQuery 移动'
      },
      {
        value: 'seed-regularjs-simple',
        name: 'RegularJS 基础'
      },
      {
        value: 'seed-regularjs-router',
        name: 'RegularJS 路由'
      },
      {
        value: 'seed-vue-simple',
        name: 'VueJS 基础'
      },
      {
        value: 'seed-vue-router',
        name: 'VueJS 路由'
      }
    ]
  };

  inquirer.prompt([question]).then((answers) => {
    const projType = answers.type;

    if (!shell.which('git')) {
      console.log(chalk.red('找不到 git 命令，请先安装 git！'));
      shell.exit(1);
    }


    shell.exec(`git clone http://git.yypm.com/feb/${projType}.git`, { silent: true }, (code) => {
      if (code === 128) {
        console.log(chalk.red(`${projType} 目录已存在！请先手动删除！`));
        shell.exit(1);
      } else if (code !== 0) {
        console.log(chalk.red('有点问题！请联系开发者！'));
        shell.exit(1);
      }

      shell.cd(projType);
      shell.rm('-rf', '.git');
      console.log(chalk.green(`项目创建成功！已生成 ${projType} 目录！`));
    });
  });
};
