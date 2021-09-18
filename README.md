# Deploying a PERN app to AWS EC2
## Introduction
This is a guide to setup a PostgreSQL, Express, React, Node full stack web application to an AWS EC2 instance running an Amazon Linux AMI 2. The setup will use PM2 as a cluster manager and NGINX as a reverse proxy. We will use RDS to deply the PSQL database.

We will need to understand what the following are:
* Virtual private cloud (VPC) — A virtual network dedicated to your AWS account that you can deploy AWS resources into and have all your resources contained in one virtual place.

* Subnet — A range of IP addresses in your VPC.

* Route table — A set of rules, called routes, that are used to determine where network traffic is directed.

* Internet gateway — A gateway that you attach to your VPC to enable communication between resources in your VPC and the internet.

* VPC endpoint — Enables you to privately connect your VPC to supported AWS services and VPC endpoint services powered by PrivateLink without requiring an internet gateway, NAT device, VPN connection, or AWS Direct Connect connection. Instances in your VPC do not require public IP addresses to communicate with resources in the service. Traffic between your VPC and the other service does not leave the Amazon network. For more information, see AWS PrivateLink and VPC endpoints.

* CIDR block —Classless Inter-Domain Routing. An internet protocol address allocation and route aggregation methodology. For more information, see Classless Inter-Domain Routing in Wikipedia.

_Source: https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html_

## 1. Setting up the VPC and Subnets

The following steps require working from the AWS Management Console.

**1.1. Create a new VPC**

* Choose a meaningful name for the new VPC
* Give a CIDR block e.g. 10.11.0.0/16
* Choose 'No IPv6 CIDR block'
* Set tenancy to 'Default'

In the example above, 10.11.0.0/16 is a CIDR block where the first 2 bytes (10.11) are the network prefix and the last 2 bytes (0.0) are unsued and can be used to create private host addresses that can be assigned to different resources within the VPC. The /16 is a subnet mask which indicates that 2 bytes or 16 bits are available as ip addresses for the VPC. Since each byte is 8 bits (which is either a 0 or a 1, and which can also be called an octet), that means there are 2^8 = 256 combinations available per byte/octet. This means that there are 256 * 256 = 65,536 IP addresses are usable by the new VPC. Since computers count from 0, each octet can be a number between 0 to 255.

Note that the /16 subnet mask denotes the number of bits that are in use as the network prefix. Since there are 4 octets per IPv4 address, this means there are 32 bits in total. Hence, the /16 - which is half of the 32 total bits - implies that 16 bits are in use as the network prefix, so the remaining 16 bits are available to the subnet to be used as local host addresses.

**1.2. Create new subnets**

* 1 public subnet which will contain our web server and be accessible over the internet
* 2 private subnets which will contain our PSQL database and will not be accessible over the internet

Create the first subnet as the public subnet. It does not need a preference for its Availability Zone.

The second and third subnets will be private and require Availability Zone preferences that differ from each other. This is because the RDS PostgreSQL database that we will use later requires two subnets to be set up.

Subnets are simply sub networks within a wider network, in this case, the VPC. Subnetting is used to divide up the VPC for performance and security reasons To differentiate each subnet, they must have differing IPv4 addresses local to the VPC. We know that the last octets are available as the host address, so the subnet 1 can use 10.11.1.0/24, subnet 2 can use 10.11.2.0/24, and subnet 3 can use 10.11.3.0/24. Since there is one octet unsed by the subnets we just created (notice the .0/24), this means that within each subnet, 256 other local IP addresses can be used (e.g. 10.11.X.0 to 10.11.X.255).

Our web server and database will be able to communicate with each other through a route table.

## 2. Setting up the production build
```javascript
console.log("hello");
```

```bash
npm run build
```

## 3. Launch a cloud computer with AWS EC2

## 4. Setting up a PostgreSQL database on AWS

## 5. Deploying the app to AWS

## 6. Running the app with PM2
```bash
npm install pm2 -g
```

```bash
pm2 start [FILE.js]
```

## 7. Nginx (reverse proxy) production setup

## 8. Terminating AWS resources (to avoid costs)

