from flask import Flask, Response, request

from image_validation import validateImage

app = Flask(__name__)

@app.route('/')
def getRoot():
    return Response('GET /', mimetype='text/plain')

@app.route('/validate/image', methods=['POST'])
def postImage():
    prob = validateImage(request.files['data'])
    return Response(f"{{prob:{prob}}}", mimetype='application/json')

def main():
    print('Starting server')

if __name__ == '__main__':
    main()
