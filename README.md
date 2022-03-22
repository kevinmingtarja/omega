# omega
An online IDE. Coming soon.

## High Level Overview

### Components:
- 1x master node
- 1x manager node for each EC2 instance, containing one or more containers
- 1x worker node for each container, which runs a websocket server for communication with the client
- 1x Redis that stores two things:
   - {subdomain name: container’s port number} pairs
   - A sorted set of {EC2 instance’s IP address: number of containers} inside pairs, for `O(1)` querying time complexity
- 1x dynamic DNS server to map each subdomain to the correct EC2 instance. Runs both a UDP and HTTP server to handle dns queries and update DNS records respectively.

### Activity Diagram:

![omega-2](https://user-images.githubusercontent.com/69668484/159426180-d1f64435-50bf-473b-b6ae-d5485da76465.png)

Assumption: Here, I assume that the best way to provision computing resources is by making it so that each EC2 instance has a fixed upper limit of how many number of containers it can have.

1. User/client creates a new session/sandbox
2. `Master` node generates a new random subdomain name for this session
3. `Master` queries Redis, and check in the sorted set, which EC2 instance has the lowest number of containers, and pick that instance
   - If all instances are at full capacity, create a new EC2 instance and add it to Redis
4. Once the `master` knows which instance to use, call the `manager` node of that instance
5. The `manager` node will:
   - Create a new Docker container at a certain port that runs a `worker` node and the template app for the user application of their choice i.e. if a user starts a React project, the default template would be a CRA app
   - Return the newly created container’s port number to the `manager`
6. `Master` node adds the new {subdomain name: container port number} pair to Redis, and call our dynamic DNS server to create a new A record that maps subdomain to the IP Address of the EC2 instance it is located at
7. Return the subdomain name and port number to the client
8. The client will connect to `subdomain.domain.com:portnumber`
9. This will make a DNS query to our dynamic DNS server which internally will query it's records and will return the correct IP address of the EC2 instance
10. The client will now be connected with its docker container in the cloud, and can now code in the browser
