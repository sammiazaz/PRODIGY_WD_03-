#!/usr/bin/env python3
import http.server
import socketserver
import os
import re
from urllib.parse import urlparse

class WeatherAppHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        
        # If requesting the root path, serve the HTML with API key injected
        if parsed_path.path == '/' or parsed_path.path == '/index.html':
            self.serve_index_with_api_key()
        else:
            # For other files (CSS, JS, etc.), serve normally
            super().do_GET()
    
    def serve_index_with_api_key(self):
        try:
            # Read the HTML file
            with open('index.html', 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            # Get the API key from environment
            api_key = os.environ.get('OPENWEATHER_API_KEY', '')
            
            # Inject the API key into the HTML
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
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.send_header('Content-Length', str(len(html_content.encode('utf-8'))))
            self.end_headers()
            self.wfile.write(html_content.encode('utf-8'))
            
        except Exception as e:
            self.send_error(500, f"Error serving index.html: {str(e)}")

def run_server():
    PORT = 5000
    
    with socketserver.TCPServer(("0.0.0.0", PORT), WeatherAppHandler) as httpd:
        print(f"Weather App Server running on port {PORT}")
        print(f"Visit: http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()