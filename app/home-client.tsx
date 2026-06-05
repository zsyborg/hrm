"use client";

import React, { useState } from "react";

type PortalView = "admin" | "client" | "candidate";

type Stage = "APPLIED" | "SOURCED" | "INTERVIEWED" | "SHORTLISTED" | "PLACED";

interface JobOrder {
  id: string;
  clientCompanyId: string;
  title: string;
  description: string;
  skillsRequired: string[];
  vacanciesCount: number;
}

interface Application {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobOrderId: string;
  stage: Stage | string;
  jobOrder?: JobOrder;
}

// Portal 1: HR Manager Admin Dashboard & Kanban
function AdminDashboard({
  applications,
  onDrop,
}: {
  applications: Application[];
  onDrop: (id: string, stage: Stage) => void;
}) {
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDraggedAppId(id);

  const handleDrop = (stage: Stage) => {
    if (draggedAppId) {
      onDrop(draggedAppId, stage);
    }
    setDraggedAppId(null);
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
          <div className="text-2xl font-bold">{applications.length}</div>
          <div className="text-slate-300">Total Candidates</div>
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-6 shadow">
          <div className="text-2xl font-bold">N/A</div>
          <div className="text-slate-300">Active Job Orders</div>
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-6 shadow">
          <div className="text-2xl font-bold">{applications.filter((a) => a.stage === "SHORTLISTED").length}</div>
          <div className="text-slate-300">Shortlisted</div>
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-6 shadow">
          <div className="text-2xl font-bold">{applications.filter((a) => a.stage === "PLACED").length}</div>
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
function ClientPortal({ jobOrders, onSubmit }: { jobOrders: JobOrder[]; onSubmit: (data: { title: string; description: string; skillsRequired: string[]; vacanciesCount: number }) => void }) {
  const [title, setTitle] = useState("");
  const [vacancies, setVacancies] = useState(1);
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [jobs, setJobs] = useState(jobOrders);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      skillsRequired: skills.split(",").map((s) => s.trim()).filter(Boolean),
      vacanciesCount: vacancies,
    });
    setTitle("");
    setVacancies(1);
    setSkills("");
    setDescription("");
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
                  {job.skillsRequired?.map((skill) => (
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
function CandidatePortal({ applications }: { applications: Application[] }) {
  const steps = [
    { label: "Profile Info", key: "profile" },
    { label: "Identity Upload", key: "identity" },
    { label: "Contract Signing", key: "contract" },
  ];
  const [activeStep, setActiveStep] = useState(0);

  const currentStage = applications[0]?.stage ?? "APPLIED";
  const stageIndex = ["APPLIED", "SOURCED", "INTERVIEWED", "SHORTLISTED", "PLACED"].indexOf(currentStage as string);

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
                <div className="font-semibold text-lg">{app.jobOrder?.title}</div>
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

// Root Router Controller - Client Component
export default function HomePage({
  applications,
  jobOrders,
}: {
  applications: Application[];
  jobOrders: JobOrder[];
}) {
  const [activeView, setActiveView] = useState<PortalView>("admin");
  const [apps, setApps] = useState(applications);
  const [jobs, setJobs] = useState(jobOrders);

  const handleStageUpdate = async (id: string, newStage: Stage) => {
    const { updateApplicationStageAction } = await import("./actions/server-actions");
    await updateApplicationStageAction(id, newStage);
    setApps(apps.map((a) => (a.id === id ? { ...a, stage: newStage } : a)));
  };

  const handleJobCreate = async (data: { title: string; description: string; skillsRequired: string[]; vacanciesCount: number }) => {
    const { createJobOrderAction } = await import("./actions/server-actions");
    const result = await createJobOrderAction({
      clientCompanyId: "demo-company-id",
      ...data,
    });
    setJobs([...jobs, { id: result.id, clientCompanyId: "demo-company-id", ...data }]);
  };

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
      {activeView === "admin" && <AdminDashboard applications={apps} onDrop={handleStageUpdate} />}
      {activeView === "client" && <ClientPortal jobOrders={jobs} onSubmit={handleJobCreate} />}
      {activeView === "candidate" && <CandidatePortal applications={apps.filter((a) => a.candidateEmail === "demo@candidate.com")} />}
    </div>
  );
}