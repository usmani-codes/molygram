export const AdminsOnly = async (req, res, next) => {
    console.log('adminOnly ..')
    const payload = req.user

    console.log("payload", payload)

    if (payload.role === 'admin') {
        console.log('welcome to admin only ..!! ')
    } else {
        return res.status(403).json({ success: false, msg: 'un-authorized!! admins only' })
    }
    next()
}