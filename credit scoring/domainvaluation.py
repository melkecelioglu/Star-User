import requests
from datetime import datetime, timedelta

def verify_domain_ownership(addr):
    try:
        # Step 1: Get the token ID
        token_response = requests.get(f'https://api.starknet.id/addr_to_domain?addr={addr}')
        token_response.raise_for_status()
        token_data = token_response.json()
    except requests.exceptions.RequestException as e:
        return False, f"Error fetching token ID: {e}"
    except ValueError:
        return False, "Error parsing JSON response for token ID"

    print(f"Token response: {token_data}")

    if 'token_id' not in token_data:
        return False, "Token ID not found for this address."

    token_id = token_data['token_id']
    
    try:
        # Step 2: Get the domain data
        domain_response = requests.get(f'https://api.starknet.id/id_to_data?id={token_id}')
        domain_response.raise_for_status()
        domain_data = domain_response.json()
    except requests.exceptions.RequestException as e:
        return False, f"Error fetching domain data: {e}"
    except ValueError:
        return False, "Error parsing JSON response for domain data"

    print(f"Domain response: {domain_data}")

    if 'domain' not in domain_data:
        return False, "No domain data found for this token ID."

    creation_date = domain_data['domain']['creation_date']

    # Step 3: Check if the domain is owned for more than 3 months
    creation_datetime = datetime.fromtimestamp(creation_date)
    three_months_ago = datetime.now() - timedelta(days=90)

    if creation_datetime < three_months_ago:
        return True, "Domain has been owned for more than 3 months."
    else:
        return False, "Domain has not been owned for more than 3 months."

def update_credit_score(user_address, current_credit_score):
    # Placeholder function to update the user's credit score
    new_credit_score = current_credit_score * 1.25
    print(f"Updated credit score for {user_address}: {new_credit_score}")
    return new_credit_score

def connect_wallet():
    user_address = input("Enter your wallet address: ")
    return user_address

def get_current_credit_score(user_address):
    # Placeholder function to retrieve the current credit score
    return 100  # Example fixed value

def main():
    user_address = connect_wallet()
    if not user_address:
        print("Failed to connect wallet")
        return

    is_owner, message = verify_domain_ownership(user_address)
    if is_owner:
        current_credit_score = get_current_credit_score(user_address)
        update_credit_score(user_address, current_credit_score)
    else:
        print("Failed:", message)

if __name__ == "__main__":
    main()

