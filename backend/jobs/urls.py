from django.urls import path
from .views import JobListCreateAPIView, JobDetailAPIView

urlpatterns = [
    path("jobs/", JobListCreateAPIView.as_view(), name="job-list-create"),
    path("jobs/<int:pk>/", JobDetailAPIView.as_view(), name="job-detail"),
]
