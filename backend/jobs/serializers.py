from rest_framework import serializers
from .models import Job, JobStatus


class JobSerializer(serializers.ModelSerializer):
    current_status = serializers.CharField(read_only=True)

    class Meta:
        model = Job
        fields = ["id", "name", "created_at", "updated_at", "current_status"]


class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ["id", "name", "created_at", "updated_at"]

    def validate_name(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("Job name cannot be empty.")
        return value.strip()

    def create(self, validated_data):
        job = Job.objects.create(**validated_data)
        JobStatus.objects.create(job=job, status_type=JobStatus.StatusType.PENDING)
        return job


class JobStatusUpdateSerializer(serializers.Serializer):
    status_type = serializers.ChoiceField(choices=JobStatus.StatusType.choices)
