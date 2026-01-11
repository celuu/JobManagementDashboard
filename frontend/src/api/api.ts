export type JobStatusType = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export type Job = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  current_status: JobStatusType | null;
};

export type PaginatedJobResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Job[];
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const getJobs = (
  page: number = 1,
  page_size: number = 20,
  status?: JobStatusType | "ALL",
  ordering?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(page_size),
  });

  if (status && status !== "ALL") params.set("status", status);
  if (ordering) params.set("ordering", ordering);

  return request<PaginatedJobResponse>(`/api/jobs/?${params.toString()}`);
};
export const createJob = (name: string) =>
  request<Job>("/api/jobs/", { method: "POST", body: JSON.stringify({ name }) });

export const updateJobStatus = (id: number, status_type: JobStatusType) =>
  request<Job>(`/api/jobs/${id}/`, { method: "PATCH", body: JSON.stringify({ status_type }) });

export const deleteJob = (id: number) =>
  request<void>(`/api/jobs/${id}/`, { method: "DELETE" });
