#!/bin/bash

VENV=".venv"
S1="get_checks.py"
S2="health_check.py"
S3="routing.py"
S4="register_login.py"

run_scripts() {
  echo "Running python scripts..."
  "${VENV}/bin/python" "$S1"
  "${VENV}/bin/python" "$S2"
  "${VENV}/bin/python" "$S3"
  "${VENV}/bin/python" "$S4"
}

run_scripts
