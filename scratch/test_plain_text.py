import urllib.request
import urllib.parse
import json

lines = [
    "0 ||| Pricing",
    "1 ||| Features",
    "2 ||| Results",
    "3 ||| Case Studies",
    "4 ||| Resources",
    "5 ||| Insights",
    "6 ||| Learn"
]
payload = "\n".join(lines)

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
    with open("plain_test_out.txt", "w", encoding="utf-8") as f:
        f.write(joined)
    print("Plain text translation saved.")
