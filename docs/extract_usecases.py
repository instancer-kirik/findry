#!/usr/bin/env python3
"""
Extract Facebook API use cases from HTML file and output clean text list
"""

import re
from pathlib import Path


def extract_use_cases(html_file):
    """Extract use case titles and descriptions from HTML"""

    with open(html_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all heading sections with role="heading"
    heading_pattern = r'role="heading"[^>]*>\s*(.*?)\s*</div>'
    headings = re.findall(heading_pattern, content, re.DOTALL)

    # Find all description sections that follow headings
    desc_pattern = r'class="[^"]*x8t9es0[^"]*x1fvot60[^"]*"[^>]*>\s*(.*?)\s*<a'
    descriptions = re.findall(desc_pattern, content, re.DOTALL)

    # Clean up the extracted text
    use_cases = []

    # Process headings
    clean_headings = []
    for heading in headings:
        # Remove HTML entities and extra whitespace
        clean_heading = re.sub(r"&amp;", "&", heading)
        clean_heading = re.sub(r"\s+", " ", clean_heading).strip()
        if clean_heading and not clean_heading.startswith("<"):
            clean_headings.append(clean_heading)

    # Process descriptions
    clean_descriptions = []
    for desc in descriptions:
        # Remove extra whitespace and line breaks
        clean_desc = re.sub(r"\s+", " ", desc).strip()
        if clean_desc and not clean_desc.startswith("<"):
            clean_descriptions.append(clean_desc)

    # Match headings with descriptions
    for i, heading in enumerate(clean_headings):
        desc = (
            clean_descriptions[i]
            if i < len(clean_descriptions)
            else "No description available"
        )
        use_cases.append({"title": heading, "description": desc})

    return use_cases


def main():
    html_file = Path(__file__).parent / "fb_usecases.html"

    if not html_file.exists():
        print(f"Error: {html_file} not found")
        return

    use_cases = extract_use_cases(html_file)

    print("# Facebook API Use Cases\n")

    for i, case in enumerate(use_cases, 1):
        print(f"## {i}. {case['title']}")
        print(f"{case['description']}\n")


if __name__ == "__main__":
    main()
