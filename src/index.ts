import { GatewayIntentBits } from "discord.js";
import { InitialiseBase } from "./base/base.js";

const { client } = await InitialiseBase([
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
]);