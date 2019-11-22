import * as React from "react";
import { cards } from "truco-common";
import CardViewer from "./CardViewer";

export interface DeckDisplayProps {
  hide: boolean;
}

class DeckDisplay extends React.Component<DeckDisplayProps, {}> {
  render() {
    let index = 0;
    const { hide } = this.props;
    return (
      <React.Fragment>
        {cards.map(card => (
          <CardViewer
            card={card}
            hidden={index++ % 2 === 0 && hide}
            // hidden={false}
            key={card.toString()}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default DeckDisplay;
