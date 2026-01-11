import { useMemo } from "react";
import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { JobCard } from "./JobCard";
import type { Job, JobStatusType } from "../api/api";
import { Pagination } from "./Pagination";
import type { SortOption } from "../App";

interface JobListProps {
  jobs: Job[];
  loading: boolean;
  statusOptions: JobStatusType[];
  onStatusChange: (jobId: number, status: JobStatusType) => void;
  onDelete: (jobId: number) => void;
  totalPages: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  totalJobs: number;
  filterStatus: JobStatusType | "ALL";
  onFilterStatusChange: (value: JobStatusType | "ALL") => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}


export function JobList({
  jobs, loading, statusOptions, onStatusChange, onDelete, totalPages, totalJobs, page, pageSize, onPageChange, filterStatus, onFilterStatusChange, sortBy, onSortChange }: JobListProps) {

  const sortedJobs = useMemo(() => {

    const jobsCopy = [...jobs];

    switch (sortBy) {
      case "name-asc":
        return jobsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return jobsCopy.sort((a, b) => b.name.localeCompare(a.name));
      case "date-newest":
        return jobsCopy.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "date-oldest":
        return jobsCopy.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "status":
        return jobsCopy.sort((a, b) => {
          const statusOrder: Record<string, number> = {
            RUNNING: 0,
            PENDING: 1,
            COMPLETED: 2,
            FAILED: 3,
          };
          const statusA = a.current_status || "PENDING";
          const statusB = b.current_status || "PENDING";
          return statusOrder[statusA] - statusOrder[statusB];
        });
      default:
        return jobsCopy;
    }
  }, [jobs, sortBy, filterStatus]);

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="xl"
      p={5}
      width="100%"
    >
      <Flex align="center" mb={4} gap={3} wrap="wrap">
        <Heading size="sm">Jobs</Heading>
        {!loading && jobs.length > 0 && (
          <Text fontSize="sm" color="gray.500" fontWeight="500">
            ({sortedJobs.length} of {totalJobs})
          </Text>
        )}
        <Spacer />
        {!loading && totalPages > 0 && (
          <HStack spacing={4} wrap="wrap">
            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.600" fontWeight="500">
                Filter:
              </Text>
              <Select
                size="sm"
                value={filterStatus}
                onChange={(e) =>
                  onFilterStatusChange(e.target.value as JobStatusType | "ALL")
                }
                width="auto"
                minW="140px"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="RUNNING">Running</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </Select>
            </HStack>

            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.600" fontWeight="500">
                Sort:
              </Text>
              <Select
                size="sm"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                width="auto"
                minW="160px"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
              >
                <option value="date-newest">Newest First</option>
                <option value="date-oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="status">Status</option>
              </Select>
            </HStack>
          </HStack>
        )}
        {loading && (
          <Text fontSize="sm" color="gray.500">
            Loading…
          </Text>
        )}
      </Flex>

      {!loading && jobs.length === 0 ? (
        <Text color="gray.600">No jobs yet. Create one above.</Text>
      ) : !loading && sortedJobs.length === 0 ? (
        <Text color="gray.600">
          No jobs match the current filter. Try selecting a different status.
        </Text>
      ) : (
        <>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={{ base: 3, md: 4 }}
            width="100%"
            alignItems="stretch"
            autoRows="1fr"
          >
            {sortedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                statusOptions={statusOptions}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))}
          </Grid>
          <Pagination
            totalPages={totalPages}
            page={page}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Box>
  );
}
