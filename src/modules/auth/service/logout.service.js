

// In-memory blacklist
const blacklistedTokens = new Set();

export const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    if (isTokenBlacklisted(token)) {
      return res.status(400).json({ message: "User already logged out" });
    }

    // Add token to blacklist
    blacklistedTokens.add(token);

    return res.status(200).json({
      message: "Logout successful. Token is now invalidated."
    });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", error: error.message });
  }
};
