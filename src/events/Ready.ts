import { Events } from "discord.js";
import { CustomClient } from "../base/interfaces/CustomClient.js";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: CustomClient) {
    console.log(`[✅][EVENT][${Events.ClientReady}] Client is ready!`);
  },
};
