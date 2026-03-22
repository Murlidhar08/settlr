#!/bin/bash

# Usage:
#   ./db_restore.sh backupfile.sql[.gz]

# Check if filename is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <sql_filename>"
  exit 1
fi

SQL_FILE="$1"

# Check if the file exists
if [ ! -f "$SQL_FILE" ]; then
  echo "Error: File '$SQL_FILE' not found!"
  exit 1
fi

# Prompt for connection details
echo "--- PostgreSQL Connection Details ---"
read -p "Server Host (default: localhost): " PGHOST
PGHOST=${PGHOST:-localhost}

read -p "Port (default: 5432): " PGPORT
PGPORT=${PGPORT:-5432}

read -p "Username (default: postgres): " PGUSER
PGUSER=${PGUSER:-postgres}

read -p "Database Name: " PGDB
if [ -z "$PGDB" ]; then
    echo "Error: Database name is required."
    exit 1
fi

read -s -p "Password: " PGPASSWORD
echo "" # New line after hidden password input

# Export password so psql doesn't prompt again
export PGPASSWORD

echo "------------------------------------"
echo "Restoring '$SQL_FILE' to database '$PGDB' on $PGHOST:$PGPORT..."

# Check if file is gzipped
if [[ "$SQL_FILE" == *.gz ]]; then
  gunzip -c "$SQL_FILE" | psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDB"
else
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDB" -f "$SQL_FILE"
fi

# Capture exit status
if [ $? -eq 0 ]; then
  echo "✅ Restore completed successfully!"
else
  echo "❌ Restore failed!"
  exit 1
fi

# Clear password from environment
unset PGPASSWORD
