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

        // Docker network
        NETWORK_NAME = 'project-network'

        // MySQL root password credential ID
        MYSQL_ROOT_PASSWORD_CREDENTIALS = 'mysql-root-password'  // Set this in Jenkins credentials manager
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

        stage('Create Docker Network') {
            steps {
                script {
                    // Create the project network if it doesn't exist
                    sh '''
                    if [ -z $(docker network ls --filter name=^${NETWORK_NAME}$ --format="{{ .Name }}") ]; then
                        docker network create ${NETWORK_NAME}
                    fi
                    '''
                }
            }
        }

        stage('Pull and Run MySQL Container') {
            steps {
                script {
                    // Pull and run MySQL container from Docker Hub, use Jenkins credentials for the password
                    withCredentials([string(credentialsId: MYSQL_ROOT_PASSWORD_CREDENTIALS, variable: 'MYSQL_ROOT_PASSWORD')]) {
                        sh '''
                        docker pull ${MYSQL_IMAGE}
                        docker run -d --name mysql-container \
                            --network ${NETWORK_NAME} \
                            -e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
                            -p 3306:3306 \
                            ${MYSQL_IMAGE}
                        '''
                    }
                }
            }
        }

        stage('Pull and Run Backend Container') {
            steps {
                script {
                    // Pull and run Backend container from Docker Hub
                    sh '''
                    docker pull ${BACKEND_IMAGE}
                    docker run -d --name backend-app \
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
                    docker pull ${FRONTEND_IMAGE}
                    docker run -d --name frontend-app \
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
            // Optionally log a message indicating the build has completed
            echo 'Pipeline completed.'
        }
    }
}
