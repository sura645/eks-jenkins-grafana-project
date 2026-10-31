pipeline {

    agent any

    environment {
        DOCKER_USER = " suraj645"
        IMAGE_NAME = "devops-hello-app"
        AWS_REGION = "ap-south-1"
        EKS_CLUSTER = "devops-eks"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: ' https://github.com/sura645/eks-jenkins-grafana-project.git '
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build \
                  -t $DOCKER_USER/$IMAGE_NAME:$BUILD_NUMBER .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DH_USER',
                        passwordVariable: 'DH_TOKEN'
                    )
                ]) {
                    sh '''
                    echo "$DH_TOKEN" | docker login \
                      -u "$DH_USER" --password-stdin

                    docker push \
                      $DOCKER_USER/$IMAGE_NAME:$BUILD_NUMBER

                    docker logout
                    '''
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                aws eks update-kubeconfig \
                  --region $AWS_REGION \
                  --name $EKS_CLUSTER

                sed "s|IMAGE_PLACEHOLDER|$DOCKER_USER/$IMAGE_NAME:$BUILD_NUMBER|g" \
                  k8s/deployment.yaml | kubectl apply -f -

                kubectl apply -f k8s/service.yaml

                kubectl rollout status deployment/devops-app \
                  -n devops-app --timeout=180s
                '''
            }
        }

    }

    post {
        success {
            echo 'Application successfully deployed to EKS!'
        }

        failure {
            echo 'CI/CD pipeline failed. Check Jenkins console output.'
        }
    }
}
