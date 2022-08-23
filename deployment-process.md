<h1 align="center">
  Automatic deployment setup
  <br>
</h1>

- ### Create the required folder
```bash
# ssh into the server
$ ssh -i <path/to/wagerBet.pem> ubuntu@65.1.89.209

# Create directories
$ mkdir -p ~/docker-wagerbet-rgs/logs
```

- ### Copy the required files
```bash
# Open git bash(windows) or terminal(linux/Mac) in your local and navigate to the folder where wagerbet-rgs repo is cloned, then run the below command for copying the files using SCP

# To copy .env
$ scp -i <path/to/wagerBet.pem> -Cpr .env.template ubuntu@65.1.89.209:/home/ubuntu/docker-wagerbet-rgs/.env

# To copy docker-compose.yml
$ scp -i <path/to/wagerBet.pem> -Cpr docker-compose.yml ubuntu@65.1.89.209:/home/ubuntu/docker-wagerbet-rgs/docker-compose.yml
```

- ### Make changes in .env file
```bash
# ssh into the server
# Open the .env file and put the values properly by removing the placeholders
$ nano ~/docker-wagerbet-rgs/.env

# To save and exit the nano editor, press ctrl+x then press y.

# Keep the port to 8080 in .env by default. If you need it to run on different port than 8080, then change on docker-compose file.
```

- ### Install the AWS ECR Docker [Credential Helper](https://github.com/awslabs/amazon-ecr-credential-helper)
```bash
# ssh into the server and run the below commands
$ sudo apt update
$ sudo apt install amazon-ecr-credential-helper
$ echo '{"credsStore": "ecr-login"}' | tee ~/.docker/config.json > /dev/null
```

- ### Configure the aws cli with the IAM api user, if not done already
```bash
# To check if cli credentials are configured, check the access key and secret access key is added under ~/.aws/credentials and ~/.aws/config have the region value. If any of these are missing then run the below command to configure:

# SSH into server
$ aws configure
# Follow the on screen instructions
```

- ### Create database in PostgreSQL
```bash
# ssh into the server
# Connect to psql shell (enter password when asked):
$ psql -h wagerbet-dev-db.c0wgjp7amlgu.ap-south-1.rds.amazonaws.com -p 5432 -U postgres -W

# Run the below command inside psql shell
$ CREATE DATABASE wagerbet;

# To check database is created, use the below command in psql shell to list all databases
$ \l

# Exit from psql shell
$\q
```

- ### Create github secrets
    - Create github secret for each variables below. Click [here](#how-to-create-github-action-secrets) for how to create github secrets.
    - Add the below variables one by one by clicking *New repository secret* everytime.
	```bash
	AWS_ACCESS_KEY_ID
	AWS_SECRET_ACCESS_KEY

	SSH_HOST
	SSH_USERNAME
	SSH_KEY
	SSH_PORT
	```
    #### Description of the above variables

    | Key                   | Description                                                                                                                 |
    |-----------------------|-----------------------------------------------------------------------------------------------------------------------------|
    | AWS_ACCESS_KEY_ID     | This will be IAM API user details, who will have access to AWS ECR Push and Pull                                            |
    | AWS_SECRET_ACCESS_KEY | IAM user details                                                                                                            |
    | SSH_HOST              | host IP address of the EC2 server (*65.1.89.209*)                                                                           |
    | SSH_USERNAME          | ssh user name of the EC2 server (*ubuntu*)                                                                                  |
    | SSH_KEY               | Contents of the wagerBetDev.pem file, open the file and copy everything inside it, and paste it on the SSH_KEY secret value |
    | SSH_PORT              | Port is usually *22*                                                                                                        |


- ### Once all the above steps are done, make any changes in master branch and check the github actions pipeline is running succesfully.
<h1></h1>

> **Note**
> If you want to manually pull the docker image in server, use the command:
```bash
$ cd ~/docker-wagerbet-rgs

# The docker image is tagged with the commit id which triggered the automated build, so you can put the commit ID in place of tag.
$ export IMAGE="590328391605.dkr.ecr.ap-south-1.amazonaws.com/rgs:<tag>"

$ docker compose pull
```

<br>

## How to create github action secrets
* Go to Project->Settings->Secrets->Actions and Click *New repository secret*. 

	![secrets](.github/secrets.png?raw=true)
* Add secrets like below:

	![add_secret1](.github/add_secret1.png?raw=true)