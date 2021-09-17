# Deploying a PERN app to AWS

## 1. Setting up VPC and Subnets
1.1. Set up a new VPC with a meaningful name and a CIDR block. 

For example, we can use the CIDR block 10.11.0.0/16 where the first 2 octets (10.11) are the network prefix and the last 2 octets (0.0) are unsued and can be used to create private host addresses that can be assigned to different resources within the VPC. The /16 indicates that 2 octets or 16 bits are available to create private IP addresses.

1.1.1. Choose 'No IPv6 CIDR block', and 'Default' for Tenancy.

1.2. Set up three new subnets.
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

