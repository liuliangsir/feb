const chalk = require('chalk');
const shell = require('shelljs');

function exec(cmd, options = {}) {
  return new Promise((resolve, reject) => {
    shell.exec(cmd, options, (code, stdout, stderr) => {
      if (code !== 0) {
        reject(new Error(stderr));
      } else {
        resolve(new shell.ShellString(stdout, stderr, code));
      }
    });
  });
}

module.exports = function (msg) {
  // 没有提交信息
  if (!msg) {
    console.log(chalk.red('请使用 -m 填写提交信息！'));
    console.log(`${chalk.blue('例子：')}feb r -m "xxx"`);
    shell.exit(1);
  }

  // 没有 git 命令
  if (!shell.which('git')) {
    console.log(chalk.red('找不到 git 命令，请先安装 git！'));
    shell.exit(1);
  }

  // 分支名称
  let branch;
  // 命令流程
  // git branch
  return exec('git branch', { silent: true })
    .then((res) => {
      console.log(`正在检查分支是否为 ${chalk.cyan('develop')}`);

      branch = res.stdout.match(/\*\s.*(?=\n)/)[0].replace(/\*\s/, '');

      if (branch !== 'develop') {
        return Promise.reject(new Error('当前分支不是 develop，请切换到 develop 分支！'));
      }

      console.log(`${chalk.green('分支检查成功！')}`);

      // git status
      return exec('git status', { silent: true });
    })
    .then((res) => {
      console.log('正在检查工作目录是否干净');

      if (!/working\stree\sclean/.test(res.stdout)) {
        return Promise.reject(new Error('当前工作目录尚有未提交的修改！'));
      }

      console.log(`${chalk.green('工作目录检查成功！')}`);

      // git checkout master
      console.log('正在切换到分支 master');
      return exec('git checkout master', { silent: true });
    })
    .then(() => {
      console.log(`${chalk.green('切换成功！')}`);

      console.log('正在把 develop 分支合并到 master');
      return exec(`git merge develop --no-ff -m "${msg}"`, { silent: true });
    })
    .then(() => {
      console.log(`${chalk.green('合并成功！')}`);

      console.log('正在 push 到远程仓库 master 分支');
      return exec('git push origin master', { silent: true });
    })
    .then(() => {
      console.log(`${chalk.green('push 成功！')}`);

      console.log('正在切换回 develop 分支');
      return exec('git checkout develop', { silent: true });
    })
    .then(() => {
      console.log(`${chalk.green('切换成功！')}`);

      // 提示结束
      console.log('\n');
      console.log(`${chalk.green('feb r 命令成功完成！')}`);
      console.log('\n');
    })
    .catch((err) => {
      console.log(chalk.red('出错了！错误信息如下：'));
      console.log(err);
    });
};
