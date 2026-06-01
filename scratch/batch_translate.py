import json
import urllib.request
import urllib.parse
import re
import time
import sys

def translate_batch(batch, target_lang):
    if not batch:
        return []
    
    lines = []
    placeholders_map = []
    
    for idx, text in enumerate(batch):
        # Protect placeholders like {step}, {percentage}, etc.
        placeholders = re.findall(r'\{[^}]+\}', text)
        temp_text = text
        for i, placeholder in enumerate(placeholders):
            temp_text = temp_text.replace(placeholder, f" _PH_{i}_ ")
        
        # Replace newlines with a token so the lines match 1-to-1
        temp_text = temp_text.replace("\n", " _NL_ ")
        lines.append(f"{idx} ||| {temp_text}")
        placeholders_map.append(placeholders)
        
    payload = "\n".join(lines)
    
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": "en",
        "tl": target_lang,
        "dt": "t",
        "q": payload
    }
    
    encoded_params = urllib.parse.urlencode(params)
    full_url = f"{url}?{encoded_params}"
    
    try:
        req = urllib.request.Request(
            full_url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=20) as response:
            data = json.loads(response.read().decode('utf-8'))
            translated_parts = [part[0] for part in data[0] if part[0]]
            translated_payload = "".join(translated_parts)
            
            # Split lines
            translated_lines = translated_payload.split("\n")
            
            # Parse lines
            translated_map = {}
            for line in translated_lines:
                if " ||| " in line:
                    parts = line.split(" ||| ", 1)
                    try:
                        idx_val = int(parts[0].strip())
                        translated_map[idx_val] = parts[1].strip()
                    except ValueError:
                        # Try parsing if Google Translate mangled the spaces slightly (e.g., "0||| " or "0 | | | ")
                        # Let's match digits at the beginning of the line
                        match = re.match(r'^\s*(\d+)\s*\|*\|*\|*\s*(.*)$', line)
                        if match:
                            try:
                                idx_val = int(match.group(1))
                                translated_map[idx_val] = match.group(2).strip()
                            except ValueError:
                                pass
                else:
                    # Try matching digits at the start of a line even if "|||" is missing or mangled
                    match = re.match(r'^\s*(\d+)\s*[\|\|\s\-\:]+\s*(.*)$', line)
                    if match:
                        try:
                            idx_val = int(match.group(1))
                            translated_map[idx_val] = match.group(2).strip()
                        except ValueError:
                            pass
            
            # Reconstruct the results
            results = []
            mismatch = False
            for idx in range(len(batch)):
                if idx in translated_map:
                    trans_text = translated_map[idx]
                    
                    # Restore newlines
                    trans_text = trans_text.replace(" _NL_ ", "\n").replace(" _nl_ ", "\n")
                    
                    # Restore placeholders
                    placeholders = placeholders_map[idx]
                    for i, placeholder in enumerate(placeholders):
                        pattern = rf'\s*_PH_{i}_\s*|\s*_ph_{i}_\s*'
                        trans_text = re.sub(pattern, placeholder, trans_text)
                    results.append(trans_text)
                else:
                    print(f"Warning: Index {idx} not found in translated map. Mapped indices: {list(translated_map.keys())}", file=sys.stderr)
                    mismatch = True
                    break
                    
            if not mismatch:
                return results
                
            print(f"Warning: Plain text index parsing mismatch. Falling back to individual translation.", file=sys.stderr)
            return [translate_single(text, target_lang) for text in batch]
            
    except Exception as e:
        print(f"Error in batch translation: {e}. Falling back to individual translation.", file=sys.stderr)
        return [translate_single(text, target_lang) for text in batch]

def translate_single(text, target_lang):
    if not text.strip():
        return text
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
            for i, placeholder in enumerate(placeholders):
                pattern = rf'\s*_PH_{i}_\s*|\s*_ph_{i}_\s*'
                translated = re.sub(pattern, placeholder, translated)
            return translated
    except Exception as e:
        print(f"Error translating single '{text}': {e}", file=sys.stderr)
        return text

def collect_strings(obj, paths, current_path=[]):
    if isinstance(obj, dict):
        for k, v in obj.items():
            collect_strings(v, paths, current_path + [k])
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            collect_strings(item, paths, current_path + [i])
    elif isinstance(obj, str):
        if obj not in ["BTC", "ETH", "SOL", "USDT", "$0", "Pro", "Free", "Enterprise", "Aura", "AuraAI", "long", "short"]:
            if not (len(obj) <= 4 and obj.isupper()):
                paths.append((current_path, obj))

def set_by_path(obj, path, value):
    current = obj
    for part in path[:-1]:
        current = current[part]
    current[path[-1]] = value

def main():
    if len(sys.argv) < 3:
        print("Usage: python batch_translate.py <target_lang> <output_file>")
        sys.exit(1)
        
    target_lang = sys.argv[1]
    output_file = sys.argv[2]
    
    print(f"Loading en.json...")
    with open("../context/en.json", "r", encoding="utf-8") as f:
        en_data = json.load(f)
        
    translated_data = json.loads(json.dumps(en_data))
    
    print(f"Collecting strings...")
    paths_and_strings = []
    collect_strings(en_data, paths_and_strings)
    print(f"Found {len(paths_and_strings)} translatable strings.")
    
    # Batch size of 40 for stability
    batch_size = 40
    batches = [paths_and_strings[i:i + batch_size] for i in range(0, len(paths_and_strings), batch_size)]
    
    print(f"Translating to {target_lang} in {len(batches)} batches...")
    for i, batch in enumerate(batches):
        print(f"Processing batch {i+1}/{len(batches)}...", flush=True)
        strings_to_translate = [s for path, s in batch]
        translated_strings = translate_batch(strings_to_translate, target_lang)
        
        for (path, original), translated in zip(batch, translated_strings):
            set_by_path(translated_data, path, translated)
            
        time.sleep(0.5)
        
    print(f"Saving to {output_file}...")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
        
    print("Done!", flush=True)

if __name__ == "__main__":
    main()
