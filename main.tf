provider "google" {
  project = "proud-research-428901-i9"
  region  = "us-central1"
}

resource "google_container_cluster" "assignment_cluster" {
  name               = "kubernetes-assignment"
  location           = "us-central1-a"
  initial_node_count = 1

  node_config {
    machine_type = "e2-small"
    disk_size_gb = 10
    disk_type = "pd-standard"
    image_type = "COS_CONTAINERD"
  }
}


resource "google_compute_disk" "persistent_disk" {
  name  = "disk"
  type  = "pd-standard"
  zone  = "us-central1-a" 
  size  = 10
}
