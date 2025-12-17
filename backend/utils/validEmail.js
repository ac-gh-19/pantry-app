exports.isValidEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return false;
    }

    // Basic sanity checks
    if (email.length > 254) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
};
