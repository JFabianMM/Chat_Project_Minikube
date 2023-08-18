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
minikube addons enable ingress
minikube addons enable ingress-dns        	


# Apply the next manifests:
kubectl create -f secret.yaml
kubectl apply -f service1.yaml
kubectl apply -f service2.yaml
kubectl apply -f service3.yaml
kubectl apply -f mongodb1.yaml
kubectl apply -f mongodb2.yaml
kubectl apply -f mongodb3.yaml
kubectl apply -f authorization.yaml
kubectl apply -f backend.yaml 
kubectl apply -f frontend.yaml
kubectl apply -f graphql.yaml
kubectl apply -f ingress.yaml

# Add the following line to the bottom of the /etc/hosts file on your computer (you will need administrator access):
# nano /etc/hosts 
# 127.0.0.1       chat-app.fabian

# Run a tunnel
minikube tunnel


Access to the app at:
http://chat-app.fabian/

Some of the environment variables are:

API description:
    - URL: process.env.BACKEND_MICROSERVICE+'login'           
      Description: Request all the user information
    - URL: process.env.BACKEND_MICROSERVICE+'contact'
      Description: Request all the contacts of the user
    - URL: process.env.BACKEND_MICROSERVICE+'notification'
      Description: Request the information of the notifications. These notifications are
        the contact requests received. The information of these notifications are
        the ID's of the requesters. 
    - URL: process.env.BACKEND_MICROSERVICE+'groupnotifications'
      Description: Request the information of the group notifications. These notifications are
        the groups requests received. The information of these notifications are
        the groups informations. The members, etc. 
    - URL: process.env.BACKEND_MICROSERVICE+'groups'
      Description: Request the information of all the groups that the user belongs.  
    - URL: process.env.BACKEND_MICROSERVICE+'register'
      Description: Make the regustration. (Create a new user).
    - URL: process.env.BACKEND_MICROSERVICE+'newnotification'
      Description: When a user receive a new contact request notification.    
    - URL: process.env.BACKEND_MICROSERVICE+'newcontact'
      Description: Create a new contact 
    - URL: process.env.BACKEND_MICROSERVICE+'notificationdeletion'
      Description: Delete a notification
    - URL: process.env.BACKEND_MICROSERVICE+'newgroup'
      Description: Create a new group
    - URL: process.env.BACKEND_MICROSERVICE+'groupnotificationdeletion'
      Description: Delete a group notification
    - URL: process.env.BACKEND_MICROSERVICE+'groupandnotifications'
      Description: Create a new group and create new group notification for each member.
    - URL: process.env.BACKEND_MICROSERVICE+'newmessage'
      Description: Create a new message
    - URL: process.env.BACKEND_MICROSERVICE+'newstatus'
      Description: The satus is the notification of a new message that has not been read. This create a new status   
    - URL: process.env.AUTHORIZATION_MICROSERVICE+'validation'
      Description: Validate the credentials
    - URL: process.env.AUTHORIZATION_MICROSERVICE+'login'
      Description: Create the credentials for this new login  
    - URL: process.env.AUTHORIZATION_MICROSERVICE+'register' 
      Description: When is created the user, this create a new user registration on the Authorizartion microservice.