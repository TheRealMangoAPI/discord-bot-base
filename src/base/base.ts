import { Client, Events, GatewayIntentBits, IntentsBitField } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import { EventHandler } from "./Handler/EventHandler.js";
import { CustomClient } from "./interfaces/CustomClient.js";
import { CommandHandler } from "./Handler/CommandHandler.js";
dotenv.config();

async function InitialiseBase(intents: GatewayIntentBits[]) {
  const BasePath = path.join(process.cwd(), "src");

  // @ts-ignore
  const client: CustomClient = new Client({
    intents: [intents],
  });

  EventHandler(BasePath, client);
  CommandHandler(BasePath, client);

  client.once(Events.ClientReady, () => {
    console.log(
      `[✅][BASE][InitialiseBase] Base initialised as ${client.user?.username}`
    );
  });

  client.login(process.env.DISCORD_TOKEN);

  return { client };
}

export { InitialiseBase };
