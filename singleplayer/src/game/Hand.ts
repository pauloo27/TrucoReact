import Player from "./Player";
import Deck from "./Deck";
import Round from "./Round";
import Logger from "../utils/Logger";
import { Card } from "truco-common";
import EventEmmiter from "events";
import { LockHolder } from "./Game";

export default class Hand extends EventEmmiter {
  players: Array<Player>;
  rounds = new Array<Round>();
  firstPlayer: number;
  /*
    When Player = Has a winner
    When undefined = No winner yet
    When null = Draw
  */
  winner: Player | undefined | null;
  deck: Deck;
  lastTrucker?: Player;
  isTrucoPending = false;
  lock: Function;
  unlock: Function;
  private value = 0;

  constructor(
    players: Array<Player>,
    firstPlayer: number,
    lock: Function,
    unlock: Function
  ) {
    super();
    this.lock = lock;
    this.unlock = unlock;
    this.players = players;
    this.firstPlayer = firstPlayer;
    this.deck = new Deck(players);
    this.startNewRound();
  }

  private startNewRound() {
    this.rounds.push(
      new Round(this.players, this.deck.turned, this.firstPlayer)
    );
    this.emit("newRound");
  }

  private startNewRoundLater() {
    const lockHolder = new LockHolder("start new round");
    this.lock(lockHolder);
    return new Promise(resolve =>
      setTimeout(() => {
        this.unlock(lockHolder);
        this.startNewRound();
        resolve();
      }, 2500)
    );
  }

  get points(): number {
    return Math.max(this.value, 1);
  }

  truco(player: Player) {
    if (!this.round.isPlayerTurn(player)) throw new Error("It's not your turn");

    if (this.value >= 12) {
      throw new Error("Max truco already reached");
    }

    if (player === this.lastTrucker)
      throw new Error("You already asked for truco");

    Logger.game(`${player.name} trucked`);
    this.lastTrucker = player;
    this.isTrucoPending = true;
  }

  acceptTruco(player: Player) {
    if (!this.isTrucoPending) throw new Error("There's nothing to accept");
    if (player === this.lastTrucker)
      throw new Error("You cannot accept the truck");

    this.value += 3;
    this.isTrucoPending = false;
    Logger.game(
      `${player.name} accepted the truco, hand now has ${this.value} point`
    );
  }

  declineTruco(player: Player) {
    if (!this.isTrucoPending) throw new Error("There's nothing to accept");
    if (player === this.lastTrucker)
      throw new Error("You cannot accept the truck");

    this.winner = this.lastTrucker;
    this.isTrucoPending = false;
    Logger.game(`${player.name} declined the truco`);
  }

  get round(): Round {
    return this.rounds[this.rounds.length - 1];
  }

  play(player: Player, card: Card) {
    if (!this.deck.playerCards.get(player)!.includes(card))
      throw new Error("Invalid card");

    if (this.isTrucoPending) throw new Error("There's a pending truco request");

    try {
      this.round.play(player, card);
      this.deck.playerCards.set(
        player,
        this.deck.playerCards.get(player)!.filter(c => c !== card)
      );
    } catch (e) {
      throw e;
    }

    this.updateWinner();

    if (this.winner !== undefined) return;

    if (this.round.winner !== undefined) {
      if (this.round.winner !== null) {
        this.firstPlayer = this.players.indexOf(this.round.winner);
      }
      this.startNewRoundLater();
    }
  }

  private updateWinner() {
    if (this.rounds.length === 1) return;

    if (this.rounds.length === 2) {
      const winners = this.rounds.map(round => round.winner);
      const firstRoundWinner = winners[0];
      const secondRoundWinner = winners[1];
      const totalDraws = winners.filter(winner => winner === null).length;

      // if both round got a draw
      if (totalDraws === 2) return;
      // if only 1 round got a draw
      else if (totalDraws === 1)
        this.winner = winners.find(winner => winner !== null);

      // if someone won the 2 rounds
      if (firstRoundWinner === secondRoundWinner) {
        this.winner = firstRoundWinner;
        return;
      }
      // if it's no draws and the winners aren't the same, a 3rd round is needed
      return;
    }

    // if it's the 3rd round, the round winner is the hand winner unless it's a draw, then, the
    // winner of the first round won
    if (this.round.winner === null) {
      this.winner = this.rounds[0].winner;
      return;
    }
    this.winner = this.round.winner;
  }
}
