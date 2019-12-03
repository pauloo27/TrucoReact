export class Message {
  defaultMessage: string;

  constructor(defaultMessage: string) {
    this.defaultMessage = defaultMessage;
  }
}

export const trucoAsk = new Message("Truco!");
export const trucoAccept = new Message("Go ahead!");
export const trucoDecline = new Message("No way");
export const gameWin = new Message("EASY!");

const messagesHolder = new Map<Message, Array<string>>();

function addMessage(message: Message, ...messages: Array<string>) {
  messages.push(message.defaultMessage);
  messagesHolder.set(message, messages);
}

addMessage(trucoAsk, "TRUCO!", "TRUUCO!", "Truco", "TRUUUCOOOO!");
addMessage(trucoAccept, "GO AHEAD!", "Go ahead loser!", "Throw the braba");
addMessage(trucoDecline, "No", "Nope", "NO LOL");
addMessage(gameWin, "That one was EASY", "EZ", "LOL", "That's all? LOL");

export function getRandomMessageFor(message: Message): string {
  const messages = messagesHolder.get(message);

  if (messages === undefined || messages.length === 0)
    return message.defaultMessage;

  return messages[Math.floor(Math.random() * messages.length)];
}
