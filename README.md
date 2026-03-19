# Containerized Web Application with PostgreSQL using Docker Compose and Macvlan

## Overview

This project demonstrates a **containerized backend web application** using Docker.
It includes a **backend API and PostgreSQL database**, orchestrated with **Docker Compose** and connected through a strict **Macvlan network with static IP addresses**.

The project also demonstrates **Docker image optimization techniques**, comparing:

* Optimized build (Alpine + Multi-stage)
* Non-optimized build (Standard images)

This project fulfills the requirements of the **Containerization and DevOps assignment**.

---

# Architecture

```text
Client (Throwaway Alpine Container on LAN)
      │
      ▼
Backend API Container (Node.js + Express)
192.168.10.201
      │
      ▼
PostgreSQL Container
192.168.10.200


containerized-web-app
│
├── backend
│   ├── Dockerfile
│   ├── server.js
│   ├── package.json
│   └── .dockerignore
│
├── database
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```
##Technology Stack
Backend: Node.js + Express

Database: PostgreSQL 15

Containerization: Docker

Orchestration: Docker Compose

Networking: Macvlan

Docker Image OptimizationThe project demonstrates Docker optimization techniques:Optimized BuildAlpine base images (node:18-alpine, postgres:15-alpine)Multi-stage builds (for the backend)Non-root user (USER node)Minimal layers & .dockerignore utilizedNon-Optimized BuildStandard images (e.g., node:18, postgres:15)
Single stage buildsLarger image sizes containing unnecessary OS utilitiesCreate Network (Required)Create the Macvlan network manually (bypassing compose) for the physical host attachment:Bashdocker network create -d macvlan \

  --subnet=192.168.10.0/24 \
  --gateway=192.168.10.1 \
  -o parent=eth0 \
  custom_macvlan

  
Verify:Bashdocker network inspect custom_macvlan


Build and Run the ApplicationBuild ContainersBashdocker-compose up -d --build


Check Running ContainersBashdocker ps


Container IP AddressesPostgreSQL: 192.168.10.200Backend: 192.168.10.201API EndpointsHealth CheckGET /healthBashdocker run --rm --network custom_macvlan alpine/curl [http://192.168.10.201:3000/health](http://192.168.10.201:3000/health)
Response:JSON{
  "status": "healthy",
  "timestamp": "2026-03-16T..."
}


Insert RecordPOST /recordsBashdocker run --rm --network custom_macvlan alpine/curl -X POST [http://192.168.10.201:3000/records](http://192.168.10.201:3000/records) -H "Content-Type: application/json" -d '{"data":"Testing volume persistence!"}'
Fetch RecordsJSON[
 {
  "id": 1,
  "data": "Testing volume persistence!",
  "created_at": "2026-03-16T..."
 }
]


Volume Persistence TestCheck named volume creation:Bashdocker volume ls


Insert data using the POST command above. Stop and destroy containers:Bashdocker-compose down


Restart containers:Bashdocker-compose up -d


Image Size ComparisonImage TypeBase Image UsedApproximate Standard SizeOptimized SizeSize ReductionBackend APInode:18-alpine (Multi-stage)~1.1 GB (node:18)~150 MB~86%Databasepostgres:15-alpine~400 MB (postgres:15)~250 MB~37%Macvlan vs Ipvlan ComparisonFeatureMacvlanIpvlanMAC AddressUnique per containerShared with HostHost communicationBlocked by defaultAllowedIsolationTrue Layer 2 identityL2 or L3 endpointsBest Use CaseLAN device simulationStrict switch port rules

Author
Shubham Singh Mewada
B.Tech CSE
500122421
