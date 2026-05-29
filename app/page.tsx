"use client";

import React, { useState, useEffect, useCallback } from "react";

// Types
type UserRole = "ADMIN" | "CLIENT" | "CANDIDATE";

interface User {
  id: string;
  email: string;
  role: UserRole;
}

interface ClientCompany {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
}

interface JobOrder {
  id: string;
  clientCompanyId: string;
  title: string;
  description: string;
  skillsRequired: string[];
  vacanciesCount: number;
}

type Stage = "APPLIED" | "SOURCED" | "INTERVIEWED" | "SHORTLISTED" | "PLACED";

interface Application {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobOrderId: string;
  stage: Stage;
}

// Helper for generating unique IDs
let jobCounter = 3;
const generateId = () => `job-${++jobCounter}`;

// Mock MongoDB Data Layer
const mockDb = {
  clientCompanies: [
    { id: "comp-1", name: "TechCorp Solutions", contactPerson: "Jane Smith", email: "contact@techcorp.com" },
    { id: "comp-2", name: "Innovate Inc", contactPerson: "John Doe", email: "contact@innovate.com" },
  ] as ClientCompany[],
  jobOrders: [
    { id: "job-1", clientCompanyId: "comp-1", title: "Senior Frontend Engineer", description: "Build responsive UI components", skillsRequired: ["React", "TypeScript", "Tailwind"], vacanciesCount: 2 },
    { id: "job-2", clientCompanyId: "comp-1", title: "Backend Developer", description: "Design scalable APIs", skillsRequired: ["Node.js", "MongoDB", "Express"], vacanciesCount: 1 },
    { id: "job-3", clientCompanyId: "comp-2", title: "Product Designer", description: "Create user-centered designs", skillsRequired: ["Figma", "UX", "Prototyping"], vacanciesCount: 3 },
  ] as JobOrder[],
  applications: [
    { id: "app-1", candidateName: "Alice Johnson", candidateEmail: "alice@example.com", jobOrderId: "job-1", stage: "APPLIED" as Stage },
    { id: "app-2", candidateName: "Bob Smith", candidateEmail: "bob@example.com", jobOrderId: "job-1", stage: "SOURCED" as Stage },
    { id: "app-3", candidateName: "Carol Davis", candidateEmail: "carol@example.com", jobOrderId: "job-2", stage: "INTERVIEWED" as Stage },
    { id: "app-4", candidateName: "David Lee", candidateEmail: "david@example.com", jobOrderId: "job-3", stage: "SHORTLISTED" as Stage },
    { id: "app-5", candidateName: "Eve Wilson", candidateEmail: "eve@example.com", jobOrderId: "job-3", stage: "PLACED" as Stage },
  ] as Application[],
};

// Server Actions (simulated with client-side mocks)
async function createJobOrderAction(formData: {
  clientCompanyId: string;
  title: string;
  description: string;
  skillsRequired: string[];
  vacanciesCount: number;
}): Promise<JobOrder> {
  try {
    const newJob: JobOrder = {
      id: generateId(),
      ...formData,
    };
    mockDb.jobOrders.push(newJob);
    return newJob;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create job order");
  }
}

async function updateApplicationStageAction(id: string, newStage: Stage): Promise<Application> {
  try {
    const app = mockDb.applications.find((a) => a.id === id);
    if (!app) throw new Error("Application not found");
    app.stage = newStage;
    return app;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update application stage");
  }
}

// Portal 1: HR Manager Admin Dashboard & Kanban
function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  const loadApplications = useCallback(() => {
    setApplications([...mockDb.applications]);
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleDragStart = (id: string) => setDraggedAppId(id);

  const handleDrop = async (stage: Stage) => {
    if (draggedAppId) {
      try {
        await updateApplicationStageAction(draggedAppId, stage);
        loadApplications();
      } catch (err) {
        console.error(err);
      }
    }
    setDraggedAppId(null);
  };

  const metrics = {
    totalCandidates: mockDb.applications.length,
    activeJobs: mockDb.jobOrders.length,
    shortlisted: mockDb.applications.filter((a) => a.stage === "SHORTLISTED").length,
    placed: mockDb.applications.filter((a) => a.stage === "PLACED").length,
  };

  const stages: Stage[] = ["APPLIED", "SOURCED", "INTERVIEWED", "SHORTLISTED", "PLACED"];
  const grouped = stages.reduce((acc, stage) => {
    acc[stage] = applications.filter((a) => a.stage === stage);
    return acc;
  }, {} as Record<Stage, Application[]>);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 text-white rounded-lg p-6 shadow">
          <div className="text-2xl font-bold">{metrics.totalCandidates}</div>
          <div className="text-slate-300">Total Candidates</div>
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-6 shadow">
          <div className="text-2xl font-bold">{metrics.activeJobs}</div>
          <div className="text-slate-300">Active Job Orders</div>
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-6 shadow">
          <div className="text-2xl font-bold">{metrics.shortlisted}</div>
          <div className="text-slate-300">Shortlisted</div>
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-6 shadow">
          <div className="text-2xl font-bold">{metrics.placed}</div>
          <div className="text-slate-300">Placed</div>
        </div>
      </div>
      <div className="flex gap-4 w-full">
        {stages.map((stage) => (
          <div
            key={stage}
            className="flex-1 bg-slate-100 rounded-lg p-4 min-h-[400px] border border-slate-200"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stage)}
          >
            <div className="font-semibold mb-2 text-slate-700">{stage}</div>
            <div className="flex flex-col gap-2">
              {grouped[stage].map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-slate-300 rounded p-3 shadow cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(app.id)}
                >
                  <div className="font-bold">{app.candidateName}</div>
                  <div className="text-xs text-slate-500">{app.candidateEmail}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Portal 2: Client Vacancy Management
function ClientPortal() {
  const [title, setTitle] = useState("");
  const [vacancies, setVacancies] = useState(1);
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [jobs, setJobs] = useState<JobOrder[]>([]);
  const [error, setError] = useState("");

  const clientCompanyId = "comp-1";

  const refreshJobs = () => setJobs(mockDb.jobOrders.filter((j) => j.clientCompanyId === clientCompanyId));

  useEffect(() => {
    refreshJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createJobOrderAction({
        clientCompanyId,
        title,
        description,
        skillsRequired: skills.split(",").map((s) => s.trim()).filter(Boolean),
        vacanciesCount: vacancies,
      });
      setTitle("");
      setVacancies(1);
      setSkills("");
      setDescription("");
      refreshJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job order");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 p-8 gap-8">
      <form onSubmit={handleSubmit} className="w-1/3 bg-white rounded-lg shadow p-6 flex flex-col gap-4 border border-slate-200">
        <h2 className="text-xl font-bold mb-2">Post New Job Order</h2>
        <input
          className="border p-2 rounded"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="number"
          min={1}
          placeholder="Vacancies"
          value={vacancies}
          onChange={(e) => setVacancies(Number(e.target.value))}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />
        <textarea
          className="border p-2 rounded"
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-indigo-600 text-white rounded p-2 font-semibold hover:bg-indigo-700">
          Create Job Order
        </button>
      </form>
      <div className="flex-1 bg-white rounded-lg shadow p-6 border border-slate-200">
        <h2 className="text-xl font-bold mb-4">Active Job Orders</h2>
        <div className="flex flex-col gap-4">
          {jobs.length === 0 ? (
            <div className="text-slate-500">No job orders found.</div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="border-b pb-3 mb-3">
                <div className="font-semibold text-lg">{job.title}</div>
                <div className="text-slate-500 text-sm mb-1">Vacancies: {job.vacanciesCount}</div>
                <div className="flex gap-2 flex-wrap mb-1">
                  {job.skillsRequired.map((skill) => (
                    <span key={skill} className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="text-slate-400 text-xs">{job.description}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Portal 3: Candidate Document & Pipeline Tracking
function CandidatePortal() {
  const steps = [
    { label: "Profile Info", key: "profile" },
    { label: "Identity Upload", key: "identity" },
    { label: "Contract Signing", key: "contract" },
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [applications, setApplications] = useState<Application[]>([]);

  const candidateEmail = "alice@example.com";

  useEffect(() => {
    const apps = mockDb.applications.filter((a) => a.candidateEmail === candidateEmail);
    setApplications(apps);
  }, []);

  const currentStage = applications[0]?.stage ?? "APPLIED";
  const stageIndex = ["APPLIED", "SOURCED", "INTERVIEWED", "SHORTLISTED", "PLACED"].indexOf(currentStage);

  return (
    <div className="flex min-h-screen bg-slate-50 p-8 gap-8">
      <div className="w-1/3 bg-white rounded-lg shadow p-6 border border-slate-200">
        <h2 className="text-xl font-bold mb-4">Onboarding Steps</h2>
        <ol className="space-y-4">
          {steps.map((step, idx) => (
            <li key={step.key} className="flex items-center gap-3">
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-white ${
                  idx === activeStep
                    ? "bg-indigo-600"
                    : idx < activeStep
                    ? "bg-green-500"
                    : "bg-slate-300"
                }`}
              >
                {idx + 1}
              </span>
              <span className={idx === activeStep ? "font-semibold" : "text-slate-500"}>{step.label}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex gap-2">
          <button
            className="bg-slate-200 px-3 py-1 rounded"
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            disabled={activeStep === 0}
          >
            Back
          </button>
          <button
            className="bg-indigo-600 text-white px-3 py-1 rounded"
            onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={activeStep === steps.length - 1}
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-lg shadow p-6 border border-slate-200">
        <h2 className="text-xl font-bold mb-4">Your Application Pipeline</h2>
        <div className="flex flex-col gap-4">
          {applications.length === 0 ? (
            <div className="text-slate-500">No active applications found.</div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="border-b pb-3 mb-3">
                <div className="font-semibold text-lg">
                  {mockDb.jobOrders.find((j) => j.id === app.jobOrderId)?.title}
                </div>
                <div className="text-slate-500 text-sm mb-2">
                  Current Stage: <span className="font-bold">{app.stage}</span>
                </div>
                <div className="flex gap-1">
                  {["APPLIED", "SOURCED", "INTERVIEWED", "SHORTLISTED", "PLACED"].map((stage, idx) => (
                    <div
                      key={stage}
                      className={`flex-1 h-2 rounded ${
                        idx <= stageIndex ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Root Router Controller
export default function HomePage() {
  const [activeView, setActiveView] = useState<"admin" | "client" | "candidate">("admin");

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-slate-800 text-white p-4 flex gap-4">
        <button
          onClick={() => setActiveView("admin")}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            activeView === "admin" ? "bg-indigo-600" : "hover:bg-slate-700"
          }`}
        >
          View as Admin
        </button>
        <button
          onClick={() => setActiveView("client")}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            activeView === "client" ? "bg-indigo-600" : "hover:bg-slate-700"
          }`}
        >
          View as Client Company
        </button>
        <button
          onClick={() => setActiveView("candidate")}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            activeView === "candidate" ? "bg-indigo-600" : "hover:bg-slate-700"
          }`}
        >
          View as Job Candidate
        </button>
      </nav>
      {activeView === "admin" && <AdminDashboard />}
      {activeView === "client" && <ClientPortal />}
      {activeView === "candidate" && <CandidatePortal />}
    </div>
  );
}