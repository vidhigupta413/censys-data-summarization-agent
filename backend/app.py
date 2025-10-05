import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import openai
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Initialize Flask app
app = Flask("CensysAgent")
CORS(app)  # Enable CORS for all routes

# Initialize the OpenAI client with your API key
# Make sure to set your OPENAI_API_KEY in a .env file
openai.api_key = os.environ.get("OPENAI_API_KEY")

# Load the host data from the JSON file
def load_host_data():
    try:
        # Use the hosts_dataset.json file in the same directory as app.py
        file_path = os.path.join(os.path.dirname(__file__), 'hosts_dataset.json')
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return None

# API endpoint to get a summary of a single host
@app.route('/summarize', methods=['POST'])
def summarize_host():
    # Load the entire dataset
    dataset = load_host_data()
    if not dataset:
        return jsonify({"error": "Dataset not found"}), 404

    # Get the IP address from the request body
    data = request.json
    ip_to_summarize = data.get('ip')

    if not ip_to_summarize:
        return jsonify({"error": "IP address is required"}), 400

    # Find the host data for the requested IP
    host_data = next((host for host in dataset['hosts'] if host['ip'] == ip_to_summarize), None)

    if not host_data:
        return jsonify({"error": "Host not found in dataset"}), 404

    # This is the prompt engineering step. We format the data and instructions for the LLM.
    prompt = (
        "Create a security analysis summary. Use EXACTLY this format for every host:\n\n"
        "## Bullet Point Summary\n"
        "- IP: [IP address]\n"
        "- Location: [City, Country]\n"
        "- Autonomous System: [ASN, Provider]\n"
        "- Services: [All ports and protocols]\n"
        "- Vulnerabilities: [All CVEs with severities]\n"
        "- Threat Intelligence: [Risk level and labels]\n\n"
        "## Paragraph Summary\n"
        "5-7 sentence security analysis]\n\n"
        "STRICT FORMATTING RULES:\n"
        "- ALWAYS use this exact structure for every host\n"
        "- ALWAYS include all 6 categories in this order\n"
        "- Services: ALL ports must be on the SAME LINE after the colon\n"
        "- Vulnerabilities: ALL CVEs must be on the SAME LINE after the colon\n"
        "- Threat Intelligence: ALL info must be on the SAME LINE after the colon\n"
        "- NEVER create sub-bullets for any category\n"
        "- Keep descriptions concise (max 40 chars per line)\n\n"
        f"Host Data: {json.dumps(host_data, indent=2)}"
    )

    try:
        # Call the OpenAI API to generate the summary
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", # Using gpt-3.5-turbo for compatibility with older API version
            messages=[
                {"role": "system", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=500,
        )
        summary = response.choices[0].message.content
        
        # Post-process to fix formatting issues
        
        # Convert sub-bullet ports to inline format
        import re
        services_match = re.search(r'- Services:.*?\n((?:\s+- Port.*?\n?)*)', summary, re.MULTILINE | re.DOTALL)
        if services_match:
            port_lines = services_match.group(1)
            ports = re.findall(r'Port [^\n]+', port_lines)
            if ports:
                port_text = ', '.join(ports)
                summary = re.sub(r'- Services:.*?\n(?:\s+- Port.*?\n?)*', f'- Services: {port_text}\n', summary, flags=re.MULTILINE | re.DOTALL)
        
        # Convert sub-bullet CVEs to inline format
        vulnerabilities_match = re.search(r'- Vulnerabilities:.*?\n((?:\s+- CVE-.*?\n?)*)', summary, re.MULTILINE | re.DOTALL)
        if vulnerabilities_match:
            cve_lines = vulnerabilities_match.group(1)
            cves = re.findall(r'CVE-[^\s]+ \([^)]+\)', cve_lines)
            if cves:
                cve_text = ', '.join(cves)
                summary = re.sub(r'- Vulnerabilities:.*?\n(?:\s+- CVE-.*?\n?)*', f'- Vulnerabilities: {cve_text}\n', summary, flags=re.MULTILINE | re.DOTALL)
        
        # Convert sub-bullet threat intelligence to inline format
        threat_match = re.search(r'- Threat Intelligence:.*?\n((?:\s+- .*?\n?)*)', summary, re.MULTILINE | re.DOTALL)
        if threat_match:
            threat_lines = threat_match.group(1)
            threats = re.findall(r'\s+- ([^\n]+)', threat_lines)
            if threats:
                threat_text = ', '.join(threats)
                summary = re.sub(r'- Threat Intelligence:.*?\n(?:\s+- .*?\n?)*', f'- Threat Intelligence: {threat_text}\n', summary, flags=re.MULTILINE | re.DOTALL)
        
        return jsonify({"ip": ip_to_summarize, "summary": summary})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)