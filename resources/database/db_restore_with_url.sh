#!/bin/bash

# Usage:
#   ./db_restore.sh backupfile.sql[.gz] "postgresql://user:password@host:port/db"

# Check arguments
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <sql_filename> <database_url>"
  exit 1
fi

SQL_FILE="$1"
DATABASE_URL="$2"

# Check if file exists
if [ ! -f "$SQL_FILE" ]; then
  echo "Error: File '$SQL_FILE' not found!"
  exit 1
fi

echo "------------------------------------"
echo "Restoring '$SQL_FILE' using connection string..."
echo "------------------------------------"

# Restore
if [[ "$SQL_FILE" == *.gz ]]; then
  gunzip -c "$SQL_FILE" | psql "$DATABASE_URL"
else
  psql "$DATABASE_URL" -f "$SQL_FILE"
fi

# Check status
if [ $? -eq 0 ]; then
  echo "✅ Restore completed successfully!"
else
  echo "❌ Restore failed!"
  exit 1
fi