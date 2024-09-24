pipeline {
    agent any

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

        // Docker network
        NETWORK_NAME = 'project-network'
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
                    sh 'sudo docker build -t ${FRONTEND_IMAGE} ./FrontEnd'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    // Build the backend Docker image from the backend folder
                    sh 'sudo docker build -t ${BACKEND_IMAGE} ./backend'
                }
            }
        }

        stage('Build MySQL Docker Image') {
            steps {
                script {
                    // Build the MySQL Docker image from the mysql folder
                    sh 'sudo docker build -t ${MYSQL_IMAGE} ./mysql'
                }
            }
        }
    }

    post {
        always {
            script {
                // Clean up dangling images and containers
                sh 'sudo docker system prune -f'
            }
        }
    }
}
