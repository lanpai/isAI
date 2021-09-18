import os
import sys
import torch
import torch.nn
import argparse
import numpy as np
import torchvision.transforms as transforms
import torchvision.datasets as datasets
from PIL import Image
from detectors.CNNDetection.networks.resnet import resnet50

MODEL_PATH='./detectors/CNNDetection/weights/blur_jpg_prob0.5.pth'

def validateImage(img):
    model = resnet50(num_classes=1)
    state_dict = torch.load(MODEL_PATH)
    model.load_state_dict(state_dict['model'])
    model.cuda()
    model.eval()

    trans = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])])

    img = trans(Image.open(img).convert('RGB'))

    with torch.no_grad():
        in_tens = img.unsqueeze(0)
        in_tens = in_tens.cuda()
        return model(in_tens).sigmoid().item()
