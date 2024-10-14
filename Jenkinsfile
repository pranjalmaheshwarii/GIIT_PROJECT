pipeline {
    agent any

    triggers {
        // This triggers the pipeline when a GitHub pull request is merged
        githubPush()
    }

    environment {
        // GitHub repository
        GITHUB_REPO = 'https://github.com/pranjalmaheshwarii/GIIT_PROJECT.git'

        // Docker Hub credentials (you must configure these credentials in Jenkins)
        DOCKER_HUB_REPO = 'pranjal5273'
        DOCKER_HUB_CREDENTIALS = 'docker-hub-credentials'  // Set this in Jenkins credentials manager

        // Docker image names
        FRONTEND_IMAGE = 'pranjal5273/frontend'
        BACKEND_IMAGE = 'pranjal5273/backend'
        MYSQL_IMAGE = 'pranjal5273/mysql-db'

        // GCP service account key
        GCP_SERVICE_ACCOUNT_KEY = credentials('gcp-service-account-key') // Your GCP service account key credential ID
    }

    stages {
        stage('Clone GitHub Repository') {
            steps {
                // Clone the repository from GitHub
                git url: "${GITHUB_REPO}", branch: 'main'
            }
        }

        stage('Authenticate with Google Cloud') {
            steps {
                script {
                    // Write the service account key to a file securely
                    withCredentials([file(credentialsId: 'gcp-service-account-key', variable: 'GCP_KEY_FILE')]) {
                        sh 'gcloud auth activate-service-account --key-file=$GCP_KEY_FILE'
                        sh 'gcloud config set project wide-factor-429605-v2'
                        sh 'gcloud container clusters get-credentials my-clutster --zone us-central1-a --project wide-factor-429605-v2'
                    }
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    // Build the Docker image for the frontend
                    sh "docker build -t ${FRONTEND_IMAGE} ./FrontEnd"
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    // Build the Docker image for the backend
                    sh "docker build -t ${BACKEND_IMAGE} ./backend"
                }
            }
        }

        stage('Build MySQL Docker Image') {
            steps {
                script {
                    // Build the Docker image for MySQL
                    sh "docker build -t ${MYSQL_IMAGE} ./mysql"
                }
            }
        }

        stage('Push Docker Images to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDENTIALS, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                    }

                    // Push the images to Docker Hub
                    sh "docker push ${FRONTEND_IMAGE}"
                    sh "docker push ${BACKEND_IMAGE}"
                    sh "docker push ${MYSQL_IMAGE}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Deploy the frontend, backend, and MySQL to Kubernetes
                    sh 'kubectl apply -f frontend-deployment.yaml'
                    sh 'kubectl apply -f backend-deployment.yaml'
                    sh 'kubectl apply -f mysql-deployment.yaml'
                }
            }
        }

        stage('Check Deployment Status') {
            steps {
                script {
                    // Check the status of the deployments, pods, and services
                    sh 'kubectl get deployments'
                    sh 'kubectl get pods'
                    sh 'kubectl get services'
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            // The GCP key file is handled securely by Jenkins and automatically cleaned up
        }
        success {
            echo 'Deployment completed successfully.'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
