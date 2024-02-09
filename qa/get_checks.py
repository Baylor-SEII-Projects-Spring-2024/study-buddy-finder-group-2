import requests

responses = []
urls = ['http://34.16.169.60:3000', 'http://34.16.169.60:8080/ping']
for url in urls:
    try:
        response = requests.get(url)
        responses.append(response.status_code)
    except requests.RequestException as e:
        responses.append(str(e))

for code in responses:
    if 200 <= code < 300:
        print('SUCCESS')
    else:
        print('FAILURE: ' + code)
