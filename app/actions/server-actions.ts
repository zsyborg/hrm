"use server";

export async function createJobOrderAction(data: {
  clientCompanyId: string;
  title: string;
  description: string;
  skillsRequired: string[];
  vacanciesCount: number;
}) {
  return { id: `job-${Date.now()}`, ...data };
}

export async function updateApplicationStageAction(id: string, newStage: string) {
  return { id, stage: newStage };
}
