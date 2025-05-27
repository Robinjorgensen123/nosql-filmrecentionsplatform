
export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Åtkomst nekad, Endast admin kan utföra denna åtgärd"
        })
    }
    next()
}