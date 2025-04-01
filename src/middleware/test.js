
// Maybe we will need to protect the test routes later?
export const mustBeDeveloper = (req, res, next) => {
    if (req.headers['x-dev-api-key'] !== 'jonatan123') {
        // res.status(401)
        // res.json({ error: `You must be a developer to do this.` })
        // return
    }

    next()
}