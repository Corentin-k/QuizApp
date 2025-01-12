
# Installation Guide

Welcome to the installation guide. Follow these steps to set up and run the application.

## Prerequisites

Before starting, ensure you have the following installed on your system:

1. **Node.js** 
2. **MySQL Server** 


## Step 1: Install Dependencies

To install the required dependencies for the project, open a terminal and navigate to the project directory. Then, run:

```bash
npm install
```


## Step 2: Create the Database

You need to set up a MySQL database for the backend to function. Follow these steps:

1. Open your MySQL terminal using the following command:
   ```bash
   mysql -u root -p
   ```
   Replace `root` with your MySQL username if you're not using the root account.

2. Create the database and import the schema. Run:
   ```sql
   source backend/db.sql;
   ```


## Step 3: Start the Project

### Frontend

To start the frontend development server, run:

```bash
npm run dev
```

### Backend

Open another terminal and start the backend server using:

```bash
node backend/server.js
```

---

## Optional: Unified Configuration with WebStorm

If you're using WebStorm, you can configure the IDE to start both the frontend and backend simultaneously. Check the [Configuration Guide](./configuration.md) for detailed instructions.

