#!/bin/bash

# Usage:
#   ./db_restore_with_url.sh backupfile.sql[.gz] "postgresql://user:password@host:port/db"

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

# Ensure PostgreSQL binaries are in PATH
if command -v psql >/dev/null 2>&1; then
  PSQL_DIR=$(dirname "$(command -v psql)")
  PATH="$PSQL_DIR:$PATH"
elif command -v pg_restore >/dev/null 2>&1; then
  PG_DIR=$(dirname "$(command -v pg_restore)")
  PATH="$PG_DIR:$PATH"
else
  for pg_dir in "/c/Program Files/PostgreSQL/"*"/bin" "/c/Program Files (x86)/PostgreSQL/"*"/bin"; do
    if [ -d "$pg_dir" ]; then
      PATH="$pg_dir:$PATH"
    fi
  done
fi

echo "------------------------------------"
echo "Restoring '$SQL_FILE' using connection string..."
echo "------------------------------------"

# Restore based on format
if pg_restore -l "$SQL_FILE" >/dev/null 2>&1; then
  echo "Detected PostgreSQL custom-format dump. Restoring using pg_restore..."
  pg_restore --clean --if-exists --no-owner --no-privileges --dbname="$DATABASE_URL" "$SQL_FILE"
else
  case "$SQL_FILE" in
    *.gz)
      if gunzip -c "$SQL_FILE" | pg_restore -l >/dev/null 2>&1; then
        echo "Detected compressed PostgreSQL custom-format dump. Restoring using pg_restore..."
        gunzip -c "$SQL_FILE" | pg_restore --clean --if-exists --no-owner --no-privileges --dbname="$DATABASE_URL"
      else
        echo "Detected compressed plain-text SQL. Restoring using psql..."
        gunzip -c "$SQL_FILE" | psql "$DATABASE_URL"
      fi
      ;;
    *)
      echo "Detected plain-text SQL dump. Restoring using psql..."
      psql "$DATABASE_URL" -f "$SQL_FILE"
      ;;
  esac
fi

# Check status
if [ $? -eq 0 ]; then
  echo "✅ Restore completed successfully!"
else
  echo "❌ Restore failed!"
  exit 1
fi