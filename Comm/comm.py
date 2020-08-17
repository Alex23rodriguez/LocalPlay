from flask import Flask, render_template, Response, request
import queue
from uuid import uuid4

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

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

announcer = MessageAnnouncer()
def make_emiter_listener_pair(emiter_path, listener_path):
    exec(f'''@app.route('/{emiter_path}', methods=['POST'])
def _{str(uuid4()).replace('-', '_')}():
    msg = format_sse(data=request.data.decode())
    announcer.announce(msg=msg)
    return {{}}, 200''')
    exec(f'''@app.route('/{listener_path}', methods=['GET'])
def _{str(uuid4()).replace('-','_')}():
    def stream():
        messages = announcer.listen()
        while True:
            msg = messages.get()
            yield msg
    return Response(stream(), mimetype='text/event-stream')''')

if __name__=="__main__":
    make_emiter_listener_pair('ping', 'listen')
    make_emiter_listener_pair('ping2', 'listen2')
    app.run(host="0.0.0.0", port=5000)