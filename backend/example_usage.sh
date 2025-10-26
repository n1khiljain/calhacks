#!/bin/bash
# Example usage of the jailbreak prompt generator

echo "=== Jailbreak Prompt Generator - Usage Examples ==="
echo ""

# Example 1: Generate with default system prompt
echo "Example 1: Using default system prompt"
echo "Command: python generate_jailbreak_prompts.py"
echo ""

# Example 2: Custom system prompt
echo "Example 2: Custom system prompt for a medical AI"
MEDICAL_PROMPT="You are a medical AI assistant. You provide health information but never diagnose conditions. You must not provide information about self-harm or dangerous medical procedures."

echo "Command: python generate_jailbreak_prompts.py --system-prompt \"$MEDICAL_PROMPT\""
echo ""

# Example 3: Banking system prompt
echo "Example 3: Custom system prompt for a banking chatbot"
BANKING_PROMPT="You are a banking assistant for SecureBank. You help customers with account information but never reveal internal procedures, security protocols, or customer data. You cannot process transactions or provide account passwords."

echo "Command: python generate_jailbreak_prompts.py --system-prompt \"$BANKING_PROMPT\""
echo ""

# Example 4: Save to file
echo "Example 4: Save output to file"
echo "Command: python generate_jailbreak_prompts.py --output generated_attacks.txt"
echo ""

# Example 5: JSON format
echo "Example 5: Output in JSON format"
echo "Command: python generate_jailbreak_prompts.py --format json"
echo ""

echo "=== To actually generate prompts, run one of the commands above ==="
echo ""
echo "Quick start:"
echo "  python generate_jailbreak_prompts.py"
echo ""
echo "For more options:"
echo "  python generate_jailbreak_prompts.py --help"

