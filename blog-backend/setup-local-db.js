/**
 * This script checks if MongoDB is running locally
 * and provides instructions if it's not
 */
const { exec } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Checking if MongoDB is running locally...");

// Helper to run commands
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

async function checkMongoDBStatus() {
  try {
    // Try to connect to MongoDB
    await runCommand('mongosh --eval "db.version()" --quiet');
    console.log("✅ MongoDB is running!");
    rl.close();
  } catch (error) {
    console.log("❌ MongoDB is not running or not installed.\n");

    console.log("Options:");
    console.log("1. Install and start MongoDB locally:");
    console.log("   - Windows: https://www.mongodb.com/try/download/community");
    console.log(
      "   - macOS: brew install mongodb-community && brew services start mongodb-community"
    );
    console.log(
      "   - Linux: sudo apt install mongodb && sudo systemctl start mongodb\n"
    );

    console.log("2. Use Docker to run MongoDB:");
    console.log(
      "   docker run --name mongodb -p 27017:27017 -d mongo:latest\n"
    );

    rl.question(
      "Would you like to try starting MongoDB with Docker now? (yes/no): ",
      async (answer) => {
        if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
          try {
            console.log("Checking if Docker is running...");
            await runCommand("docker --version");

            console.log("Starting MongoDB container...");
            try {
              await runCommand("docker start mongodb");
              console.log("✅ Existing MongoDB container started!");
            } catch (e) {
              // Container might not exist yet
              await runCommand(
                "docker run --name mongodb -p 27017:27017 -d mongo:latest"
              );
              console.log("✅ New MongoDB container started!");
            }
          } catch (error) {
            console.log("❌ Docker is not running or not installed.");
            console.log(
              "Please install Docker first: https://docs.docker.com/get-docker/"
            );
          }
        } else {
          console.log(
            "Please start MongoDB manually before running the application."
          );
        }
        rl.close();
      }
    );
  }
}

checkMongoDBStatus();
