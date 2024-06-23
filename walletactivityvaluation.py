import requests
import re

# Function to fetch user data from Voyager page
def fetch_users_data():
    url = 'https://voyager.online/active-users?ps=25&p=1&timeframe=day&attribute=fee_strk'
    response = requests.get(url)
    response.raise_for_status()
    page_content = response.text

    # Example regular expressions (you'll need to adjust these based on actual HTML structure)
    user_pattern = re.compile(r'<div class="user-class">.*?</div>', re.DOTALL)
    username_pattern = re.compile(r'<span class="username-class">(.*?)</span>')
    seniority_pattern = re.compile(r'<span class="seniority-class">(.*?) months</span>')
    transactions_pattern = re.compile(r'<span class="transactions-class">(.*?)</span>')
    frequency_pattern = re.compile(r'<span class="frequency-class">(.*?)</span>')
    wallet_address_pattern = re.compile(r'<span class="wallet-address-class">(.*?)</span>')  # Adjust based on actual HTML

    users_data = []

    for user_match in user_pattern.finditer(page_content):
        user_html = user_match.group(0)
        username = username_pattern.search(user_html).group(1)
        seniority = int(seniority_pattern.search(user_html).group(1).strip())
        transactions = int(transactions_pattern.search(user_html).group(1).strip())
        frequency = int(frequency_pattern.search(user_html).group(1).strip())
        wallet_address = wallet_address_pattern.search(user_html).group(1)  # Adjust based on actual HTML structure
        users_data.append({
            'username': username,
            'seniority': seniority,
            'transactions': transactions,
            'frequency': frequency,
            'wallet_address': wallet_address  # Include wallet address in user data
        })

    return users_data

# Function to calculate credit score
def calculate_credit_score(user):
    def calculate_seniority_score(seniority):
        if seniority >= 18:
            return 15
        elif seniority >= 12:
            return 10
        elif seniority >= 6:
            return 8
        elif seniority >= 3:
            return 4
        else:
            return 0

    def calculate_transaction_score(transactions):
        if transactions > 1000:
            return 29
        elif transactions > 600:
            return 21
        elif transactions > 400:
            return 16
        elif transactions > 250:
            return 12
        elif transactions > 150:
            return 9
        else:
            return 0

    def calculate_frequency_score(frequency):
        if frequency >= 15:
            return 20
        else:
            return 0

    seniority_score = calculate_seniority_score(user['seniority'])
    transaction_score = calculate_transaction_score(user['transactions'])
    frequency_score = calculate_frequency_score(user['frequency'])
    total_score = seniority_score + transaction_score + frequency_score
    return total_score

# Main function
def main():
    users_data = fetch_users_data()

    # Calculate credit scores
    for user in users_data:
        user['credit_score'] = calculate_credit_score(user)

    # Sort users by credit score in descending order
    users_data.sort(key=lambda x: x['credit_score'], reverse=True)

    # Display the score for a user based on wallet address input
    # In a real application, you would fetch the user's wallet address from their input
    wallet_address = input("Enter your Starknet wallet address to see your credit score: ")
    found_user = None

    for user in users_data:
        if user['wallet_address'] == wallet_address:  # Adjust this condition based on your identifier
            found_user = user
            break

    if found_user:
        print(f"Your credit score is: {found_user['credit_score']}")
    else:
        print("User not found or wallet address not matched.")

if __name__ == "__main__":
    main()
