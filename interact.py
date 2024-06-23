from web3 import Web3
import json

infura_url = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
web3 = Web3(Web3.HTTPProvider(infura_url))

contract_address = "YOUR_CONTRACT_ADDRESS"

contract_abi = json.loads('''[
    {
        "constant": false,
        "inputs": [
            {
                "name": "starkDomain",
                "type": "bool"
            },
            {
                "name": "age",
                "type": "uint8"
            },
            {
                "name": "amount",
                "type": "uint16"
            },
            {
                "name": "NFT",
                "type": "uint8"
            },
            {
                "name": "refereal1",
                "type": "address"
            },
            {
                "name": "frequency",
                "type": "bool"
            }
        ],
        "name": "setAllData",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
    // Ajoutez ici les autres fonctions de votre contrat que vous souhaitez appeler
]''')

contract = web3.eth.contract(address=contract_address, abi=contract_abi)

account_address = "YOUR_ACCOUNT_ADDRESS"
private_key = "YOUR_PRIVATE_KEY"

def set_all_data(stark_domain, age, amount, nft, refereal1, frequency):
    nonce = web3.eth.getTransactionCount(account_address)
    transaction = contract.functions.setAllData(stark_domain, age, amount, nft, refereal1, frequency).buildTransaction({
        'chainId': 1,
        'gas': 2000000,
        'gasPrice': web3.toWei('50', 'gwei'),
        'nonce': nonce,
    })

    signed_txn = web3.eth.account.signTransaction(transaction, private_key=private_key)
    tx_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    return web3.toHex(tx_hash)

def get_balance(account):
    balance = contract.functions.balanceOf(account).call()
    return balance

tx_hash = set_all_data(True, 3, 150, 1, "0xADDRESS_OF_REFEREAL", True)
print(f"Transaction sent with hash: {tx_hash}")

balance = get_balance("0xADDRESS_TO_CHECK_BALANCE")
print(f"Balance of account: {balance}")

