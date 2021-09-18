import torch
from transformers import RobertaForSequenceClassification, RobertaTokenizer

MODEL_PATH='./detectors/combine_256.pt'
MODEL_NAME='roberta-large'

print('Initializing text validation...')

model = RobertaForSequenceClassification.from_pretrained(MODEL_NAME)
state_dict = torch.load(MODEL_PATH, map_location='cpu')
model.load_state_dict(state_dict['model_state_dict'], strict=False)
model.eval()

tokenizer = RobertaTokenizer.from_pretrained(MODEL_NAME)

def validateText(text):
    tokens = tokenizer.encode(text)[:tokenizer.model_max_length - 2]
    tokens = torch.tensor([tokenizer.bos_token_id] + tokens + [tokenizer.bos_token_id]).unsqueeze(0)
    mask = torch.ones_like(tokens)

    with torch.no_grad():
        logits = model(tokens.to('cpu'), attention_mask=mask.to('cpu'))[0]
        probs = logits.softmax(dim=-1)

        probGen, probReal = probs.detach().cpu().flatten().numpy().tolist()
        return probGen
