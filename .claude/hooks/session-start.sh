#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web (remote) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Install Node.js dependencies
echo "Installing npm dependencies..."
npm install

# Ensure required runtime directories exist
mkdir -p public/uploads public/generated

# Start the server if it's not already running
if ! curl -sf http://localhost:3000/api/versions > /dev/null 2>&1; then
  echo "Starting agent page server on port 3000..."
  nohup node server.js > /tmp/agentpage-server.log 2>&1 &
  SERVER_PID=$!
  echo "Server started (PID $SERVER_PID)"

  # Wait up to 10 seconds for the server to become ready
  for i in $(seq 1 10); do
    if curl -sf http://localhost:3000/api/versions > /dev/null 2>&1; then
      echo "Server is ready on port 3000"
      break
    fi
    sleep 1
  done
else
  echo "Server is already running on port 3000"
fi
