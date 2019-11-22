import Player from "./Player";
import { Card, getNextCard, toTrumpValue } from "truco-common";
import Logger from "../utils/Logger";

export default class Round {
  /*
    When Player = Has a winner
    When undefined = No winner yet
    When null = Draw
  */
  winner: Player | undefined | null;
  playedCards = new Map<Player, Card>();
  players: Array<Player>;
  currentPlayer: number;
  trump: Card;
  strongestPlayer?: Player;
  draw = false;

  constructor(players: Array<Player>, turned: Card, firstPlayer: number) {
    this.players = players;
    this.trump = getNextCard(turned);
    this.currentPlayer = firstPlayer;
  }

  isPlayerTurn(player: Player) {
    return this.currentPlayer === this.players.indexOf(player);
  }

  play(player: Player, card: Card) {
    if (this.winner !== undefined) throw new Error("Round ended");

    if (this.playedCards.size === this.players.length)
      throw new Error("All players already played");

    if (this.playedCards.has(player))
      throw new Error("You already played in that round");

    if (!this.isPlayerTurn(player)) throw new Error("It's not your turn");

    this.playedCards.set(player, card);
    Logger.game(`${player.name} played ${card.toString()}`);

    if (this.currentPlayer === this.players.length - 1) {
      this.currentPlayer = 0;
    } else {
      this.currentPlayer++;
    }

    this.updateWinner(player, card);
  }

  private updateWinner(player: Player, card: Card) {
    if (this.strongestPlayer === undefined) {
      this.strongestPlayer = player;
      return;
    }

    let strongestCard = this.playedCards.get(this.strongestPlayer!)!;

    if (strongestCard.value.power === this.trump.value.power) {
      strongestCard = new Card(
        toTrumpValue(strongestCard.value),
        strongestCard.suit
      );
    }

    if (card.value.power === this.trump.value.power)
      card = new Card(toTrumpValue(card.value), card.suit);

    if (card.value.power < strongestCard.value.power) {
      this.strongestPlayer = player;
    }

    if (strongestCard.isTrump() && card.isTrump()) {
      if (card.suit.power < strongestCard.suit.power) {
        this.strongestPlayer = player;
        this.draw = false;
      }
    } else {
      this.draw = card.value.power === strongestCard.value.power;
    }

    if (this.playedCards.size !== this.players.length) return;

    Logger.game(
      this.draw ? "Round draw" : `${this.strongestPlayer.name} won round`
    );

    this.winner = this.draw ? null : this.strongestPlayer!;
  }
}
