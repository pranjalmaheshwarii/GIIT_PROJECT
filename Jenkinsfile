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

        stage('Login to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub using credentials configured in Jenkins
                    sh 'echo $DOCKER_HUB_CREDENTIALS | sudo docker login -u ${DOCKER_HUB_REPO} --password-stdin'
                }
            }
        }

        stage('Push Frontend Image to Docker Hub') {
            steps {
                script {
                    // Push frontend image to Docker Hub
                    sh 'sudo docker push ${FRONTEND_IMAGE}'
                }
            }
        }

        stage('Push Backend Image to Docker Hub') {
            steps {
                script {
                    // Push backend image to Docker Hub
                    sh 'sudo docker push ${BACKEND_IMAGE}'
                }
            }
        }

        stage('Push MySQL Image to Docker Hub') {
            steps {
                script {
                    // Push MySQL image to Docker Hub
                    sh 'sudo docker push ${MYSQL_IMAGE}'
                }
            }
        }

        stage('Create Docker Network') {
            steps {
                script {
                    // Create the project network if it doesn't exist
                    sh '''
                    if [ -z $(sudo docker network ls --filter name=^${NETWORK_NAME}$ --format="{{ .Name }}") ]; then
                        sudo docker network create ${NETWORK_NAME}
                    fi
                    '''
                }
            }
        }

        stage('Pull and Run MySQL Container') {
            steps {
                script {
                    // Pull and run MySQL container from Docker Hub
                    sh '''
                    sudo docker pull ${MYSQL_IMAGE}
                    sudo docker run -d --name mysql-container \
                        --network ${NETWORK_NAME} \
                        -e MYSQL_ROOT_PASSWORD=Pranjal2607!@ \
                        -p 3306:3306 \
                        ${MYSQL_IMAGE}
                    '''
                }
            }
        }

        stage('Pull and Run Backend Container') {
            steps {
                script {
                    // Pull and run Backend container from Docker Hub
                    sh '''
                    sudo docker pull ${BACKEND_IMAGE}
                    sudo docker run -d --name backend-app \
                        --network ${NETWORK_NAME} \
                        -p 8000:8000 \
                        ${BACKEND_IMAGE}
                    '''
                }
            }
        }

        stage('Pull and Run Frontend Container') {
            steps {
                script {
                    // Pull and run Frontend container from Docker Hub
                    sh '''
                    sudo docker pull ${FRONTEND_IMAGE}
                    sudo docker run -d --name frontend-app \
                        --network ${NETWORK_NAME} \
                        -p 5000:5000 \
                        ${FRONTEND_IMAGE}
                    '''
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
