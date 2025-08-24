import { Client, Account, Databases, Storage, ID } from "react-native-appwrite";

// Access from process.env
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const REPORTS_COL_ID = process.env.EXPO_PUBLIC_APPWRITE_REPORTS_COLLECTION_ID!;

export { client, account, databases, storage, ID };
