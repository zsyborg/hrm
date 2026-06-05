import { MongoClient, Db, Collection } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

const getDb = async (): Promise<Db> => {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL!);
    await client.connect();
  }
  if (!db) {
    db = client.db("hrm");
  }
  return db;
};

export async function getApplications(): Promise<any[]> {
  const database = await getDb();
  const apps: Collection = database.collection("Application");
  return await apps.find({}).toArray();
}

export async function getJobOrders(): Promise<any[]> {
  const database = await getDb();
  return await database.collection("JobOrder").find({}).toArray();
}