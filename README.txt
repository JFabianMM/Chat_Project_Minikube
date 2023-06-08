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
kubectl apply -f mongodb3-pod.yaml
kubectl apply -f authorization-pod.yaml
kubectl apply -f backend-pod.yaml 
kubectl apply -f frontend-pod.yaml
kubectl apply -f graphql-pod.yaml
kubectl apply -f ingress.yaml

# Add the following line to the bottom of the /etc/hosts file on your computer (you will need administrator access):
# nano /etc/hosts 
# 127.0.0.1       chat-app.fabian

# Run a tunnel
minikube tunnel


Access to the app at:
http://chat-app.fabian/

Some of the environment variables are:

For the Graphql microservice
    - name: LOGIN           
        Request all the user information
    - name: CONTACT
        Request all the contacts of the user
    - name: NOTIFICATION
        Request the information of the notifications. These notifications are
        the contact requests received. The information of these notifications are
        the ID's of the requesters. 
    - name: GROUP_NOTIFICATIONS
        Request the information of the group notifications. These notifications are
        the groups requests received. The information of these notifications are
        the groups informations. The members, etc. 
    - name: GROUPS
        Request the information of all the groups that the user belongs.  
    - name: REGISTER
        Make the regustration. (Create a new user).
    - name: NEW_NOTIFICATION
        When a user receive a new contact request notification.    
    - name: NEW_CONTACT
        Create a new contact 
    - name: NOTIFICATION_DELETION
        Delete a notification
    - name: NEW_GROUP
        Create a new group
    - name: GROUP_NOTIFICATION_DELETION
        Delete a group notification
    - name: GROUP_AND_NOTIFICATIONS
        Create a new group and create new group notification for each member.
    - name: NEW_MESSAGE
        Create a new message
    - name: NEW_STATUS
        The satus is the notification of a new message that has not been read. This create a new status   
    - name: AUTHORIZATION
        Validate the credentials
    - name: AUTHORIZATION_LOGIN
        Create the credentials for this new login  
    - name: AUTHORIZATION_REGISTER
        When is created the user, this create a new user registration on the Authorizartion microservice.