export type JobStatusType = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export type Job = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  current_status: JobStatusType | null;
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    // Django debug returns HTML sometimes; keep message useful
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const getJobs = () => request<Job[]>("/api/jobs/");
export const createJob = (name: string) =>
  request<Job>("/api/jobs/", { method: "POST", body: JSON.stringify({ name }) });

export const updateJobStatus = (id: number, status_type: JobStatusType) =>
  request<Job>(`/api/jobs/${id}/`, { method: "PATCH", body: JSON.stringify({ status_type }) });

export const deleteJob = (id: number) =>
  request<void>(`/api/jobs/${id}/`, { method: "DELETE" });
