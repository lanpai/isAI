import torch
import numpy as np
import torchvision.transforms as transforms
from PIL import Image
from detectors.CNNDetection.networks.resnet import resnet50

MODEL_PATH = './detectors/CNNDetection/weights/blur_jpg_prob0.1.pth'

print('Initializing image validation...')

model = resnet50(num_classes=1)
state_dict = torch.load(MODEL_PATH, map_location='cpu')
model.load_state_dict(state_dict['model'])
# model.cuda()
model.eval()

trans = transforms.Compose([
    transforms.TenCrop(224),
    transforms.Lambda(lambda images: torch.stack([
        transforms.ToTensor()(image)
        for image in images ])),
    transforms.Lambda(lambda images: torch.stack([
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])(image)
        for image in images ]))])

def validateImage(img):
    transImages = trans(Image.open(img).convert('RGB'))

    with torch.no_grad():
        in_tens = transImages.unsqueeze(0)
        # in_tens = in_tens.cuda()
        bs, ncrops, c, h, w = in_tens.size()
        res = model(in_tens.view(-1, c, h, w))
        return res.view(bs, ncrops, -1).mean(1).sigmoid().item()
