const { verifyToken, generateToken } = require('../../utils/jwt');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
 
  if (!token) return res.status(403).json({ message: 'Token required' });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;

    // ROTATE TOKEN: send a new one in header
    const newToken = await generateToken({ id: decoded.id, email: decoded.email , role: decoded.role, twofaEnabled: decoded.twofaEnabled });   
    
    res.setHeader('x-access-token', newToken);

    next();
  } catch (err) {  
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
