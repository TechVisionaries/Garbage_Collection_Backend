import jwt from 'jsonwebtoken';

// Token generator for logging
const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' });
};

// Token generator for refresh token
const regenerateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

// Export the functions correctly
export { generateAccessToken, regenerateAccessToken, generateRefreshToken };
