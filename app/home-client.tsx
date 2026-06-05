"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type View = "hr" | "candidate" | "client";
type Stage = "Applied" | "Screening" | "Interview" | "Shortlisted" | "Rejected";

type Job = {
  id: string;
  title: string;
  client: string;
  location: string;
  type: string;
  salary: string;
  skills: string[];
  summary: string;
};

type Application = {
  id: string;
  candidateName: string;
  email: string;
  jobId: string;
  stage: Stage;
  resumeName: string;
  experience: string;
  fitScore: number;
  appliedAt: string;
};

const stages: Stage[] = ["Applied", "Screening", "Interview", "Shortlisted", "Rejected"];

const initialJobs: Job[] = [
  {
    id: "job-product-designer",
    title: "Product Designer",
    client: "Northstar Labs",
    location: "Remote",
    type: "Full time",
    salary: "$82k - $104k",
    skills: ["Figma", "UX Research", "Design Systems"],
    summary: "Design hiring workflows and internal tools for a fast-growing SaaS team.",
  },
  {
    id: "job-frontend-engineer",
    title: "Frontend Engineer",
    client: "BluePeak Retail",
    location: "Bengaluru",
    type: "Hybrid",
    salary: "$70k - $95k",
    skills: ["React", "TypeScript", "Next.js"],
    summary: "Build high-quality customer dashboards and improve application performance.",
  },
  {
    id: "job-people-ops",
    title: "People Operations Lead",
    client: "Meridian Health",
    location: "Mumbai",
    type: "Full time",
    salary: "$58k - $72k",
    skills: ["HRIS", "Onboarding", "Compliance"],
    summary: "Own onboarding, employee lifecycle operations, and HR process reporting.",
  },
];

const initialApplications: Application[] = [
  {
    id: "app-001",
    candidateName: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    jobId: "job-frontend-engineer",
    stage: "Shortlisted",
    resumeName: "Aarav-Mehta-Frontend.pdf",
    experience: "5 years",
    fitScore: 94,
    appliedAt: "May 28",
  },
  {
    id: "app-002",
    candidateName: "Nisha Rao",
    email: "nisha.rao@example.com",
    jobId: "job-product-designer",
    stage: "Interview",
    resumeName: "Nisha-Rao-Portfolio.pdf",
    experience: "4 years",
    fitScore: 89,
    appliedAt: "May 30",
  },
  {
    id: "app-003",
    candidateName: "Kabir Sethi",
    email: "kabir.sethi@example.com",
    jobId: "job-people-ops",
    stage: "Screening",
    resumeName: "Kabir-Sethi-HR.pdf",
    experience: "7 years",
    fitScore: 86,
    appliedAt: "Jun 1",
  },
  {
    id: "app-004",
    candidateName: "Maya Iyer",
    email: "maya.iyer@example.com",
    jobId: "job-frontend-engineer",
    stage: "Applied",
    resumeName: "Maya-Iyer-React.pdf",
    experience: "3 years",
    fitScore: 78,
    appliedAt: "Jun 2",
  },
];

const viewLabels: Record<View, string> = {
  hr: "HR workspace",
  candidate: "Candidate portal",
  client: "Client shortlist",
};

function findJob(jobs: Job[], id: string) {
  return jobs.find((job) => job.id === id);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function HomePage() {
  const [activeView, setActiveView] = useState<View>("hr");
  const [jobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [selectedJobId, setSelectedJobId] = useState(initialJobs[0].id);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [experience, setExperience] = useState("");

  const shortlisted = applications.filter((application) => application.stage === "Shortlisted");
  const selectedJob = findJob(jobs, selectedJobId) ?? jobs[0];

  const metrics = useMemo(
    () => [
      { label: "Open jobs", value: jobs.length.toString() },
      { label: "Applications", value: applications.length.toString() },
      { label: "Shortlisted", value: shortlisted.length.toString() },
      { label: "Avg. fit score", value: `${Math.round(applications.reduce((sum, app) => sum + app.fitScore, 0) / applications.length)}%` },
    ],
    [applications, jobs.length, shortlisted.length],
  );

  function updateStage(id: string, stage: Stage) {
    setApplications((current) =>
      current.map((application) => (application.id === id ? { ...application, stage } : application)),
    );
  }

  function applyForJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newApplication: Application = {
      id: `app-${Date.now()}`,
      candidateName: candidateName.trim(),
      email: candidateEmail.trim(),
      jobId: selectedJob.id,
      stage: "Applied",
      resumeName: resumeName || "Uploaded resume",
      experience: experience.trim() || "Not specified",
      fitScore: 74 + Math.floor(Math.random() * 18),
      appliedAt: "Today",
    };

    setApplications((current) => [newApplication, ...current]);
    setCandidateName("");
    setCandidateEmail("");
    setResumeName("");
    setExperience("");
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1d241f]">
      <header className="border-b border-[#d9ded6] bg-white/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#214538] text-sm font-bold text-white">
              HR
            </div>
            <div>
              {/* <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#687167]">Dummy data demo</p> */}
              <h1 className="text-2xl font-semibold text-[#17201b]">HumanCapital HRM</h1>
            </div>
          </div>
          <nav className="grid grid-cols-3 rounded-md border border-[#cad1c8] bg-[#eef1eb] p-1 text-sm font-medium">
            {(Object.keys(viewLabels) as View[]).map((view) => (
              <button
                key={view}
                className={`rounded px-3 py-2 transition ${
                  activeView === view ? "bg-white text-[#174f3d] shadow-sm" : "text-[#5f675f] hover:text-[#17201b]"
                }`}
                onClick={() => setActiveView(view)}
                type="button"
              >
                {viewLabels[view]}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-md border border-[#d7ddd3] bg-white p-4">
              <p className="text-sm text-[#667064]">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#17201b]">{metric.value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 rounded-md border border-[#d7ddd3] bg-white p-4">
          <Image src="/file.svg" alt="" width={40} height={40} className="opacity-75" />
          <div>
            <p className="text-sm font-semibold text-[#17201b]">Local-only workflow</p>
            <p className="text-sm text-[#667064]">Applications, resume names, shortlists, and client views use in-memory dummy data.</p>
          </div>
        </div>
      </section>

      {activeView === "hr" && (
        <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-10 sm:px-8 xl:grid-cols-[280px_1fr]">
          <aside className="rounded-md border border-[#d7ddd3] bg-white p-4">
            <h2 className="text-lg font-semibold">Jobs</h2>
            <div className="mt-4 grid gap-3">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  className={`rounded-md border p-3 text-left transition ${
                    selectedJobId === job.id ? "border-[#1d684d] bg-[#e8f3ee]" : "border-[#dbe0d7] hover:border-[#9fa99c]"
                  }`}
                  onClick={() => setSelectedJobId(job.id)}
                  type="button"
                >
                  <span className="block text-sm font-semibold">{job.title}</span>
                  <span className="block text-xs text-[#657064]">{job.client}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="rounded-md border border-[#d7ddd3] bg-white p-4">
            <div className="flex flex-col gap-2 border-b border-[#e2e6df] pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                <p className="text-sm text-[#667064]">
                  {selectedJob.client} - {selectedJob.location} - {selectedJob.type}
                </p>
              </div>
              <p className="font-mono text-sm text-[#174f3d]">{selectedJob.salary}</p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {applications
                .filter((application) => application.jobId === selectedJob.id)
                .map((application) => (
                  <article key={application.id} className="rounded-md border border-[#dbe0d7] bg-[#fbfcfa] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#d6e8df] text-sm font-bold text-[#174f3d]">
                        {initials(application.candidateName)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold">{application.candidateName}</h3>
                        <p className="truncate text-sm text-[#667064]">{application.email}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <span className="rounded bg-white p-2 text-[#667064]">Fit: <strong className="text-[#17201b]">{application.fitScore}%</strong></span>
                      <span className="rounded bg-white p-2 text-[#667064]">Exp: <strong className="text-[#17201b]">{application.experience}</strong></span>
                    </div>
                    <p className="mt-3 truncate text-sm text-[#667064]">{application.resumeName}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stages.map((stage) => (
                        <button
                          key={stage}
                          className={`rounded px-2.5 py-1.5 text-xs font-semibold ${
                            application.stage === stage ? "bg-[#214538] text-white" : "bg-[#eef1eb] text-[#566056] hover:bg-[#dfe6dc]"
                          }`}
                          onClick={() => updateStage(application.id, stage)}
                          type="button"
                        >
                          {stage}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </section>
      )}

      {activeView === "candidate" && (
        <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form className="rounded-md border border-[#d7ddd3] bg-white p-5" onSubmit={applyForJob}>
            <h2 className="text-xl font-semibold">Apply for a job</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-medium">
                Job
                <select className="rounded-md border border-[#cbd3c8] bg-white px-3 py-2" value={selectedJobId} onChange={(event) => setSelectedJobId(event.target.value)}>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.client}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Full name
                <input className="rounded-md border border-[#cbd3c8] px-3 py-2" required value={candidateName} onChange={(event) => setCandidateName(event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Email
                <input className="rounded-md border border-[#cbd3c8] px-3 py-2" required type="email" value={candidateEmail} onChange={(event) => setCandidateEmail(event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Experience
                <input className="rounded-md border border-[#cbd3c8] px-3 py-2" placeholder="3 years" value={experience} onChange={(event) => setExperience(event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Resume
                <input
                  className="rounded-md border border-dashed border-[#9fac9a] bg-[#fbfcfa] px-3 py-2 text-sm"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => setResumeName(event.target.files?.[0]?.name ?? "")}
                />
              </label>
              <button className="rounded-md bg-[#214538] px-4 py-2.5 font-semibold text-white hover:bg-[#174f3d]" type="submit">
                Submit application
              </button>
            </div>
          </form>

          <div className="rounded-md border border-[#d7ddd3] bg-white p-5">
            <h2 className="text-xl font-semibold">Open jobs</h2>
            <div className="mt-5 grid gap-4">
              {jobs.map((job) => (
                <article key={job.id} className="rounded-md border border-[#dbe0d7] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-[#667064]">{job.client} - {job.location}</p>
                    </div>
                    <p className="font-mono text-sm text-[#174f3d]">{job.salary}</p>
                  </div>
                  <p className="mt-3 text-sm text-[#536057]">{job.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span key={skill} className="rounded bg-[#eef1eb] px-2 py-1 text-xs font-semibold text-[#526056]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeView === "client" && (
        <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
          <div className="rounded-md border border-[#d7ddd3] bg-white p-5">
            <div className="flex flex-col gap-2 border-b border-[#e2e6df] pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Shortlisted candidates</h2>
                <p className="text-sm text-[#667064]">Only candidates moved to Shortlisted by HR appear here.</p>
              </div>
              <span className="rounded bg-[#e8f3ee] px-3 py-1 text-sm font-semibold text-[#174f3d]">{shortlisted.length} ready for client review</span>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#dbe0d7] text-[#667064]">
                    <th className="py-3 pr-4 font-semibold">Candidate</th>
                    <th className="py-3 pr-4 font-semibold">Job</th>
                    <th className="py-3 pr-4 font-semibold">Experience</th>
                    <th className="py-3 pr-4 font-semibold">Fit</th>
                    <th className="py-3 pr-4 font-semibold">Resume</th>
                    <th className="py-3 font-semibold">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {shortlisted.map((application) => {
                    const job = findJob(jobs, application.jobId);

                    return (
                      <tr key={application.id} className="border-b border-[#edf0eb]">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded bg-[#d6e8df] text-xs font-bold text-[#174f3d]">
                              {initials(application.candidateName)}
                            </span>
                            <span>
                              <strong className="block">{application.candidateName}</strong>
                              <span className="text-[#667064]">{application.email}</span>
                            </span>
                          </div>
                        </td>
                        <td className="py-4 pr-4">{job?.title ?? "Unknown role"}</td>
                        <td className="py-4 pr-4">{application.experience}</td>
                        <td className="py-4 pr-4 font-mono text-[#174f3d]">{application.fitScore}%</td>
                        <td className="py-4 pr-4">{application.resumeName}</td>
                        <td className="py-4">{application.appliedAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
