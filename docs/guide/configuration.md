# Setting  Multiple Configurations in WebStorm

This guide explains how to set up configurations in WebStorm to run both the server and the Vue frontend simultaneously.



## Step 1: Configure the Server

1. Go to **Run > Edit Configurations** in WebStorm.
2. Click the **+** button to add a new configuration.
3. Select **Node.js** as the configuration type.
4. In the **JavaScript file** field, specify the path to your server file, e.g., `backend/server.js`.
5. Save the configuration by clicking **OK**.


## Step 2: Configure the Frontend

1. Repeat the steps above: go to **Run > Edit Configurations**.
2. Click the **+** button and select **npm** as the configuration type.
3. In the **Package.json file** field, provide the path to your project's `package.json` file.
4. Under **Command**, select the appropriate npm script (e.g., `run dev`).
5. Save the configuration by clicking **OK**.


## Step 3: Combine Configurations

1. Create a new compound configuration:
    - Go to **Run > Edit Configurations**.
    - Click the **+** button and select **Compound** as the configuration type.
2. Name your configuration (e.g., `Start Server and Frontend`).
3. Add the two configurations you created earlier (server and frontend) to the **Run/Debug Configurations** list.
4. Save the configuration by clicking **OK**.


## You're All Set!

Now, you can start both the server and frontend together by running the compound configuration. This simplifies your workflow and saves time during development. 🚀
