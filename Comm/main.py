from flask import Flask, render_template
from msg_announcer import make_emiter_listener_pair

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    make_emiter_listener_pair(app, '/ping', '/listen')
    make_emiter_listener_pair(app, '/ping2', '/listen2')
    app.run()