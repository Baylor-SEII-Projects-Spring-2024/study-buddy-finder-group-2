import requests

responses = []
urls = ['http://34.16.169.60:3000',
        'http://34.16.169.60:3000/viewMeetups',
        'http://34.16.169.60:3000/tutorLanding',
        'http://34.16.169.60:3000/studentLanding',
        'http://34.16.169.60:3000/searchUsers',
        'http://34.16.169.60:3000/searchCourses',
        'http://34.16.169.60:3000/registration',
        'http://34.16.169.60:3000/passwordReset',
        'http://34.16.169.60:3000/other',
        'http://34.16.169.60:3000/me',
        'http://34.16.169.60:3000/login',
        'http://34.16.169.60:3000/invitations',
        'http://34.16.169.60:3000/editMeetup',
        'http://34.16.169.60:3000/editCourse',
        'http://34.16.169.60:8080/ping'
]

for url in urls:
    try:
        response = requests.get(url)
        responses.append(response.status_code)
    except requests.RequestException as e:
        responses.append(str(e))

success,fail = 0,0
for code in responses:
    if 200 <= code < 300:
        print('SUCCESS')
        success += 1
    else:
        print('FAILURE: ' + str(code))
        fail += 1

if fail > 0:
    print('\n\n\nSome checks failed \n\n\n')
