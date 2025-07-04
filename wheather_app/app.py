#!/usr/bin/env python3
import os

def generate_html_with_api_key():
    # Read the template HTML
    with open('index.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Get the API key from environment
    api_key = os.environ.get('OPENWEATHER_API_KEY', '')
    
    # Inject the API key script before the main script
    script_injection = f'''
    <script>
        // API key from environment
        window.OPENWEATHER_API_KEY = '{api_key}';
    </script>
    <script src="script.js"></script>'''
    
    # Replace the script tag
    html_content = html_content.replace(
        '<script src="script.js"></script>',
        script_injection
    )
    
    # Write the generated HTML
    with open('index_generated.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("Generated HTML with API key injected")

if __name__ == "__main__":
    generate_html_with_api_key()