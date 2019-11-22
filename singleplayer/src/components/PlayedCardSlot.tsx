import * as React from "react";
import CardViewer from "./CardViewer";
import Player from "../game/Player";
import Game from "../game/Game";
import { Card } from "truco-common";

export interface PlayedCardSlotProps {
  player: Player;
  game: Game;
}

export interface PlayedCardSlotState {}

class PlayedCardSlot extends React.Component<
  PlayedCardSlotProps,
  PlayedCardSlotState
> {
  constructor(props: Readonly<PlayedCardSlotProps>) {
    super(props);
    this.props.game.addListener("played", (player: Player, card: Card) => {
      this.forceUpdate();
    });
    this.props.game.addListener("newRound", (player: Player, card: Card) => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <CardViewer
        card={this.props.game.hand.round.playedCards.get(this.props.player)}
        hidden={
          this.props.game.hand.round.playedCards.get(this.props.player) ===
          undefined
        }
      />
    );
  }
}

export default PlayedCardSlot;
