import * as React from "react";
import ReactDOMServer from "react-dom/server";
import PlayerViewer from "./PlayerViewer";
import CardViewer from "./CardViewer";
import Game, { LockHolder } from "../game/Game";
import Player from "../game/Player";

import "../styles/Table.scss";
import PlayedCardSlot from "./PlayedCardSlot";
import Round from "../game/Round";
import $ from "jquery";
import { Placement } from "bootstrap";

import * as GameMessage from "../GameMessage";

export interface TableProps {
  game: Game;
}

export interface TableState {}

const lostChar = "✗";
const wonChar = "✓";
const drawChar = "-";

class Table extends React.Component<TableProps, TableState> {
  popoverTimeout = new Map<string, number>();
  priorityElemement: boolean = false;

  constructor(props: Readonly<TableProps>) {
    super(props);
    this.props.game.addListener("newRound", () => {
      this.forceUpdate();
      if(!this.props.game.winner) {
        this.closePopoverComputer();
        this.closePopoverPlayer();
      }
    });
    this.props.game.addListener("newHand", () => {
      if(!this.props.game.winner) {
        this.closePopoverComputer();
        this.closePopoverPlayer();
      }
      this.forceUpdate();
    });
    this.props.game.addListener("truco", player => {
      if (player === this.props.game.players[0]) return;
      this.popoverHtmlComputer(
        <div id="truco-popover">
          <span className="truco-response" id="truco-accept">
            Yes
          </span>{" "}
          <span className="truco-response" id="truco-decline">
            No
          </span>
        </div>,
        "Asked for Truco",
        -1
      );
      $("#truco-accept").on("click", () => this.handleTrucoResponse(true));
      $("#truco-decline").on("click", () => this.handleTrucoResponse(false));
    });
    this.props.game.addListener("trucoAccepted", player => {
      const lockHolder = new LockHolder("truco accepted");
      this.props.game.lock(lockHolder);
      if (player === this.props.game.players[0]) {
        this.popoverPlayer(
          GameMessage.getRandomMessageFor(GameMessage.trucoAccept)
        );
      } else {
        this.popoverComputer(
          GameMessage.getRandomMessageFor(GameMessage.trucoAccept)
        );
      }
      setTimeout(() => {
        this.props.game.unlock(lockHolder);
        this.forceUpdate();
      }, 1000);
    });
    this.props.game.addListener("trucoDeclined", player => {
      const lockHolder = new LockHolder("truco declined");
      this.props.game.lock(lockHolder);
      if (player === this.props.game.players[0]) {
        this.popoverPlayer(
          GameMessage.getRandomMessageFor(GameMessage.trucoDecline)
        );
      } else {
        this.popoverComputer(
          GameMessage.getRandomMessageFor(GameMessage.trucoDecline)
        );
      }
      setTimeout(() => {
        this.props.game.unlock(lockHolder);
        this.forceUpdate();
      }, 1000);
    });
    this.props.game.addListener("gameEnded", (winner: Player) => {
      this.forceUpdate();
      if (winner === this.props.game.players[0]) {
        this.popoverPlayer(
          GameMessage.getRandomMessageFor(GameMessage.gameWin),
          undefined,
          10000
        );
      } else {
        this.popoverComputer(
          GameMessage.getRandomMessageFor(GameMessage.gameWin),
          undefined,
          10000
        );
      }
      this.props.game.lock(new LockHolder("Game ended"));
    });
  }

  handleTrucoResponse = (accepted: boolean) => {
    if (accepted) {
      this.props.game.acceptTruco(this.props.game.players[0]);
    } else {
      this.props.game.declineTruco(this.props.game.players[0]);
    }
    this.closePopoverComputer();
  };

  closePopover = (element: string) => {
    $(element).popover("dispose");
    this.priorityElemement = false;
  };

  popover = (
    element: string,
    placement: Placement,
    message: string,
    title?: string,
    timeMs?: number,
    html?: boolean
  ) => {
    if (timeMs === undefined) timeMs = 2000;
    if (title === undefined) title = "";

    if (this.priorityElemement) return;
    this.closePopover(element);
    $(element).popover({
      title: title,
      content: message,
      html: html === undefined ? false : html,
      placement: placement
    });
    $(element).popover("show");

    let current = this.popoverTimeout.get(element);
    if (current === undefined) current = 0;

    this.popoverTimeout.set(element, ++current);
    if (timeMs > 0) {
      setTimeout(() => {
        if (this.popoverTimeout.get(element) === current) {
          this.closePopover(element);
        }
      }, timeMs);
    } else {
      this.priorityElemement = true;
    }
  };

  popoverPlayer = (message: string, title?: string, timeMs?: number) => {
    this.popover("#player-hand", "top", message, title, timeMs);
  };

  popoverComputer = (message: string, title?: string, timeMs?: number) => {
    this.popover("#computer-hand", "bottom", message, title, timeMs);
  };

  closePopoverPlayer = () => {
    this.closePopover("#player-hand");
  };

  closePopoverComputer = () => {
    this.closePopover("#computer-hand");
  };

  popoverHtmlComputer = (
    html: JSX.Element,
    title?: string,
    timeMs?: number
  ) => {
    this.popover(
      "#computer-hand",
      "bottom",
      ReactDOMServer.renderToString(html),
      title,
      timeMs,
      true
    );
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
    this.popoverPlayer(GameMessage.getRandomMessageFor(GameMessage.trucoAsk));
  };

  formatRoundStatus(round: Round, player: Player) {
    if (round.winner === undefined) return "_";
    if (round.winner === null) {
      return drawChar;
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
