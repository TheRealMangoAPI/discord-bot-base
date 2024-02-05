import { Client, Collection } from "discord.js";
import { Command } from "./Command.js";

export interface CustomClient extends Client {
  commands: Collection<string, Command>;
}
