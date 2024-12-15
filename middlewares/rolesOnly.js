export const RolesOnly = (...allowedRoles) => {
    return (req, res, next) => {
        const payload = req.user
        console.log('role based ..', allowedRoles, payload.role, allowedRoles.includes(payload.role))

        if (!allowedRoles.includes(payload.role)) {  // ['admin','manager','user'].includes('admin')
            return res.status(403).json({ success: false, msg: 'Access Denied..!! ' })
        }

        next()
    }
}