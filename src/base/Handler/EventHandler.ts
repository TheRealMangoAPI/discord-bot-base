import { Client } from "discord.js";
import * as fs from "fs";
import path from "path";
import { CustomClient } from "../interfaces/CustomClient.js";

export async function EventHandler(BasePath: string, client: CustomClient) {
  const eventsPath = path.join(BasePath, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts"));

  for (const eventFile of eventFiles) {
    const eventFilePath = path.join(eventsPath, eventFile);
    const eventModule = await import(`file://${eventFilePath}`);
    const event = eventModule.default;

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}
