import { Client, Storage } from "node-appwrite";
import { config } from "./env";

const client = new Client()
    .setEndpoint(config.appwriteEndpoint)
    .setProject(config.appwriteProjectId)
    .setKey(config.appwriteApiKey);


export const storage = new Storage(client)