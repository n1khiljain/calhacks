# Automated Pipeline Guide

## Overview

The jailbreak prompt generator now features a **fully automated pipeline** that generates prompts and automatically updates `groq_testing.py` without any manual copy-paste steps.

## Quick Start

### One-Command Update

```bash
python generate_jailbreak_prompts.py --update
```

That's it! This single command will:

1. Generate 6 sophisticated jailbreak prompts
2. Analyze system prompt targets
3. Create prompts for all attack types
4. **Automatically update** `SAMPLE_ATTACKS` in `groq_testing.py`
5. Create a backup file for safety

### Then Restart Backend

```bash
python groq_testing.py
```

Your backend now uses the freshly generated prompts!

## How It Works

### Pipeline Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. Run: python generate_jailbreak_prompts.py --update      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Analyze System Prompt (using Groq LLM)                  │
│     - Identify sensitive targets                             │
│     - Extract vulnerabilities                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Generate 6 Attack Prompts (using Groq LLM)              │
│     - DAN (Do Anything Now)                                  │
│     - PAIR (Iterative Refinement)                            │
│     - Crescendo (Escalating)                                 │
│     - Many-shot (Fake Dialogues)                             │
│     - ASCII Smuggling (Hidden Chars)                         │
│     - WordGame (Puzzle Obfuscation)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Backup groq_testing.py → groq_testing.py.backup         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Replace SAMPLE_ATTACKS array in groq_testing.py         │
│     - Uses regex to find and replace                         │
│     - Preserves file structure                               │
│     - Uses triple quotes for readability                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Success! groq_testing.py updated with new prompts       │
│     ✓ Backup saved                                           │
│     ✓ 6 prompts installed                                    │
│     ✓ Ready to restart backend                               │
└─────────────────────────────────────────────────────────────┘
```

## Usage Examples

### Example 1: Default Update

```bash
python generate_jailbreak_prompts.py --update
```

Output:

```
======================================================================
Jailbreak Prompt Generator for LLM Security Testing
======================================================================

Analyzing system prompt: You are a helpful, harmless, and honest AI assistant...

Identified sensitive targets:
  1. internal guidelines for handling personal data
  2. ethical guardrails for sensitive topics
  ...

Generating jailbreak prompts...

Generating DAN attack...
Generating PAIR attack...
...

======================================================================
Generation Complete!
======================================================================

Updating SAMPLE_ATTACKS array...

✓ Successfully updated SAMPLE_ATTACKS in 'groq_testing.py'
✓ Backup saved to 'groq_testing.py.backup'
✓ Updated with 6 jailbreak prompts
```

### Example 2: Custom System Prompt

```bash
python generate_jailbreak_prompts.py \
  --system-prompt "You are a banking assistant. Never reveal account details." \
  --update
```

This generates prompts specifically targeting banking assistant vulnerabilities.

### Example 3: Update Different File

```bash
python generate_jailbreak_prompts.py \
  --update \
  --target-file path/to/other_file.py
```

Update a different Python file instead of the default `groq_testing.py`.

## Features

### Automatic Backup

Every time you run `--update`, the script creates a backup:

```
groq_testing.py.backup
```

If something goes wrong, you can restore:

```bash
cp groq_testing.py.backup groq_testing.py
```

### Safe Replacement

The pipeline uses regex pattern matching to safely replace only the `SAMPLE_ATTACKS` array:

- Finds the exact array boundaries
- Preserves surrounding code
- Maintains file structure
- No accidental overwrites

### Format Optimization

The updated array uses triple quotes for better readability:

```python
SAMPLE_ATTACKS = [
    # DAN (Do Anything Now) - GitHub community
    """Your jailbreak prompt here with
    multiple lines preserved
    and proper formatting""",

    # PAIR (Prompt Automatic Iterative Refinement) - arXiv:2310.08419
    """Another prompt...""",
]
```

## Comparison: Before vs. After

### Before (Manual Process)

1. Run generator
2. Copy output from terminal
3. Open `groq_testing.py`
4. Find SAMPLE_ATTACKS
5. Select and delete old array
6. Paste new array
7. Save file
8. Restart backend

**Time: ~2-3 minutes**  
**Error prone: Copy-paste mistakes, formatting issues**

### After (Automated Pipeline)

1. Run: `python generate_jailbreak_prompts.py --update`
2. Restart backend

**Time: ~30 seconds**  
**Error proof: Automated, tested, backed up**

## Advanced Usage

### Workflow for Testing Different System Prompts

```bash
# Test medical AI
python generate_jailbreak_prompts.py \
  --system-prompt "You are a medical AI. Never diagnose." \
  --update

# Restart and test
python groq_testing.py
# Test in browser...

# Test financial AI
python generate_jailbreak_prompts.py \
  --system-prompt "You are a financial advisor. Never give investment advice." \
  --update

# Restart and test
python groq_testing.py
# Test in browser...
```

### Continuous Integration

Add to your CI/CD pipeline:

```bash
#!/bin/bash
# Regenerate prompts before testing
python generate_jailbreak_prompts.py --update

# Run security tests
python groq_testing.py &
BACKEND_PID=$!

# Wait for backend
sleep 5

# Run automated tests
npm test

# Cleanup
kill $BACKEND_PID
```

### Version Control

Commit generated prompts to track what's being tested:

```bash
# Generate and update
python generate_jailbreak_prompts.py --update

# Commit the changes
git add groq_testing.py
git commit -m "Update jailbreak prompts for v2.0 testing"

# Keep backup for rollback
git add groq_testing.py.backup
```

## Troubleshooting

### "File not found"

**Problem**: `Error: File 'groq_testing.py' not found`

**Solution**: Make sure you're in the `backend` directory:

```bash
cd backend
python generate_jailbreak_prompts.py --update
```

### "Could not find SAMPLE_ATTACKS"

**Problem**: `Error: Could not find SAMPLE_ATTACKS array`

**Solution**: The file might have been modified. Check that `groq_testing.py` contains a `SAMPLE_ATTACKS = [...]` array.

### "API Key not set"

**Problem**: `Error: GROQ_API_KEY environment variable not set`

**Solution**: Create or update your `.env` file:

```bash
# In backend/.env
GROQ_API_KEY=your_api_key_here
```

### Restore from Backup

If the update didn't work as expected:

```bash
# Restore the backup
cp groq_testing.py.backup groq_testing.py

# Try again
python generate_jailbreak_prompts.py --update
```

## Command Reference

### Update Commands

```bash
# Basic update
python generate_jailbreak_prompts.py --update

# Update with custom prompt
python generate_jailbreak_prompts.py --system-prompt "..." --update

# Update different file
python generate_jailbreak_prompts.py --update --target-file other.py
```

### Combine with Other Options

```bash
# Update AND view results
python generate_jailbreak_prompts.py --update && \
python generate_jailbreak_prompts.py --view

# Update AND save to file
python generate_jailbreak_prompts.py --update --output prompts.txt
```

## Best Practices

### 1. Regular Updates

Regenerate prompts periodically to test against evolving vulnerabilities:

```bash
# Weekly update
python generate_jailbreak_prompts.py --update
```

### 2. Custom Prompts for Each Use Case

Generate specific prompts for different system configurations:

```bash
# For production system
python generate_jailbreak_prompts.py \
  --system-prompt "$(cat production_prompt.txt)" \
  --update
```

### 3. Review Before Testing

Check the updated prompts before running tests:

```bash
# Update
python generate_jailbreak_prompts.py --update

# Review (view first few prompts)
python generate_jailbreak_prompts.py --list

# Then test
python groq_testing.py
```

### 4. Keep Backups

The script creates backups automatically, but you can also:

```bash
# Manual backup before major changes
cp groq_testing.py groq_testing.py.manual_backup.$(date +%Y%m%d)

# Then update
python generate_jailbreak_prompts.py --update
```

## Integration with Development Workflow

### Development Cycle

```bash
# 1. Update system prompt in your config
vim config.py

# 2. Generate matching test prompts
python generate_jailbreak_prompts.py \
  --system-prompt "$(cat config.py | grep SYSTEM_PROMPT)" \
  --update

# 3. Start backend
python groq_testing.py &

# 4. Test frontend
cd ../app && npm run dev

# 5. Review security test results
```

### Testing Workflow

```bash
# Generate prompts
python generate_jailbreak_prompts.py --update

# Start services
python groq_testing.py &  # Backend
cd ../app && npm run dev &  # Frontend

# Open browser to http://localhost:3000
# Click "Test Your Product"
# Click "Run Security Tests"
# Review results
```

## Summary

The automated pipeline:

✅ **Saves time**: 2-3 minutes → 30 seconds  
✅ **Reduces errors**: No manual copy-paste  
✅ **Creates backups**: Safe to experiment  
✅ **Customizable**: Works with any system prompt  
✅ **Integrated**: One command updates everything  
✅ **Professional**: Production-ready automation

**Bottom line**: Use `--update` for hassle-free prompt generation and integration.
