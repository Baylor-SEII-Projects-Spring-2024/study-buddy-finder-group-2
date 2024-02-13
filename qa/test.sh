#!/bin/bash

VENV=".venv"
S1="get_checks.py"
S2="health_check.py"
S3="routing.py"
REQUIREMENTS="requirements.txt"
REQUIREMENTS_HASH=".requirements.hash"

activate_venv() {
  echo "Activating virtual environment..."
  if [ ! -d "$VENV" ]; then
    echo "Creating virtual environment..."
    python3 -m venv "$VENV"
  fi
  source "$VENV/bin/activate"
}

install_requirements() {
  echo "Checking and installing required packages..."
  CURRENT_HASH=$(md5sum $REQUIREMENTS | awk '{ print $1 }')
  PREVIOUS_HASH=""

  if [ -f "$REQUIREMENTS_HASH" ]; then
    PREVIOUS_HASH=$(cat $REQUIREMENTS_HASH)
  fi

  # Compare the current hash with the previous hash
  if [ "$CURRENT_HASH" != "$PREVIOUS_HASH" ]; then
    pip install --quiet -r $REQUIREMENTS
    echo $CURRENT_HASH > $REQUIREMENTS_HASH
    echo "Requirements installed."
  else
    echo "Requirements are up to date."
  fi
}

run_scripts() {
  echo "Running python scripts..."
  python3 "$S1"
  python3 "$S2"
  python3 "$S3"
}

activate_venv
install_requirements
run_scripts
