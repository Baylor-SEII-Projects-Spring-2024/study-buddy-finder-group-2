import subprocess

ip = "34.16.169.60"
response = subprocess.run(['ping', '-c', '4', ip], stdout=subprocess.PIPE, text=True).stdout
if "0% packet loss" in response:
    print("SUCCESS")
else:
    print("FAILURE: Check server")
