from flask import Flask, render_template, Response, request
import queue

app = Flask(__name__)

@app.route('/')
def control():
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

announcer = MessageAnnouncer()

def format_sse(data: str, event=None) -> str:
    """Formats a string and an event name in order to follow the event stream convention.

    >>> format_sse(data=json.dumps({'abc': 123}), event='Jackson 5')
    'event: Jackson 5\\ndata: {"abc": 123}\\n\\n'

    """
    msg = f'data: {data}\n\n'
    if event is not None:
        msg = f'event: {event}\n{msg}'
    return msg

def make_emiter(path):
    @app.route(f'/{path}', methods=['GET'])
    def emiter():
        msg = format_sse(data=request.data.decode())
        announcer.announce(msg=msg)
        return {}, 200
    return emiter

def make_listener(path):
    @app.route(f'/{path}', methods=['GET'])
    def listener():
        def stream():
            messages = announcer.listen()  # returns a queue.Queue
            while True:
                msg = messages.get()  # blocks until a new message arrives
                yield msg
        return Response(stream(), mimetype='text/event-stream')
    return listener


if __name__=="__main__":
    make_emiter('test_ping')
    make_listener('test_listen')
    app.run(host="0.0.0.0", port=5000)