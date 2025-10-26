#!/bin/bash
# Demo script for the interactive viewer

echo "=========================================="
echo "Jailbreak Prompt Generator - Viewer Demo"
echo "=========================================="
echo ""
echo "This script will demonstrate the new CLI viewing features."
echo ""

# Demo 1: List view
echo "=== Demo 1: Compact List View ==="
echo ""
echo "Command: python generate_jailbreak_prompts.py --list"
echo ""
read -p "Press Enter to run (or Ctrl+C to skip)..."
python generate_jailbreak_prompts.py --list
echo ""

# Demo 2: Interactive viewer
echo ""
echo "=== Demo 2: Interactive Viewer ==="
echo ""
echo "Command: python generate_jailbreak_prompts.py --view"
echo ""
echo "In the viewer, you can:"
echo "  - Press 'n' for next prompt"
echo "  - Press 'p' for previous prompt"
echo "  - Type a number (1-6) to jump to that prompt"
echo "  - Press 'c' to copy to clipboard"
echo "  - Press 'q' to quit"
echo ""
read -p "Press Enter to launch viewer (or Ctrl+C to skip)..."
python generate_jailbreak_prompts.py --view

echo ""
echo "=========================================="
echo "Demo complete!"
echo "=========================================="

