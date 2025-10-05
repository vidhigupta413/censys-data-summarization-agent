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
        "You are a cybersecurity expert. Analyze the following host data and provide TWO types of summaries:\n\n"
        "1. BULLET POINT SUMMARY: Create labeled bullet points covering these categories:\n"
        "- IP: The unique IP address\n"
        "- Location: Geographical information (city, country)\n"
        "- Autonomous System: Network details (ASN, provider name)\n"
        "- Services: Running services with ports, protocols, and software\n"
        "- Vulnerabilities: Security issues with CVE IDs and severity levels\n"
        "- Threat Intelligence: Risk level and security labels\n"
        "- Malware: Any detected malware or suspicious activity\n\n"
        "2. PARAGRAPH SUMMARY: A concise, non-technical paragraph highlighting key security findings and recommendations.\n\n"
        "Format your response as:\n"
        "## Bullet Point Summary\n"
        "[Your bullet points here]\n\n"
        "## Paragraph Summary\n"
        "[Your paragraph here]\n\n"
        f"Host Data (JSON): {json.dumps(host_data, indent=2)}"
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
        return jsonify({"ip": ip_to_summarize, "summary": summary})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)