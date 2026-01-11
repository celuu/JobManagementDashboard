
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Spinner,
  Text,
} from "@chakra-ui/react";

type StatusHistoryItem = {
  id: string;
  status: string;
  changed_at: string;
};

export function StatusHistoryAccordion({ jobId }: { jobId: number }) {
  const [openIndex, setOpenIndex] = useState<number | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<StatusHistoryItem[] | null>(null);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const isOpen = openIndex === 0;
    if (!isOpen) return;

    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        // christine need to update the api once i create it 
        const res = await fetch(`/api/jobs/${jobId}/status-history`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = (await res.json()) as StatusHistoryItem[];

        setHistory(data);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError(e?.message ?? "Failed to load status history");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [openIndex, jobId]);

  return (
    <Accordion
      allowToggle
      index={openIndex}
      onChange={(idx) =>
        setOpenIndex(typeof idx === "number" ? idx : undefined)
      }
    >
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            Status History
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel pb={4}>
          {loading && <Spinner />}
          {error && <Text color="red.500">{error}</Text>}
          {!loading && !error && history?.length === 0 && (
            <Text>No status history yet.</Text>
          )}
          {!loading &&
            !error &&
            history?.map((h) => (
              <Box key={h.id} py={1}>
                <Text fontWeight="semibold">{h.status}</Text>
                <Text fontSize="sm" opacity={0.7}>
                  {new Date(h.changed_at).toLocaleString()}
                </Text>
              </Box>
            ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
