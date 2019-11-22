import * as React from "react";
import { Card } from "truco-common";

import "../styles/CardViewer.scss";

export interface CardViewerProps {
  card?: Card;
  hidden: boolean;
  onClick?: Function;
  whitespace?: boolean;
}

export interface CardViewerState {}

class CardViewer extends React.Component<CardViewerProps, CardViewerState> {
  render() {
    const { onClick } = this.props;
    const { card } = this.props;
    let { hidden } = this.props;
    if (!card) hidden = true;
    return (
      <div
        onClick={e => (onClick ? onClick!(e, card) : null)}
        className={`${hidden ? "truco-card-hidden" : ""} ${
          card ? "" : "truco-card-slot"
        } ${onClick ? "truco-card-listened" : ""} ${
          this.props.whitespace !== undefined && this.props.whitespace === true
            ? "truco-card-whitespace"
            : ""
        } truco-card`}
        style={{ color: card ? card!.suit.suitColor : "black" }}
      >
        <div className="truco-card-top">
          <span className="truco-card-value">
            {hidden ? "" : card!.value.name}
          </span>
          <span className="truco-card-suit">
            {hidden ? "" : card!.suit.icon}
          </span>
        </div>
        <div className="truco-card-bottom">
          <span className="truco-card-value">
            {hidden ? "" : card!.value.name}
          </span>
          <span className="truco-card-suit">
            {hidden ? "" : card!.suit.icon}
          </span>
        </div>
      </div>
    );
  }
}

export default CardViewer;
