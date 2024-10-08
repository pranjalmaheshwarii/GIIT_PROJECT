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

        // Kubernetes cluster context (you might need to set this up based on your configuration)
        KUBE_CONTEXT = 'my-k8s-cluster'  // Change to your actual Kubernetes context
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
                    // Build the frontend Docker image from the FrontEnd folder
                    sh 'docker build -t ${FRONTEND_IMAGE} ./FrontEnd'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    // Build the backend Docker image from the backend folder
                    sh 'docker build -t ${BACKEND_IMAGE} ./backend'
                }
            }
        }

        stage('Build MySQL Docker Image') {
            steps {
                script {
                    // Build the MySQL Docker image from the mysql folder
                    sh 'docker build -t ${MYSQL_IMAGE} ./mysql'
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub using credentials configured in Jenkins
                    withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDENTIALS, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }
                }
            }
        }

        stage('Push Frontend Image to Docker Hub') {
            steps {
                script {
                    // Push frontend image to Docker Hub
                    sh 'docker push ${FRONTEND_IMAGE}'
                }
            }
        }

        stage('Push Backend Image to Docker Hub') {
            steps {
                script {
                    // Push backend image to Docker Hub
                    sh 'docker push ${BACKEND_IMAGE}'
                }
            }
        }

        stage('Push MySQL Image to Docker Hub') {
            steps {
                script {
                    // Push MySQL image to Docker Hub
                    sh 'docker push ${MYSQL_IMAGE}'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Set the Kubernetes context (optional, depending on your setup)
                    sh "kubectl config use-context ${KUBE_CONTEXT}"
                    
                    // Apply deployment YAML files
                    sh 'kubectl apply -f frontend-deployment.yaml'
                    sh 'kubectl apply -f backend-deployment.yaml'
                    sh 'kubectl apply -f mysql-deployment.yaml'
                }
            }
        }
    }

    post {
        always {
            // Optionally log a message indicating the build has completed
            echo 'Pipeline completed.'
        }
    }
}

