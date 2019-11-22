import * as React from "react";
import PlayerViewer from "./PlayerViewer";
import CardViewer from "./CardViewer";
import Game, { LockHolder } from "../game/Game";
import Player from "../game/Player";

import "../styles/Table.scss";
import PlayedCardSlot from "./PlayedCardSlot";
import Round from "../game/Round";
import $ from "jquery";
import { Placement } from "bootstrap";

export interface TableProps {
  game: Game;
}

export interface TableState {}

const lostChar = "✗";
const wonChar = "✓";

class Table extends React.Component<TableProps, TableState> {
  popoverTimeout = new Map<string, number>();

  constructor(props: Readonly<TableProps>) {
    super(props);
    this.props.game.addListener("newRound", () => {
      this.forceUpdate();
    });
    this.props.game.addListener("newHand", () => {
      this.forceUpdate();
    });
    this.props.game.addListener("trucoAccepted", () => {
      const lockHolder = new LockHolder("truco accepted");
      this.props.game.lock(lockHolder);
      this.popoverComputer("Go ahead loser!");
      setTimeout(() => {
        this.props.game.unlock(lockHolder);
        this.forceUpdate();
      }, 1000);
    });
    this.props.game.addListener("trucoDeclined", () => {
      const lockHolder = new LockHolder("truco declined");
      this.props.game.lock(lockHolder);
      this.popoverComputer("LOL, no");
      setTimeout(() => {
        this.props.game.unlock(lockHolder);
        this.forceUpdate();
      }, 1000);
    });
    this.props.game.addListener("gameEnded", (winner: Player) => {
      this.forceUpdate();
      if (winner === this.props.game.players[0]) {
        this.popoverPlayer("That one was EASY!", 10000);
      } else {
        this.popoverComputer("That one was EASY!", 10000);
      }
    });
  }

  popover = (
    element: string,
    p: Placement,
    message: string,
    timeMs?: number
  ) => {
    if (timeMs === undefined) timeMs = 5000;

    $(element).popover("dispose");
    $(element).popover({
      content: message,
      placement: p
    });
    $(element).popover("show");

    let current = this.popoverTimeout.get(element);
    if (current === undefined) current = 0;

    this.popoverTimeout.set(element, ++current);

    setTimeout(() => {
      if (this.popoverTimeout.get(element) === current) {
        $(element).popover("dispose");
      }
    }, timeMs);
  };

  popoverPlayer = (message: string, timeMs?: number) => {
    this.popover("#player-hand", "top", message, timeMs);
  };

  popoverComputer = (message: string, timeMs?: number) => {
    this.popover("#computer-hand", "bottom", message, timeMs);
  };

  handleTruco = () => {
    if (!this.props.game.hand.round.isPlayerTurn(this.props.game.players[0])) {
      this.popoverComputer("Wait for your turn");
      return;
    }
    if (this.props.game.hand.lastTrucker === this.props.game.players[0]) {
      this.popoverComputer("You cant do it now");
      return;
    }
    this.props.game.truco(this.props.game.players[0]);
    this.popoverPlayer("TRUCO!");
  };

  formatRoundStatus(round: Round, player: Player) {
    if (round.winner === undefined) return "_";
    if (round.winner === null) {
      return "-";
    } else {
      return round.winner === player ? wonChar : lostChar;
    }
  }

  render() {
    const [player, computer] = this.props.game.players;

    return (
      <div className="table">
        <div id="game-status">
          <p id="title">Status</p>
          <p className="score" id="you">
            You: {this.props.game.getPlayerScore(player)}
          </p>
          <p className="score" id="him">
            Him: {this.props.game.getPlayerScore(computer)}
          </p>
          <p id="rounds">
            {this.props.game.hand.rounds.map(
              round => `[${this.formatRoundStatus(round, player)}]`
            )}
          </p>
        </div>
        <div id="turned-card">
          <CardViewer card={this.props.game.hand.deck.turned} hidden={false} />
        </div>
        <div id="computer-hand">
          <PlayerViewer game={this.props.game} player={computer} hide={true} />
        </div>
        <div id="played-cards">
          <PlayedCardSlot game={this.props.game} player={computer} />
          <br />
          <PlayedCardSlot game={this.props.game} player={player} />
        </div>
        <div id="player-hand">
          <PlayerViewer
            game={this.props.game}
            player={player}
            hide={false}
            notYourTurn={() => this.popoverComputer("Wait for your turn")}
          />
        </div>
        <span id="player-truco-button" onClick={this.handleTruco}>
          TRUCO!
        </span>
      </div>
    );
  }
}

export default Table;
