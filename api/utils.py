import base64
import json
import os
import time

import arweave
from arweave.arweave_lib import Transaction
from eth_account.messages import encode_defunct
from hexbytes import HexBytes
from web3.auto import w3

from .models import Following, followings_schema


SERIALIZED_GRAPH_PATH = 'social_graph'


def verify_signature(data, signature):
    message = encode_defunct(text= json.dumps(data, separators=(',', ':')))
    signature = HexBytes(signature)

    return w3.eth.account.recover_message(message, signature=signature)


def _get_wallet():
    pb_str = os.environ.get('AR_PRIVATE_KEY', '')
    if pb_str == '':
        print("wallet private key doesn't exist")
        return
    pb_str = base64.b64decode(pb_str.encode('ascii')).decode('ascii')
    wallet = arweave.Wallet.from_data(json.loads(pb_str))
    print(f"Wallet balance: {wallet.balance}")
    return wallet


# call this function when social graph is updated(when post or delete endpoint is called)
def update_db_file():
    if not os.environ.get('ENABLE_AR_UPLOAD', '').upper() == 'TRUE':
        print("AR Upload not enabled.")
        return

    lines = []
    for following in Following.query.all():
        lines.append(f"{following.from_addr},{following.to_addr},{following.alias},{following.namespace}")
    data = '\n'.join(lines)

    wallet = _get_wallet()
    transaction = Transaction(wallet, data=data)
    transaction.sign()
    transaction.send()
