import socket
import time


def check_socket_connection():
    while True:
        try:
            socket.create_connection(("google.com", 80), timeout=5)
            print("Socket connection is available!")
            return
        except Exception as e:
            print(f"Socket connection failed: {e}")
            pass
        # fix error where in if gluetun resets properly connect
        print("Waiting for socket connection...")
        time.sleep(5)


check_socket_connection()
