import requests

print('Retrieving weights for CNNDetection...')
with requests.get('https://www.dropbox.com/s/2g2jagq2jn1fd0i/blur_jpg_prob0.5.pth?dl=1',
        allow_redirects=True) as r:
    open('./detectors/CNNDetection/weights/blur_jpg_prob0.5.pth', 'wb').write(r.content)
with requests.get('https://www.dropbox.com/s/h7tkpcgiwuftb6g/blur_jpg_prob0.1.pth?dl=1',
        allow_redirects=True) as r:
    open('./detectors/CNNDetection/weights/blur_jpg_prob0.1.pth', 'wb').write(r.content)

print('Retrieving weights for CTRL-detector')
with requests.get('https://storage.googleapis.com/sfr-ctrl-detector/combine_256.pt',
        allow_redirects=True) as r:
    open('./detectors/combine_256.pt', 'wb').write(r.content)
