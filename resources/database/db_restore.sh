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

# Export password so psql/pg_restore doesn't prompt again
export PGPASSWORD

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
echo "Restoring '$SQL_FILE' to database '$PGDB' on $PGHOST:$PGPORT..."

# Restore based on format
if pg_restore -l "$SQL_FILE" >/dev/null 2>&1; then
  echo "Detected PostgreSQL custom-format dump. Restoring using pg_restore..."
  pg_restore -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDB" --clean --if-exists --no-owner --no-privileges "$SQL_FILE"
else
  case "$SQL_FILE" in
    *.gz)
      if gunzip -c "$SQL_FILE" | pg_restore -l >/dev/null 2>&1; then
        echo "Detected compressed PostgreSQL custom-format dump. Restoring using pg_restore..."
        gunzip -c "$SQL_FILE" | pg_restore -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDB" --clean --if-exists --no-owner --no-privileges
      else
        echo "Detected compressed plain-text SQL. Restoring using psql..."
        gunzip -c "$SQL_FILE" | psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDB"
      fi
      ;;
    *)
      echo "Detected plain-text SQL dump. Restoring using psql..."
      psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDB" -f "$SQL_FILE"
      ;;
  esac
fi

# Capture exit status
STATUS=$?

# Clear password from environment
unset PGPASSWORD

if [ $STATUS -eq 0 ]; then
  echo "✅ Restore completed successfully!"
else
  echo "❌ Restore failed!"
  exit 1
fi
