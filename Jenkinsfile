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
    }

    stages {
        stage('Clone GitHub Repository') {
            steps {
                // Clone the repository from GitHub
                git url: "${GITHUB_REPO}", branch: 'main'
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
        }
        success {
            echo 'Deployment completed successfully.'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
