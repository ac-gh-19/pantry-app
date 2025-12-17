exports.signup = (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
}

exports.login = (req, res) => {
    res.json({message: 'login endpoint'})
}