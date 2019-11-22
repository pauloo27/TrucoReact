import chalk from "chalk";
import EventEmmiter from "events";

class LogLevel {
  name: string;
  color: string;
  constructor(name: string, color: string) {
    this.name = name.toUpperCase();
    this.color = color;
  }
}

const INFO = new LogLevel("info", "white");
const WARNING = new LogLevel("warning", "yellow");
const DEBUG = new LogLevel("debug", "green");
const ERROR = new LogLevel("error", "red");

const GAME = new LogLevel("game", "aqua");
const YOU = new LogLevel("you", "blue");
const COMPUTER = new LogLevel("computer", "black");

class Logger extends EventEmmiter {
  game(message: string) {
    this.log(GAME, message);
  }

  you(message: string) {
    this.log(YOU, message);
  }

  computer(message: string) {
    this.log(COMPUTER, message);
  }

  info(message: string) {
    this.log(INFO, message);
  }

  warning(message: string) {
    this.log(WARNING, message);
  }

  debug(message: string) {
    this.log(DEBUG, message);
  }

  error(message: string) {
    this.log(ERROR, message);
  }

  log(level: LogLevel, message: string) {
    if (level === null) level = INFO;
    if (message === null) message = "";

    this.emit(`log`, message, level);
    console.log(
      chalk.bold(chalk.keyword(level.color)(`[${level.name}]`)),
      message
    );
  }
}

export default new Logger();
