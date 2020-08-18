from flask import Response, request, Flask
import queue
from uuid import uuid4
import re


class MessageAnnouncer:
    def __init__(self):
        self.listeners = []

    def listen(self):
        self.listeners.append(queue.Queue(maxsize=5))
        return self.listeners[-1]

    def announce(self, msg):
        # We go in reverse order because we might have to delete an element, which will shift the
        # indices backward
        for i in reversed(range(len(self.listeners))):
            try:
                self.listeners[i].put_nowait(msg)
            except queue.Full:
                del self.listeners[i]


def format_sse(data: str, event=None) -> str:
    msg = f'data: {data}\n\n'
    if event is not None:
        msg = f'event: {event}\n{msg}'
    return msg


announcers = {}

emiter_string = '''
@app.route('/{0}', methods=['POST'])
def {1}():
    msg = format_sse(data=request.data.decode())
    announcers['{1}'].announce(msg=msg)
    return dict(), 200
'''

listener_string = '''
@app.route('/{0}', methods=['GET'])
def {1}_l():
    def stream():
        messages = announcers['{1}'].listen()
        while True:
            msg = messages.get()
            yield msg
    return Response(stream(), mimetype='text/event-stream')
'''

def make_emiter_listener_pair(app: Flask, emiter_path: str, listener_path: str):
    assert type(app) == Flask, "first argument must be a Flask app instance"
    for path in (emiter_path, listener_path):
        assert re.match(r'^/[\w/-]+$', path), "paths must start with / and contain only a-zA-Z0-9 and '-',  '_', '/'"

    uid = '_' + uuid4().hex
    announcers[uid] = MessageAnnouncer()

    exec(emiter_string.format(emiter_path, uid))
    exec(listener_string.format(listener_path, uid))