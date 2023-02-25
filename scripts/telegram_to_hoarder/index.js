const fs = require("fs");

const content = fs.readFileSync("result.json");
const object = JSON.parse(content);

const messages = object.messages.filter((msg) => msg.from === "Octav");

const data = [];

const collect = (list) => {
  return list.map((e) => e.text).join("");
};

for (const msg of messages) {
  if (msg.text_entities.length === 1) {
    if (msg.text_entities[0].type === "link") {
      data.push({
        url: collect(msg.text_entities)
      });
      continue;
    }
  }

  data.push({
    title: collect(msg.text_entities)
  });
}

fs.writeFileSync("done.json", JSON.stringify(data, null, 2));
