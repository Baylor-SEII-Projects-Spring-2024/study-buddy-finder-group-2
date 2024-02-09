import requests

def get_http_status_codes(urls):
    responses = []
    for url in urls:
        try:
            response = requests.get(url)
            responses.append(response.status_code)
        except requests.RequestException as e:
            responses.append(str(e))
    return responses

def main():
    urls = ['http://34.16.169.60:3000', 'http://34.16.169.60:8080/ping']
    status_codes = get_http_status_codes(urls)
    for code in status_codes:
        if 200 <= code < 300:
            print('SUCCESS')
        else:
            print('FAILURE: ' + code)

if __name__ == "__main__":
    main()
