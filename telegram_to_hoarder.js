function toHoarder(input) {
  const telegramObj = JSON.parse(input);
  const messages = [];
  for (const message of telegramObj.messages) {
    if (message.type !== "message") continue;

    if (message.text_entities.length === 0) continue;

    if (message.text_entities.length === 1 && message.text_entities[0].type === "link") {
      messages.push({
        url: message.text_entities[0].text
      });
      continue;
    }

    const textMessage = message.text_entities.reduce((acc, entity) => acc + entity.text, "");

    if (message.text_entities.filter(entity => entity.type === "link").length === 1) {
      messages.push({
        note: textMessage,
        url: message.text_entities.filter(entity => entity.type === "link")[0].text
      });
      continue;
    }

    messages.push({
      note: textMessage
    });
  }

  console.log(messages.length)
  // console.log(JSON.stringify(messages, null, 2));
}

const fs = require('fs');
const content = fs.readFileSync('./result.json');

toHoarder(content);