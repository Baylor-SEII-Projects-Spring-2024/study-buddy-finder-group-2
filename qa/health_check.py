import subprocess

def ping_server(ip):
    response = subprocess.run(['ping', '-c', '4', ip], stdout=subprocess.PIPE, text=True)
    return response.stdout

def main():
    server_ip = "34.16.169.60"
    ping_result = ping_server(server_ip)
    if "0% packet loss" in ping_result:
        print("Server is up")
    else:
        print("Check server")

if __name__ == "__main__":
    main()
