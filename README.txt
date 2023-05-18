# These are the steps to run the chat app 
# in minikube.

# ------------------------------------
# Enter to folder Authorization-microservice
cd Microservice-BackEnd
      
# Create the backend2 image
docker build -t authorization290:1 .

# push the image to a repository, if is dockerhub, then: 
docker tag authorization290:1 fabianmm34/chatapp:authorization290
docker push fabianmm34/chatapp:authorization290
# if is AWS ECR, then 
create the repository on ECR called authorization2 
docker tag authorization2:1 121503602521.dkr.ecr.us-east-2.amazonaws.com/authorization2:1
docker push 121503602521.dkr.ecr.us-east-2.amazonaws.com/authorization2:1

# ------------------------------------
# Enter to folder BackEnd-microservice
cd Microservice-BackEnd
      
# Create the backend2 image
docker build -t backend2:1 .

# push the image to a repository, if is dockerhub, then: 
docker tag backend2:1 fabianmm34/chatapp:backend2
docker push fabianmm34/chatapp:backend2
# if is AWS ECR, then 
create the repository on ECR called backend2 
docker tag backend2:1 121503602521.dkr.ecr.us-east-2.amazonaws.com/backend2:1
docker push 121503602521.dkr.ecr.us-east-2.amazonaws.com/backend2:1

# ------------------------------------
# Enter to folder UI-microservice-back
cd UI-microservice-back     
	
# Create the graphql26 image
docker build -t graphql2:1 .

# push the image to a repository, if is dockerhub, then: 
docker tag graphql2:1 fabianmm34/chatapp:graphql2
docker push fabianmm34/chatapp:graphql2   
# if is AWS ECR, then 
create the repository on ECR called graphql2 
docker tag graphql2:1 121503602521.dkr.ecr.us-east-2.amazonaws.com/graphql2:1
docker push 121503602521.dkr.ecr.us-east-2.amazonaws.com/graphql2:1

# ------------------------------------
# Enter to the file UI-microservice-front
cd UI-microservice-front    

# Create the frontend2 image
docker build -t frontend2:1 .

# push the image to a repository, if is dockerhub, then: 
docker tag frontend2:1 fabianmm34/chatapp:frontend2
docker push fabianmm34/chatapp:frontend2  
# if is AWS ECR, then 
create the repository on ECR called graphql2 
docker tag frontend2:1 121503602521.dkr.ecr.us-east-2.amazonaws.com/frontend2:1
docker push 121503602521.dkr.ecr.us-east-2.amazonaws.com/frontend2:1 

# ------------------------------------

The next part is only for minikube

# start minikube
minikube start 

# Add an add-on                	
minikube addons enable ingress-dns

# Apply the next manifests:
kubectl apply -f mongodb1-pod.yaml
kubectl apply -f mongodb2-pod.yaml
kubectl apply -f backend-pod.yaml 
kubectl apply -f frontend-pod.yaml
kubectl apply -f graphql-pod.yaml
kubectl apply -f example-ingress.yaml

# Add the following line to the bottom of the /etc/hosts file on your computer (you will need administrator access):
# nano /etc/hosts 
# 127.0.0.1       chat-app.fabian

# Run a tunnel
minikube tunnel


Access to the app at:
http://chat-app.fabian/
