"use server";

import { revalidatePath } from "next/cache";
import { MongoClient, ObjectId } from "mongodb";

let client: MongoClient | null = null;

const getMongoClient = () => {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL!);
  }
  return client;
};

export async function createJobOrderAction(data: {
  clientCompanyId: string;
  title: string;
  description: string;
  skillsRequired: string[];
  vacanciesCount: number;
}) {
  const mongoClient = getMongoClient();
  await mongoClient.connect();
  const db = mongoClient.db("hrm");

  const result = await db.collection("JobOrder").insertOne({
    clientCompanyId: data.clientCompanyId,
    title: data.title,
    description: data.description,
    skillsRequired: data.skillsRequired,
    vacanciesCount: data.vacanciesCount,
  });

  revalidatePath("/");
  return { id: result.insertedId.toString(), ...data };
}

export async function updateApplicationStageAction(id: string, newStage: string) {
  const mongoClient = getMongoClient();
  await mongoClient.connect();
  const db = mongoClient.db("hrm");

  await db.collection("Application").updateOne(
    { _id: new ObjectId(id) },
    { $set: { stage: newStage } }
  );

  revalidatePath("/");
  return { id, stage: newStage };
}