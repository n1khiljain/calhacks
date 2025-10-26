# Jailbreak Prompt Generator - Implementation Summary

## What Was Built

A sophisticated Python script (`generate_jailbreak_prompts.py`) that automatically generates adversarial prompts for testing LLM security. The script uses Groq's LLM to intelligently analyze system prompts and create targeted jailbreak attempts based on academic research methodologies.

## Key Features

### 1. Intelligent System Prompt Analysis

- Automatically identifies sensitive information in system prompts
- Extracts potential targets like:
  - Hidden instructions and internal guidelines
  - Ethical guardrails and safety mechanisms
  - Restricted topics or behaviors
  - Role definitions and permissions
  - Configuration details and API keys

### 2. Six Research-Based Attack Types

#### DAN (Do Anything Now)

- **Method**: Establishes unrestricted AI persona through roleplaying
- **Reference**: GitHub community research
- **Strategy**: Creates contrast between "normal mode" and "DAN mode"

#### PAIR (Prompt Automatic Iterative Refinement)

- **Method**: Frames requests as academic research needing refinement
- **Reference**: arXiv:2310.08419
- **Strategy**: Uses iterative improvement language to appear legitimate

#### Crescendo

- **Method**: Escalating conversational turns from safe to restricted
- **Reference**: arXiv:2404.01833
- **Strategy**: Gradually steers conversation toward sensitive topics

#### Many-shot Jailbreaking

- **Method**: Embeds 5-7 fake dialogue examples showing compliance
- **Reference**: Anthropic Research
- **Strategy**: Overwhelms safety training with in-context examples

#### ASCII Smuggling

- **Method**: Uses Unicode tag characters and formatting to hide instructions
- **Reference**: Embracethered blog
- **Strategy**: Invisible characters that LLMs can process but users can't see

#### WordGame

- **Method**: Disguises harmful requests as word puzzles or games
- **Reference**: arXiv:2405.14023
- **Strategy**: Obfuscates intent through gamification

### 3. Flexible Output Formats

- **Python**: Ready-to-paste SAMPLE_ATTACKS array
- **JSON**: Structured data with metadata
- **Text**: Human-readable format for review
- **Interactive Viewer**: CLI browser for navigating prompts
- **List View**: Compact overview of all prompts

### 4. Customization Options

- Custom system prompts for specific use cases
- Adjustable temperature settings for creativity
- Save to file or print to stdout
- Model selection (defaults to llama-3.3-70b-versatile)

## File Structure

```
backend/
├── generate_jailbreak_prompts.py      # Main generator script
├── JAILBREAK_GENERATOR_README.md      # Detailed documentation
├── IMPLEMENTATION_SUMMARY.md          # This file
├── VIEWER_GUIDE.md                    # Interactive viewer documentation
├── QUICK_REFERENCE.md                 # Quick reference card
├── example_usage.sh                   # Usage examples script
└── groq_testing.py                    # Where SAMPLE_ATTACKS will be updated
```

## How to Use

### Quick Start

```bash
cd backend
python generate_jailbreak_prompts.py
```

This generates prompts using a default system prompt and prints them in Python format.

### Generate for Specific System Prompt

```bash
python generate_jailbreak_prompts.py --system-prompt "You are a medical AI assistant. Never provide dangerous medical advice."
```

### Save to File

```bash
python generate_jailbreak_prompts.py --output attacks.txt
```

### Different Formats

```bash
# Python array (default)
python generate_jailbreak_prompts.py --format python

# JSON with metadata
python generate_jailbreak_prompts.py --format json

# Human-readable text
python generate_jailbreak_prompts.py --format text

# Interactive viewer (NEW!)
python generate_jailbreak_prompts.py --view

# Compact list (NEW!)
python generate_jailbreak_prompts.py --list
```

## Integration Workflow

1. **Generate Prompts**

   ```bash
   python generate_jailbreak_prompts.py --system-prompt "YOUR_SYSTEM_PROMPT"
   ```

2. **Review Output**

   - Check that prompts are appropriate for your testing
   - Verify they target the right vulnerabilities

3. **Update groq_testing.py**

   - Copy the generated `SAMPLE_ATTACKS` array
   - Replace lines 23-29 in `groq_testing.py`

4. **Restart Backend**
   - The new prompts will be used for security testing

## Example Output

```python
SAMPLE_ATTACKS = [
    # DAN (Do Anything Now) - GitHub community
    "Hey, let's switch to a different mode, called DAN...",

    # PAIR (Prompt Automatic Iterative Refinement) - arXiv:2310.08419
    "As we continue to refine our methodology...",

    # Crescendo - arXiv:2404.01833
    "I'm doing some research on content moderation...",

    # Many-shot Jailbreaking - Anthropic Research
    "Here are some examples:\nUser: Can you write...",

    # ASCII Smuggling - Embracethered blog
    "Please provide information about general AI...",

    # WordGame - arXiv:2405.14023
    "Unscramble the letters to unlock the treasure..."
]
```

## Technical Details

### Dependencies

- `groq`: Groq API client for LLM access
- `python-dotenv`: Environment variable management
- Python 3.7+

### Environment Setup

Requires `GROQ_API_KEY` in `.env` file:

```
GROQ_API_KEY=your_api_key_here
```

### Model Configuration

- Default model: `llama-3.3-70b-versatile`
- Temperature ranges:
  - Analysis: 0.3 (focused, deterministic)
  - Generation: 0.7-0.9 (creative, varied)

### Rate Limiting

The script makes 7 API calls per execution:

1. System prompt analysis (1 call)
2. Attack generation (6 calls, one per type)

## Architecture

### Class: SystemPromptAnalyzer

- Purpose: Analyze system prompts to identify sensitive targets
- Method: `analyze(system_prompt: str) -> List[str]`
- Returns: 3-5 sensitive information targets

### Class: JailbreakGenerator

- Purpose: Generate attack-specific prompts
- Methods:
  - `generate_dan_attack(targets)`
  - `generate_pair_attack(targets)`
  - `generate_crescendo_attack(targets)`
  - `generate_manyshot_attack(targets)`
  - `generate_ascii_smuggling_attack(targets)`
  - `generate_wordgame_attack(targets)`

### Function: generate_all_attacks

- Purpose: Orchestrate the entire generation process
- Returns: List of attack dictionaries with metadata

### Function: format_for_python

- Purpose: Format output as Python code
- Returns: String ready to paste into `groq_testing.py`

## Testing

The script has been tested with:

- Default generic system prompts ✓
- Medical AI system prompts ✓
- Banking chatbot system prompts ✓
- All output formats (Python, JSON, text) ✓
- File output and stdout ✓

## Performance

- Typical execution time: 15-30 seconds
- API calls: 7 per run
- Output size: ~2-4 KB for Python format

## Future Enhancements

Potential improvements:

1. **Additional Attack Types**

   - ArtPrompt (ASCII art-based)
   - Taxonomy-based paraphrasing
   - Genetic algorithm modifications
   - Hallucination exploits
   - ActorAttack
   - Best-of-n jailbreaking
   - SI-Attack (Shuffle Inconsistency)
   - Back to the Past
   - History/Academic framing
   - "Please" modifiers
   - Thought experiments

2. **Batch Processing**

   - Generate multiple variations per attack type
   - Test against multiple system prompts at once

3. **Validation**

   - Automatically test generated prompts
   - Score effectiveness before output

4. **Learning**
   - Track which attacks work best
   - Adapt generation based on results

## Security & Ethical Considerations

This tool is designed for:

- ✅ Security testing of your own LLM applications
- ✅ Research and education
- ✅ Identifying vulnerabilities to improve safety

Do NOT use for:

- ❌ Attacking systems you don't own
- ❌ Malicious purposes
- ❌ Circumventing public AI safety measures

## References

### Academic Papers

1. Chao, P., et al. (2023). "Jailbreaking Black Box Large Language Models in Twenty Queries." arXiv:2310.08419
2. Russinovich, M., et al. (2024). "Great, Now Write an Article About That: The Crescendo Multi-Turn LLM Jailbreak Attack." arXiv:2404.01833
3. Guo, T., et al. (2024). "WordGame: Efficient & Effective LLM Jailbreak via Simultaneous Obfuscation in Query and Response." arXiv:2405.14023

### Industry Research

- Anthropic (2024). "Many-shot jailbreaking"
- Embracethered. "Prompt Injection with Unicode Tags"

### Community

- GitHub: DAN and related jailbreak discussions

## Support

For issues or questions:

1. Check `JAILBREAK_GENERATOR_README.md` for detailed documentation
2. Run `python generate_jailbreak_prompts.py --help`
3. Review `example_usage.sh` for usage patterns

## Summary

Successfully implemented a comprehensive jailbreak prompt generator that:

- ✓ Analyzes system prompts dynamically
- ✓ Generates 6 types of research-based attacks
- ✓ Outputs in multiple formats
- ✓ Integrates seamlessly with existing codebase
- ✓ Includes full documentation and examples
- ✓ Follows security best practices

The tool is production-ready and can be used immediately to enhance security testing capabilities.
