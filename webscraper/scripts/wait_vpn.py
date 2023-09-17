import socket
import time
import logging
import sys

launcher_path = sys.argv[1]

logger = logging.getLogger("wait_vpn_logger")
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(f"{launcher_path}/temp/wait_vpn.log")
logger.addHandler(handler)
handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s", "%Y-%m-%d %H:%M:%S"))


def check_socket_connection():
    while True:
        try:
            socket.create_connection(("google.com", 80), timeout=5)
            print("Socket connection is available!")
            return
        except Exception as e:
            print(f"Socket connection failed: {e}")
            pass
        print("Waiting for socket connection...")
        time.sleep(5)


check_socket_connection()
