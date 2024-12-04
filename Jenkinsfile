pipeline {
    agent any

    triggers {
        // Trigger the pipeline on a GitHub push
        githubPush()
    }

    environment {
        // GitHub repository
        GITHUB_REPO = 'https://github.com/pranjalmaheshwarii/GIIT_PROJECT.git'

        // Docker Hub credentials
        DOCKER_HUB_REPO = 'pranjal5273'
        DOCKER_HUB_CREDENTIALS = 'docker-hub-credentials' // Set this in Jenkins credentials manager

        // Docker image names
        FRONTEND_IMAGE = 'pranjal5273/frontend'
        BACKEND_IMAGE = 'pranjal5273/backend'
        MYSQL_IMAGE = 'pranjal5273/mysql-db'

        // Kubernetes deployment files
        FRONTEND_DEPLOYMENT = 'frontend-deployment.yaml'
        BACKEND_DEPLOYMENT = 'backend-deployment.yaml'
        MYSQL_DEPLOYMENT = 'mysql-deployment.yaml'
    }

    stages {
        stage('Clone GitHub Repository') {
            steps {
                // Clone the repository from GitHub
                git url: "${GITHUB_REPO}", branch: 'k8s-another'
            }
        }

        stage('Authenticate with Google Cloud') {
            steps {
                script {
                    // Authenticate and connect to the Kubernetes cluster
                    sh '''
                    gcloud config set project black-outlet-438804-p8
                    gcloud container clusters get-credentials my --zone us-central1 --project black-outlet-438804-p8
                    '''
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
                    sh "kubectl apply -f ${FRONTEND_DEPLOYMENT}"
                    sh "kubectl apply -f ${BACKEND_DEPLOYMENT}"
                    sh "kubectl apply -f ${MYSQL_DEPLOYMENT}"
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
