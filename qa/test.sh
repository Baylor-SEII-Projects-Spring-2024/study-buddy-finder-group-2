#!/bin/bash

VENV=".venv"
S1="get_checks.py"
S2="health_check.py"
S3="routing.py"

run_scripts() {
  echo "Running python scripts..."
  #python3 "$S1"
  #python3 "$S2"
  #python3 "$S3"
  "${VENV}/bin/python" "$S1"
  "${VENV}/bin/python" "$S2"
  "${VENV}/bin/python" "$S3"
}

run_scripts
