import Hand from "./Hand";
import Player from "./Player";
import { Card } from "truco-common";
import Logger from "../utils/Logger";
import { EventEmitter } from "events";

export class LockHolder {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export default class Game extends EventEmitter {
  hands = new Array<Hand>();
  players: Array<Player>;
  firstPlayerIndex = 0;
  locks = new Array<LockHolder>();

  lock = (lockHolder: LockHolder) => {
    this.locks.push(lockHolder);
  };

  unlock = (lockHolder: LockHolder) => {
    this.locks = this.locks.filter(obj => lockHolder !== obj);
  };

  isLocked(): boolean {
    return this.locks.length !== 0;
  }

  constructor(players: Array<Player>) {
    super();
    this.players = players;
  }

  getPlayerScore(player: Player): number {
    return this.hands
      .filter(hand => hand.winner === player)
      .map(hand => hand.points)
      .reduce((sum, element) => (sum += element), 0);
  }

  startNewHand() {
    this.hands.push(
      new Hand(this.players, this.firstPlayerIndex, this.lock, this.unlock)
    );
    this.hand.addListener("newRound", () => this.emit("newRound"));
    this.emit("newHand");
  }

  startNewHandLater() {
    const lockHolder = new LockHolder("new hand later");
    this.lock(lockHolder);
    return new Promise(resolve =>
      setTimeout(() => {
        this.unlock(lockHolder);
        this.startNewHand();
        resolve();
      }, 2500)
    );
  }

  truco(player: Player) {
    try {
      this.hand.truco(player);
      this.emit("truco", player);
    } catch (e) {
      throw e;
    }
  }

  acceptTruco(player: Player) {
    try {
      this.hand.acceptTruco(player);
      this.emit("trucoAccepted", player);
    } catch (e) {
      throw e;
    }
  }

  declineTruco(player: Player) {
    try {
      this.hand.declineTruco(player);
      this.updateWinner();
      this.emit("trucoDeclined", player);
    } catch (e) {
      throw e;
    }
  }

  startGame() {
    this.startNewHand();
  }

  get hand(): Hand {
    return this.hands[this.hands.length - 1];
  }

  updateWinner() {
    if (this.hand.winner !== undefined) {
      if (this.hand.winner === null) {
        Logger.game("Hand draw");
      } else {
        Logger.game(`${this.hand.winner.name} won hand`);
      }

      if (this.firstPlayerIndex === this.players.length - 1) {
        this.firstPlayerIndex = 0;
      } else {
        this.firstPlayerIndex++;
      }
      if (this.hand.winner) {
        if (this.getPlayerScore(this.hand.winner) >= 12) {
          Logger.game(`${this.hand.winner.name} won the game`);
          this.emit("gameEnded", this.hand.winner);
          return;
        }
      }
      this.startNewHandLater();
    }
  }

  play(player: Player, card: Card) {
    if (this.isLocked()) {
      console.log(this.locks);
      throw new Error("The game is locked");
    }

    try {
      this.hand.play(player, card);
      this.emit("played", player, card);
    } catch (e) {
      throw e;
    }

    this.updateWinner();
  }
}
