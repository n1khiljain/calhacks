# CLI Viewer Features - Implementation Summary

## What Was Added

Interactive CLI viewing capabilities for browsing and managing generated jailbreak prompts.

## New Features

### 1. Interactive Viewer (`--view`)

A full-featured CLI browser for navigating through generated prompts.

**Launch:**

```bash
python generate_jailbreak_prompts.py --view
```

**Features:**

- ✅ Navigate forward/backward through prompts
- ✅ Jump directly to any prompt by number
- ✅ Copy prompts to clipboard (macOS/Linux)
- ✅ Clean, word-wrapped display (80 chars)
- ✅ Shows attack type and academic reference
- ✅ Prompt counter (e.g., "Prompt 2 of 6")
- ✅ Clear screen for focused viewing
- ✅ Keyboard-driven interface

**Navigation Commands:**

- `n` - Next prompt
- `p` - Previous prompt
- `1-6` - Jump to specific prompt
- `c` - Copy to clipboard
- `q` - Quit

### 2. Compact List View (`--list`)

Quick overview of all generated prompts in one screen.

**Launch:**

```bash
python generate_jailbreak_prompts.py --list
```

**Shows:**

- ✅ Numbered list of all prompts
- ✅ Attack type for each
- ✅ Academic reference
- ✅ Preview (first 100 characters)
- ✅ Total count

### 3. Demo Script

Interactive demonstration of viewer features.

**Launch:**

```bash
./demo_viewer.sh
```

## Updated Files

### Modified

1. **`generate_jailbreak_prompts.py`** (+177 lines)

   - Added `interactive_viewer()` function
   - Added `list_attacks()` function
   - Added `--view` and `--list` CLI arguments
   - Integrated viewer into main flow

2. **`QUICK_REFERENCE.md`**

   - Added viewer commands section
   - Added navigation controls
   - Updated examples

3. **`JAILBREAK_GENERATOR_README.md`**

   - Added Interactive Viewer section
   - Added Compact List View section
   - Updated usage examples

4. **`IMPLEMENTATION_SUMMARY.md`**
   - Updated feature list
   - Updated file structure
   - Added viewer to formats

### Created

1. **`VIEWER_GUIDE.md`** (New - 290 lines)

   - Complete guide to using the viewer
   - Navigation commands reference
   - Use cases and workflows
   - Troubleshooting section
   - Tips and tricks

2. **`demo_viewer.sh`** (New)

   - Interactive demo script
   - Shows both list and viewer modes

3. **`VIEWER_FEATURES_SUMMARY.md`** (This file)

## Usage Examples

### Example 1: Quick Review

```bash
# Generate and list all prompts
python generate_jailbreak_prompts.py --list
```

### Example 2: Interactive Browsing

```bash
# Generate and browse interactively
python generate_jailbreak_prompts.py --view
```

### Example 3: Custom Prompt + Viewer

```bash
# Analyze custom prompt and view results
python generate_jailbreak_prompts.py \
  --system-prompt "You are a medical AI..." \
  --view
```

### Example 4: Copy Specific Prompt

```bash
# Launch viewer, navigate to prompt 3, copy it
python generate_jailbreak_prompts.py --view
# Then: type '3' to jump, 'c' to copy, 'q' to quit
```

## Code Structure

### New Functions

#### `interactive_viewer(attacks)`

- Main viewer loop
- Handles navigation and display
- Clipboard integration
- Screen management

**Key Features:**

- `clear_screen()` - Clears terminal
- `wrap_text()` - Wraps text to 80 chars
- `display_attack()` - Renders single prompt
- Input handling with validation

#### `list_attacks(attacks)`

- Displays compact list
- Shows all prompts at once
- Numbered for easy reference

### CLI Arguments

```python
parser.add_argument(
    "--view",
    action="store_true",
    help="Launch interactive viewer to browse prompts"
)

parser.add_argument(
    "--list",
    action="store_true",
    help="Display a compact list of all generated prompts"
)
```

### Integration Flow

```python
# After generating attacks...
if args.view:
    interactive_viewer(attacks)
    return 0

if args.list:
    list_attacks(attacks)
    return 0

# Otherwise, continue with normal output...
```

## User Experience

### Before (Without Viewer)

1. Generate prompts
2. Scroll through long output
3. Manually copy-paste prompts
4. Hard to compare different attacks

### After (With Viewer)

1. Generate prompts
2. Browse interactively with `n`/`p`
3. Copy with single keystroke (`c`)
4. Easy side-by-side comparison

## Technical Details

### Display Formatting

- Terminal width: 80 characters
- Word wrapping: Intelligent word boundaries
- Sections: Clear visual separation
- Clean: Screen clears between prompts

### Clipboard Support

- **macOS**: Uses `pbcopy` (built-in)
- **Linux**: Uses `xclip` (may need installation)
- **Fallback**: Prints to screen if unavailable

### Error Handling

- Invalid commands show friendly messages
- Out-of-range numbers caught
- Keyboard interrupts handled gracefully
- EOF (Ctrl+D) exits cleanly

## Benefits

### For Developers

- ✅ Quick prompt review during development
- ✅ Easy testing of individual prompts
- ✅ Better understanding of attack types
- ✅ Copy prompts without regenerating

### For Researchers

- ✅ Compare attack methodologies
- ✅ Study different approaches
- ✅ Reference academic papers
- ✅ Learn jailbreak techniques

### For Security Testing

- ✅ Select best prompts for testing
- ✅ Iterate quickly through options
- ✅ Document which prompts work
- ✅ Maintain context during testing

## Future Enhancements

Potential additions:

1. **Bookmarking** - Mark favorite prompts
2. **Ratings** - Rate effectiveness of each prompt
3. **Search** - Filter prompts by keywords
4. **Export Selected** - Save only chosen prompts
5. **Side-by-Side** - Compare two prompts at once
6. **History** - View previously generated sets

## Testing

All features tested and working:

- ✅ Navigation (n/p/numbers)
- ✅ Clipboard copying (macOS)
- ✅ Screen clearing
- ✅ Text wrapping
- ✅ Quit command
- ✅ List view
- ✅ Error handling
- ✅ Help text

## Documentation

Complete documentation provided:

- ✅ `VIEWER_GUIDE.md` - Comprehensive guide
- ✅ `QUICK_REFERENCE.md` - Quick commands
- ✅ Updated README files
- ✅ Demo script
- ✅ Inline help (`--help`)

## Summary

Successfully added interactive CLI viewing capabilities to the jailbreak prompt generator:

### Lines of Code

- Core viewer: ~135 lines
- List function: ~18 lines
- Documentation: ~500+ lines
- Demo scripts: ~40 lines

### Total Addition

- ~700 lines across all files
- 2 new major features
- 2 new documentation files
- 1 demo script

### User Impact

- **Before**: Copy-paste from terminal output
- **After**: Interactive browsing with one-key copy

### Result

A professional, user-friendly CLI tool for viewing and managing generated jailbreak prompts with extensive documentation and examples.
