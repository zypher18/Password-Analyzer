import re
import random
import string
import math

# A small password blacklist; in real-world use, this would be a much larger dataset.
PASSWORD_BLACKLIST = ['password', '123456', '123456789', 'qwerty', 'abc123', 'password1', '111111', 'welcome', 'iloveyou']

# Function to analyze password complexity
def analyze_password_complexity(password):
    length = len(password)
    has_lower = bool(re.search(r'[a-z]', password))
    has_upper = bool(re.search(r'[A-Z]', password))
    has_digit = bool(re.search(r'\d', password))
    has_special = bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))

    complexity_score = sum([has_lower, has_upper, has_digit, has_special])

    # Password complexity based on variety of character sets used
    if length >= 12 and complexity_score == 4:
        complexity = "Very Complex"
    elif length >= 8 and complexity_score >= 3:
        complexity = "Moderately Complex"
    else:
        complexity = "Simple or Weak"

    return complexity, complexity_score

# Function to calculate password entropy
def calculate_entropy(password):
    pool_size = 0
    if re.search(r'[a-z]', password):
        pool_size += 26  # Lowercase letters
    if re.search(r'[A-Z]', password):
        pool_size += 26  # Uppercase letters
    if re.search(r'\d', password):
        pool_size += 10  # Digits
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        pool_size += len('!@#$%^&*(),.?":{}|<>')  # Special characters

    if pool_size == 0:
        return 0
    entropy = len(password) * math.log2(pool_size)
    return entropy

# Function to calculate brute force time estimate
def brute_force_time(entropy, attempts_per_second=1e10):
    # Attempts per second is a rough estimate of a modern high-speed cracking system
    total_combinations = 2**entropy
    seconds = total_combinations / attempts_per_second
    minutes = seconds / 60
    hours = minutes / 60
    days = hours / 24
    years = days / 365
    return years

# Function to check if password is in the blacklist
def check_blacklist(password):
    return password.lower() in PASSWORD_BLACKLIST

# Function to recommend a strong password
def recommend_password():
    return """
    Recommendations for a strong password:
    1. Use at least 12 characters.
    2. Include uppercase and lowercase letters.
    3. Include numbers and special characters.
    4. Avoid common words, patterns, or sequences (e.g., "password123").
    """

# Function to generate a strong random password
def generate_strong_password():
    length = 12
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(characters) for i in range(length))
    return password

# Main function for password analysis
def analyze_password(password):
    # Analyze complexity
    complexity, complexity_score = analyze_password_complexity(password)
    
    # Calculate entropy
    entropy = calculate_entropy(password)
    
    # Estimate brute force time
    brute_force_years = brute_force_time(entropy)
    
    # Check if the password is blacklisted
    is_blacklisted = check_blacklist(password)
    
    # Return results
    return {
        "complexity": complexity,
        "complexity_score": complexity_score,
        "entropy": entropy,
        "brute_force_years": brute_force_years,
        "is_blacklisted": is_blacklisted
    }

# Get user input for the password
password = input("Enter a password to analyze: ")

# Analyze the password
analysis = analyze_password(password)

# Display results
print(f"Password Complexity: {analysis['complexity']}")
print(f"Password Entropy: {analysis['entropy']:.2f} bits")
print(f"Brute Force Time Estimate: {analysis['brute_force_years']:.2e} years")
print(f"Password Blacklisted: {'Yes' if analysis['is_blacklisted'] else 'No'}")

# Provide feedback on blacklisted password
if analysis['is_blacklisted']:
    print("Warning: This password is commonly used and very insecure. Please choose a different password.")

# If the password is not complex or is blacklisted, give recommendations
if analysis['complexity_score'] < 4 or analysis['is_blacklisted']:
    print(recommend_password())

    # Ask the user if they want to generate a strong password
    generate = input("Would you like to generate a secure password? (y/n): ")
    if generate.lower() == 'y':
        strong_password = generate_strong_password()
        print(f"Generated password: {strong_password}")
