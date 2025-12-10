export function checkAuth(token) {
    return (req, res, next) => {
        if (req.headers.authorization !== token) {
            res.sendStatus(401);
            return;
        }
        next();
    };
}
//# sourceMappingURL=check-auth.js.map