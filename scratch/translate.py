import json
import urllib.request
import urllib.parse
import re
import time
import sys

def translate_text(text, target_lang):
    if not text.strip():
        return text
    
    # Protect placeholders like {step}, {percentage}, etc.
    placeholders = re.findall(r'\{[^}]+\}', text)
    temp_text = text
    for i, placeholder in enumerate(placeholders):
        temp_text = temp_text.replace(placeholder, f" _PH_{i}_ ")
        
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": "en",
        "tl": target_lang,
        "dt": "t",
        "q": temp_text
    }
    
    encoded_params = urllib.parse.urlencode(params)
    full_url = f"{url}?{encoded_params}"
    
    try:
        req = urllib.request.Request(
            full_url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            translated_parts = [part[0] for part in data[0] if part[0]]
            translated = "".join(translated_parts)
            
            # Restore placeholders
            for i, placeholder in enumerate(placeholders):
                # Google Translate might change the spacing around the placeholder, e.g. " _PH_0_ " to " _ PH_0_ " or similar
                # Let's use a regex that matches _PH_{i}_ with optional whitespace and case insensitivity
                pattern = rf'\s*_PH_{i}_\s*|\s*_ph_{i}_\s*'
                translated = re.sub(pattern, placeholder, translated)
                
            return translated
    except Exception as e:
        print(f"Error translating '{text}': {e}", file=sys.stderr)
        return text

def translate_json(obj, target_lang):
    if isinstance(obj, dict):
        new_dict = {}
        for k, v in obj.items():
            new_dict[k] = translate_json(v, target_lang)
        return new_dict
    elif isinstance(obj, list):
        return [translate_json(item, target_lang) for item in obj]
    elif isinstance(obj, str):
        # Don't translate if it looks like a code/symbol (e.g. "BTC", "USDT") or number
        if obj in ["BTC", "ETH", "SOL", "USDT", "$0", "Pro", "Free", "Enterprise", "Aura", "AuraAI", "long", "short"]:
            return obj
        # Try to avoid translating very short specific codes
        if len(obj) <= 4 and obj.isupper():
            return obj
        # Call translate
        time.sleep(0.1)  # Rate limiting safety
        return translate_text(obj, target_lang)
    else:
        return obj

def main():
    if len(sys.argv) < 3:
        print("Usage: python translate.py <target_lang> <output_file>")
        sys.exit(1)
        
    target_lang = sys.argv[1]
    output_file = sys.argv[2]
    
    print(f"Loading en.json...")
    with open("../context/en.json", "r", encoding="utf-8") as f:
        en_data = json.load(f)
        
    print(f"Translating to {target_lang}...")
    translated_data = translate_json(en_data, target_lang)
    
    print(f"Saving to {output_file}...")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
        
    print("Done!")

if __name__ == "__main__":
    main()
