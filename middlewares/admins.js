module.exports.adminsOnly = (req, res, next) => {
    next();
    // if ( req.user.admin ) { next() }
    // else { 
    //     res.status(401);
    //     res.json({status: "Unauthorized"});  
    // }
}

module.exports.ownersOnly = (req, res, next) => {
    next();
    // if (req.isAuthenticated() && ( req.user._id == req.params.id || req.user.admin ) ) { next() }
    // else { 
    //     res.status(401);
    //     res.json({status: "Unauthorized"});  
    // }
}
