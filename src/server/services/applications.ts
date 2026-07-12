import { prisma } from "@/server/db/prisma";

export async function getJobApplications(limit = 200) {
  const applications = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return applications;
}

export type JobApplicationRow = Awaited<ReturnType<typeof getJobApplications>>[number];
