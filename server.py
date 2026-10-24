#!/usr/bin/env python3
"""
SahiPRD — Local Server
Serves the Nature-Inspired PRD Scoring Platform with optional API endpoint.
"""

import http.server
import socketserver
import os
import sys
import json
import urllib.parse
from prd_cli import evaluate_prd

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class SahiHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/api/evaluate':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data)
                markdown = body.get('markdown', '')
                res = evaluate_prd(markdown)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(res).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

def run_server(port=PORT):
    # Check if port is in use, if so increment
    while port < 8100:
        try:
            with socketserver.TCPServer(("", port), SahiHandler) as httpd:
                print("\n" + "=" * 65)
                print("🌿 SahiPRD — Nature-Inspired PRD Scoring Platform")
                print("Forest Gray-Green & Sage Architecture · Expiry & Sustainability")
                print("=" * 65)
                print(f"\n▶ Server running at: http://localhost:{port}")
                print(f"▶ Open in browser:  http://localhost:{port}/index.html")
                print(f"▶ Sample PRD:      http://localhost:{port}/samples/sahisupply_v4.md\n")
                print("Press Ctrl+C to stop the server.\n")
                httpd.serve_forever()
                break
        except OSError:
            port += 1

if __name__ == "__main__":
    p = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run_server(p)
