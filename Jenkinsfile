pipeline {
    agent any

    environment {
        // Define the GCP Artifact Registry URL and credentials
        DOCKER_REGISTRY = 'us-central1-docker.pkg.dev/wide-factor-429605-v2/nodeapp'
        GCP_PROJECT_ID = 'wide-factor-429605-v2'
        GCS_BUCKET = 'bucket2607'
        SERVICE_ACCOUNT_FILE = 'gcp-service-account-key.json' // Name of the file to save the key
        GCS_FILE_PATH = "gs://${GCS_BUCKET}/wide-factor-429605-v2-fdb5639c55b6.json"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/pranjalmaheshwarii/GIIT_PROJECT.git'
            }
        }

        stage('Download GCP Service Account Key') {
            steps {
                script {
                    // Download the service account JSON key from GCS
                    sh "gsutil cp ${GCS_FILE_PATH} ${SERVICE_ACCOUNT_FILE}"
                }
            }
        }

        stage('Authenticate with GCP') {
            steps {
                script {
                    // Authenticate with GCP using the downloaded service account key
                    sh 'gcloud auth activate-service-account --key-file=${SERVICE_ACCOUNT_FILE}'
                    sh 'gcloud config set project ${GCP_PROJECT_ID}'
                    
                    // Configure Docker to use the GCP Artifact Registry
                    sh 'gcloud auth configure-docker us-central1-docker.pkg.dev'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build the Docker images
                    sh 'docker build -t ${DOCKER_REGISTRY}/frontend-app:latest FrontEnd/'
                    sh 'docker build -t ${DOCKER_REGISTRY}/backend-app:latest backend/'
                    sh 'docker build -t ${DOCKER_REGISTRY}/mysql-container:latest mysql/'
                }
            }
        }

        stage('Run Docker Containers') {
            steps {
                script {
                    // Stop and remove existing containers if they exist
                    sh 'docker rm -f frontend-app || true'
                    sh 'docker rm -f backend-app || true'
                    sh 'docker rm -f mysql-container || true'

                    // Run new containers
                    sh 'docker run -d --name frontend-app -p 5000:5000 ${DOCKER_REGISTRY}/frontend-app:latest'
                    sh 'docker run -d --name backend-app -p 8000:8000 ${DOCKER_REGISTRY}/backend-app:latest'
                    sh 'docker run -d --name mysql-container -e MYSQL_ROOT_PASSWORD=Pranjal2607!@ -p 3306:3306 ${DOCKER_REGISTRY}/mysql-container:latest'
                }
            }
        }

        stage('Push Docker Images to GCP Artifact Registry') {
            steps {
                script {
                    // Push the Docker images
                    sh 'docker push ${DOCKER_REGISTRY}/frontend-app:latest'
                    sh 'docker push ${DOCKER_REGISTRY}/backend-app:latest'
                    sh 'docker push ${DOCKER_REGISTRY}/mysql-container:latest'
                }
            }
        }
    }

    post {
        always {
            cleanWs() // Clean workspace after build
        }
    }
}
