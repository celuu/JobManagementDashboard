from django.db.models import OuterRef, Subquery
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Job, JobStatus
from .serializers import JobSerializer, JobCreateSerializer, JobStatusUpdateSerializer


class JobListCreateAPIView(APIView):
    def get(self, request):
        latest_status_subquery = (
            JobStatus.objects.filter(job=OuterRef("pk"))
            .order_by("-timestamp")
            .values("status_type")[:1]
        )

        jobs = Job.objects.annotate(
            current_status=Subquery(latest_status_subquery)
        ).order_by("-created_at")

        return Response(JobSerializer(jobs, many=True).data)

    def post(self, request):
        serializer = JobCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        job = serializer.save()

        # Return job with current_status included
        latest_status_subquery = (
            JobStatus.objects.filter(job=OuterRef("pk"))
            .order_by("-timestamp")
            .values("status_type")[:1]
        )
        job_with_status = Job.objects.annotate(
            current_status=Subquery(latest_status_subquery)
        ).get(pk=job.pk)

        return Response(JobSerializer(job_with_status).data, status=status.HTTP_201_CREATED)


class JobDetailAPIView(APIView):
    def patch(self, request, pk: int):
        # Ensure job exists
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        JobStatus.objects.create(job=job, status_type=serializer.validated_data["status_type"])

        # Return updated job w/ latest status
        latest_status_subquery = (
            JobStatus.objects.filter(job=OuterRef("pk"))
            .order_by("-timestamp")
            .values("status_type")[:1]
        )
        job_with_status = Job.objects.annotate(
            current_status=Subquery(latest_status_subquery)
        ).get(pk=job.pk)

        return Response(JobSerializer(job_with_status).data, status=status.HTTP_200_OK)

    def delete(self, request, pk: int):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
