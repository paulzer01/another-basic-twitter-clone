# Deploying a PERN app to an AWS
## Introduction
This will be a guide to setup a PostgreSQL, Express, React, Node full stack web application to an AWS EC2 instance running an Amazon Linux AMI 2. The setup will use PM2 as a cluster manager and NGINX as a reverse proxy. We will use RDS to deply the PSQL database.

## 1. Setting up the VPC and Subnets
**1.1. Create a new VPC**

* Choose a meaningful name for the new VPC
* Give a CIDR block e.g. 10.11.0.0/16
* Choose 'No IPv6 CIDR block'
* Set tenancy to 'Default'

In the example above, 10.11.0.0/16 is a CIDR block where the first 2 octets (10.11) are the network prefix and the last 2 octets (0.0) are unsued and can be used to create private host addresses that can be assigned to different resources within the VPC. The /16 is a subnet mask which indicates that 2 octets or 16 bits worth of ip addresses are available to the subnet. Since each octet is 8 bytes (which is either a 0 or a 1), that means there are 2^8 = 256 combinations available per octet. This means that there are 256 * 256 = 65,536 IP addresses are usable by the new VPC. Since computers count from 0, each octet can be a number between 0 to 255.

Note that the /16 denotes the number of bytes that are in use as the network prefix. Since there are 4 octets per IPv4 address, this means there are 32 bytes in total. Hence, the /16 - which is half of the 32 total bytes - implies that 16 bytes are in use as the network prefix, so the remaining 16 bytes are available to use as host addresses.

**1.2. Create new subnets**

* 1 public subnet which will contain our web server
* 2 private subnets which will contain our PSQL database

The first subnet will be public and does not need a preference for its Availability Zone.
The second and third subnets will be private and require Availability Zone preferences that differ from each other. This is because the PostgreSQL database that will be set up later requires two subnets

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

