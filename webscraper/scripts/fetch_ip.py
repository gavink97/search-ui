import requests

def fetch_public_ip():
    response = requests.get('https://api64.ipify.org?format=json')
    return response.json()['ip']

def fetch_location(public_ip):
    response = requests.get(f'https://ipinfo.io/{public_ip}/json')
    location_data = response.json()
    return location_data.get('city'), location_data.get('region'), location_data.get('country')

if __name__ == "__main__":
    public_ip = fetch_public_ip()
    city, region, country = fetch_location(public_ip)

    print(f"Public IP: {public_ip}")
    print(f"Location: {city}, {region}, {country}")
