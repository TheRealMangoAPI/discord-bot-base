import * as fs from "fs";
import path from "path";
import { CustomClient } from "../interfaces/CustomClient.js";
import {
  REST,
  Routes,
  Collection,
  ChatInputCommandInteraction,
} from "discord.js";
import { Command } from "../interfaces/Command.js";

export async function CommandHandler(BasePath: string, client: CustomClient) {
  client.commands = new Collection<string, Command>();

  await registerCommands(BasePath);

  const commandsPath = path.join(BasePath, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

  for (const commandFile of commandFiles) {
    const commandFilePath = path.join(commandsPath, commandFile);
    const commandModule = await import(`file://${commandFilePath}`);
    const command = commandModule;

    client.commands.set(command.data.name, command);
  }

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  });
}

async function registerCommands(BasePath: string) {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);

  const commandsPath = path.join(BasePath, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

  const commands = [];

  for (const commandFile of commandFiles) {
    const commandFilePath = path.join(commandsPath, commandFile);
    const commandModule = await import(`file://${commandFilePath}`);
    const command = commandModule;

    commands.push(command.data.toJSON());
  }

  try {
    console.log(
      "[🔃][BASE][registerCommands] Started refreshing application (/) commands."
    );

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID as string),
      {
        body: commands,
      }
    );

    console.log(
      "[🔃][BASE][registerCommands] Successfully reloaded application (/) commands."
    );
  } catch (error) {
    console.error(error);
  }
}
