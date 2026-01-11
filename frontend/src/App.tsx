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

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "date-newest"
  | "date-oldest"
  | "status";

const sortOptionToOrdering: Record<SortOption, string> = {
  "date-newest": "-created_at",
  "date-oldest": "created_at",
  "name-asc": "name",
  "name-desc": "-name",
  status: "current_status"
};

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<JobStatusType | "ALL">(
      "ALL"
    );
    const [sortBy, setSortBy] = useState<SortOption>("date-newest");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getJobs(page, pageSize, filterStatus, sortOptionToOrdering[sortBy]);
      setJobs(data.results ?? []);
      const count = data.count ?? 0;
      setTotalJobs(count);
      setTotalPages(Math.max(1, Math.ceil(count / pageSize)));
    } catch (e: any) {
      setError(e?.message ?? "Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filterStatus, sortBy]);

    const handleFilterChange = useCallback((next: JobStatusType | "ALL") => {
      setFilterStatus(next);
      fetchJobs();
    }, []);

    const handleSortChange = useCallback((next: SortOption) => {
      setPage(1);
      setSortBy(next);
      fetchJobs();
    }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCreateJob = useCallback(async (name: string) => {
    setError(null);
    try {
      await createJob(name);
      await fetchJobs();
      setPage(1);
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
            totalPages={totalPages}
            totalJobs={totalJobs}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            filterStatus={filterStatus}
            onFilterStatusChange={handleFilterChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </Stack>
      </Box>
    </Box>
  );
}
