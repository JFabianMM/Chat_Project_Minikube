# These are the steps to run the chat app 
# in minikube.

# ------------------------------------
# Enter to folder microserviceAuthorization
cd microserviceAuthorization
      
# Create the microservice authorization image
docker build -t authorization102:1 .

# push the image to a repository, if is dockerhub, then: 
docker tag authorization102:1 fabianmm34/chatapp:authorization102
docker push fabianmm34/chatapp:authorization102
# change the containers image in autorization.yaml file 


# ------------------------------------
# Enter to folder microserviceBackend
cd microserviceBackend
      
# Create the microservice backend image
docker build -t backend102:1 .

# push the image to a repository, if is dockerhub, then: 
docker tag backend102:1 fabianmm34/chatapp:backend102
docker push fabianmm34/chatapp:backend102
# change the containers image in backend.yaml file 

# ------------------------------------
# Enter to folder microserviceGraphql
cd microserviceGraphql     
	
# Create the microservice graphql image
docker build -t graphql102:1 .

# push the image to a repository, if is dockerhub, then: 
docker tag graphql102:1 fabianmm34/chatapp:graphql102
docker push fabianmm34/chatapp:graphql102
# change the containers image in graphql.yaml file 

# ------------------------------------
# Enter to the file microserviceFrontend
cd microserviceFrontend  

# Create the microserviceFrontend image
npm run webpack
docker build -t frontend102:1 .

# push the image to a repository, if is dockerhub, then: 
docker tag frontend102:1 fabianmm34/chatapp:frontend102
docker push fabianmm34/chatapp:frontend102
# change the containers image in frontend.yaml file 

# ------------------------------------

The next part is only for minikube

# start minikube
minikube start 

# Add an add-on        
minikube addons enable ingress
minikube addons enable ingress-dns        	


# Apply the next manifests:
kubectl apply -f general.yaml
kubectl apply -f authorization.yaml
kubectl apply -f backend.yaml 
kubectl apply -f frontend.yaml
kubectl apply -f graphql.yaml

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