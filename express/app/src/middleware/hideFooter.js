const hideFooter = (req, res, next) => {
    // Check if the current route is one of the specified routes
    const hideFooterRoutes = ['/chat']; // Add more routes as needed
    res.locals.hideFooter = hideFooterRoutes.includes(req.path);
    next();
}

module.exports = hideFooter;