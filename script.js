
function analyzePassword() {
    const password = document.getElementById('password').value;

    // Check if the password input is empty
    if (!password) {
        alert("Please enter a password.");
        return;  // Stop execution if the password is empty
    }

    const PASSWORD_BLACKLIST = ['password', '123456', '123456789', 'qwerty', 'abc123', 'password1', '111111', 'welcome', 'iloveyou'];

    function analyzePasswordComplexity(password) {
        const length = password.length;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const complexityScore = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;

        let complexity;
        if (length >= 12 && complexityScore === 4) {
            complexity = "Very Complex";
        } else if (length >= 8 && complexityScore >= 3) {
            complexity = "Moderately Complex";
        } else {
            complexity = "Simple or Weak";
        }

        return { complexity, complexityScore };
    }

    function calculateEntropy(password) {
        let poolSize = 0;
        if (/[a-z]/.test(password)) poolSize += 26;
        if (/[A-Z]/.test(password)) poolSize += 26;
        if (/\d/.test(password)) poolSize += 10;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) poolSize += 23;

        if (poolSize === 0) return 0;
        return password.length * Math.log2(poolSize);
    }

    // Updated brute force time estimate function
    function bruteForceTime(entropy, attemptsPerSecond = 1e10) {
        const totalCombinations = Math.pow(2, entropy);
        const seconds = totalCombinations / attemptsPerSecond;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        const years = days / 365;

        // Display the result in a human-readable format
        if (years >= 1) {
            return `${years.toFixed(2)} years`; // If more than 1 year
        } else if (days >= 1) {
            return `${days.toFixed(2)} days`; // If less than a year but more than a day
        } else if (hours >= 1) {
            return `${hours.toFixed(2)} hours`; // If less than a day but more than an hour
        } else if (minutes >= 1) {
            return `${minutes.toFixed(2)} minutes`; // If less than an hour but more than a minute
        } else {
            return `${seconds.toFixed(2)} seconds`; // If less than a minute
        }
    }

    function checkBlacklist(password) {
        return PASSWORD_BLACKLIST.includes(password.toLowerCase());
    }

    function recommendPassword() {
        return `
        Recommendations for a strong password:
        1. Use at least 12 characters.
        2. Include uppercase and lowercase letters.
        3. Include numbers and special characters.
        4. Avoid common words, patterns, or sequences (e.g., "password123").
        `;
    }

    function generateStrongPassword() {
        const length = 12;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(),.?":{}|<>';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    }

    // Analyze password complexity
    const { complexity, complexityScore } = analyzePasswordComplexity(password);
    const entropy = calculateEntropy(password);
    const bruteForceEstimate = bruteForceTime(entropy);
    const isBlacklisted = checkBlacklist(password);

    // Display the results
    let report = `Password Complexity: ${complexity}\n`;
    report += `Password Entropy: ${entropy.toFixed(2)} bits\n`;
    report += `Brute Force Time Estimate: ${bruteForceEstimate}\n`;  // Use human-readable format here
    report += `Password Blacklisted: ${isBlacklisted ? 'Yes' : 'No'}`;
    document.getElementById("report").innerText = report;

    // Display recommendations if password is weak or moderately complex
    if (complexity === "Simple or Weak" || complexity === "Moderately Complex") {
        document.getElementById("recommend").innerText = recommendPassword();
    } else {
        document.getElementById("recommend").innerText = "";
    }

    // Show warning if password is blacklisted
    if (isBlacklisted) {
        document.getElementById("warn").innerText = "Warning: This password is commonly used and very insecure. Please choose a different password.";
    } else {
        document.getElementById("warn").innerText = "";
    }

    // Generate a strong password if the checkbox is checked
    if (document.getElementById("generate").checked) {
        const strongPassword = generateStrongPassword();
        document.getElementById("result").innerText = `Generated password: ${strongPassword}`;
    } else {
        document.getElementById("result").innerText = "";
    }
}
