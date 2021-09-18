from flask import Flask, Response

app = Flask(__name__)

@app.route('/')
def root():
    return Response('GET /', mimetype='text/plain')

def main():
    print('Starting server')

if __name__ == '__main__':
    main()
