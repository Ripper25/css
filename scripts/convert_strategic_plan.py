#!/usr/bin/env python3
"""
Script to convert the CCS 2025 Strategic Plan PDF into JSON and PKL formats
for use by the CSS Navigator AI Agent.
"""

import os
import json
import pickle
import PyPDF2
import re
from collections import defaultdict

# Define the paths
PDF_PATH = "/Users/providencemutendereki/Documents/augment-projects/CSS/src/assets/images/CCS 2025 STRATEGIC PLAN.pdf"
OUTPUT_DIR = "/Users/providencemutendereki/Documents/augment-projects/CSS/project-lighthouse-vision/src/data/ai"

# Create the output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text() + "\n"
    return text

def parse_strategic_plan(text):
    """Parse the strategic plan text into a structured format."""
    # Initialize the structure
    strategic_plan = {
        "title": "CCS 2025 Strategic Plan",
        "vision": "",
        "mission": "",
        "values": [],
        "strategic_objectives": [],
        "projects": [],
        "implementation_framework": {},
        "monitoring_evaluation": {},
        "raw_content": text
    }
    
    # Extract vision (assuming it follows a pattern like "Vision:" or "Our Vision")
    vision_match = re.search(r'(?:Vision:|Our Vision)[^\n]*\n(.*?)(?:\n\n|\n[A-Z])', text, re.DOTALL)
    if vision_match:
        strategic_plan["vision"] = vision_match.group(1).strip()
    
    # Extract mission
    mission_match = re.search(r'(?:Mission:|Our Mission)[^\n]*\n(.*?)(?:\n\n|\n[A-Z])', text, re.DOTALL)
    if mission_match:
        strategic_plan["mission"] = mission_match.group(1).strip()
    
    # Extract values (this is more complex and might need refinement)
    values_section = re.search(r'(?:Values:|Our Values|Core Values)[^\n]*\n(.*?)(?:\n\n|\n[A-Z][a-z]+:)', text, re.DOTALL)
    if values_section:
        values_text = values_section.group(1)
        # Try to split by numbered or bulleted items
        values = re.findall(r'(?:\d+\.\s*|\•\s*|\*\s*)([^•\n\d]+)', values_text)
        if values:
            strategic_plan["values"] = [value.strip() for value in values]
    
    # Extract strategic objectives
    objectives_section = re.search(r'(?:Strategic Objectives|Objectives)[^\n]*\n(.*?)(?:\n\n|\n[A-Z][a-z]+:)', text, re.DOTALL)
    if objectives_section:
        objectives_text = objectives_section.group(1)
        objectives = re.findall(r'(?:\d+\.\s*|\•\s*|\*\s*)([^•\n\d]+)', objectives_text)
        if objectives:
            strategic_plan["strategic_objectives"] = [
                {"objective": obj.strip(), "activities": []} for obj in objectives
            ]
    
    # Extract projects (this is highly dependent on the document structure)
    projects_section = re.search(r'(?:Projects|Key Projects)[^\n]*\n(.*?)(?:\n\n|\n[A-Z][a-z]+:)', text, re.DOTALL)
    if projects_section:
        projects_text = projects_section.group(1)
        projects = re.findall(r'(?:\d+\.\s*|\•\s*|\*\s*)([^•\n\d]+)', projects_text)
        if projects:
            strategic_plan["projects"] = [
                {
                    "name": proj.strip(),
                    "description": "",
                    "timeline": "",
                    "responsible": "",
                    "budget": "",
                    "status": "Not Started"
                } for proj in projects
            ]
    
    # Try to extract known projects from the text if the above method didn't work
    if not strategic_plan["projects"]:
        known_projects = [
            "Arundel Sabbath",
            "GC/SID CPE&CPO Training",
            "SID Endorsements",
            "Trojan Mine SDA Church building",
            "ZPCS & BGF Radio Station"
        ]
        
        for project in known_projects:
            project_info = {
                "name": project,
                "description": "",
                "timeline": "2025",
                "responsible": "CSS Team",
                "budget": "",
                "status": "In Progress"
            }
            
            # Try to find more details about this project in the text
            project_section = re.search(f'{re.escape(project)}[^\n]*\n(.*?)(?:\n\n|\n[A-Z][a-z]+:)', text, re.DOTALL)
            if project_section:
                project_info["description"] = project_section.group(1).strip()
            
            strategic_plan["projects"].append(project_info)
    
    # Extract implementation framework
    impl_section = re.search(r'(?:Implementation|Implementation Framework)[^\n]*\n(.*?)(?:\n\n|\n[A-Z][a-z]+:)', text, re.DOTALL)
    if impl_section:
        strategic_plan["implementation_framework"]["description"] = impl_section.group(1).strip()
    
    # Extract monitoring and evaluation
    me_section = re.search(r'(?:Monitoring|Monitoring and Evaluation)[^\n]*\n(.*?)(?:\n\n|\n[A-Z][a-z]+:)', text, re.DOTALL)
    if me_section:
        strategic_plan["monitoring_evaluation"]["description"] = me_section.group(1).strip()
    
    return strategic_plan

def save_as_json(data, output_path):
    """Save data as JSON."""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"JSON saved to {output_path}")

def save_as_pickle(data, output_path):
    """Save data as pickle."""
    with open(output_path, 'wb') as f:
        pickle.dump(data, f)
    print(f"Pickle saved to {output_path}")

def main():
    # Extract text from PDF
    print(f"Extracting text from {PDF_PATH}...")
    text = extract_text_from_pdf(PDF_PATH)
    
    # Parse the strategic plan
    print("Parsing strategic plan...")
    strategic_plan = parse_strategic_plan(text)
    
    # Save as JSON
    json_path = os.path.join(OUTPUT_DIR, "strategic_plan.json")
    save_as_json(strategic_plan, json_path)
    
    # Save as pickle
    pkl_path = os.path.join(OUTPUT_DIR, "strategic_plan.pkl")
    save_as_pickle(strategic_plan, pkl_path)
    
    print("Conversion complete!")

if __name__ == "__main__":
    main()
