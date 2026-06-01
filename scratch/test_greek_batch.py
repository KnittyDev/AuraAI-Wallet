import json
import urllib.request
import urllib.parse
import re
import html

# Load en.json and get first 50 strings
with open("../context/en.json", "r", encoding="utf-8") as f:
    en_data = json.load(f)

def collect_strings(obj, paths):
    if isinstance(obj, dict):
        for k, v in obj.items():
            collect_strings(v, paths)
    elif isinstance(obj, list):
        for item in obj:
            collect_strings(item, paths)
    elif isinstance(obj, str):
        if obj not in ["BTC", "ETH", "SOL", "USDT", "$0", "Pro", "Free", "Enterprise", "Aura", "AuraAI", "long", "short"]:
            if not (len(obj) <= 4 and obj.isupper()):
                paths.append(obj)

strings = []
collect_strings(en_data, strings)
batch = strings[:50]

payload_parts = []
for idx, text in enumerate(batch):
    placeholders = re.findall(r'\{[^}]+\}', text)
    temp_text = text
    for i, placeholder in enumerate(placeholders):
        temp_text = temp_text.replace(placeholder, f" _PH_{i}_ ")
    escaped_text = html.escape(temp_text)
    payload_parts.append(f'<i id="{idx}">{escaped_text}</i>')

payload = "".join(payload_parts)

url = "https://translate.googleapis.com/translate_a/single"
params = {
    "client": "gtx",
    "sl": "en",
    "tl": "el",
    "dt": "t",
    "q": payload
}

full_url = f"{url}?{urllib.parse.urlencode(params)}"
req = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode('utf-8'))
    joined = "".join([p[0] for p in data[0] if p[0]])
    with open("greek_batch1_out.txt", "w", encoding="utf-8") as f:
        f.write(joined)
    print("Batch 1 translated and saved.")
