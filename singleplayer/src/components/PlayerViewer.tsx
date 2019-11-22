import * as React from "react";
import Player from "../game/Player";
import Game from "../game/Game";
import CardViewer from "../components/CardViewer";
import { Card } from "truco-common";

export interface PlayerViewerProps {
  player: Player;
  game: Game;
  hide: boolean;
  notYourTurn?: Function;
}

export interface PlayerViewerState {}

class PlayerViewer extends React.Component<
  PlayerViewerProps,
  PlayerViewerState
> {
  constructor(props: Readonly<PlayerViewerProps>) {
    super(props);
    this.props.game.addListener("played", (player: Player, card: Card) => {
      if (this.props.player === player) {
        this.forceUpdate();
      }
    });
  }

  handleClick = (e: MouseEvent, card: Card) => {
    if (
      !this.props.game.hand.round.isPlayerTurn(this.props.player) ||
      this.props.game.isLocked()
    ) {
      if (this.props.notYourTurn) {
        this.props.notYourTurn!();
      }
      return;
    }
    try {
      this.props.game.play(this.props.player, card);
    } catch (e) {
      if (this.props.notYourTurn) {
        this.props.notYourTurn();
      }
      return;
    }
  };

  render() {
    if (
      this.props.game.hand.deck.playerCards.get(this.props.player)!.length === 0
    ) {
      return (
        <div className="table-player">
          <CardViewer card={undefined} hidden={true} whitespace={true} />
        </div>
      );
    }
    return (
      <div className="table-player">
        {this.props.game.hand.deck.playerCards
          .get(this.props.player)!
          .map(card => (
            <CardViewer
              key={card.toString()}
              card={card}
              hidden={this.props.hide}
              onClick={this.props.hide ? undefined : this.handleClick}
            />
          ))}
      </div>
    );
  }
}

export default PlayerViewer;
