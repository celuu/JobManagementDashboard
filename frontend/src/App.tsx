import { useCallback, useEffect, useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import {
  createJob,
  deleteJob,
  getJobs,
  type Job,
  type JobStatusType,
  updateJobStatus,
} from "./api/api";
import {
  ErrorAlert,
  JobForm,
  JobList,
  PageHeader,
} from "./components";

const STATUS_OPTIONS: JobStatusType[] = [
  "PENDING",
  "RUNNING",
  "COMPLETED",
  "FAILED",
];

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setError(null);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCreateJob = useCallback(async (name: string) => {
    setError(null);
    try {
      await createJob(name);
      await fetchJobs();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create job.");
      throw e;
    }
  }, [fetchJobs]);

  const handleStatusChange = useCallback(async (jobId: number, status: JobStatusType) => {
    setError(null);
    try {
      await updateJobStatus(jobId, status);
      await fetchJobs();
    } catch (e: any) {
      setError(e?.message ?? "Failed to update status.");
    }
  }, [fetchJobs]);

  const handleDelete = useCallback(async (jobId: number) => {
    setError(null);
    try {
      await deleteJob(jobId);
      await fetchJobs();
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete job.");
    }
  }, [fetchJobs]);

  return (
    <Box minH="100vh" bg="gray.50" py={12} width="100%">
      <Box width="100%" px={12}>
        <Stack spacing={6} width="100%">
          <PageHeader
            title="Job Management Dashboard"
            description="View, create, update, and delete jobs."
          />

          <JobForm onSubmit={handleCreateJob} />

          {error && <ErrorAlert message={error} />}

          <JobList
            jobs={jobs}
            loading={loading}
            statusOptions={STATUS_OPTIONS}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </Stack>
      </Box>
    </Box>
  );
}
