exports.adminLogin = (req, res) => {
    const { email, password } = req.body;
  
    // Hardcoded for now (you can store in DB later)
    if (email === 'admin@thiaworld.com' && password === 'admin123') {
      return res.status(200).json({ token: 'thiaworld_admin_token_123' });
    }
  
    res.status(401).json({ error: 'Invalid credentials' });
  };
  