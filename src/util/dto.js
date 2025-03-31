export const toUserDTO = (doc) => {
    return {
        username: doc.username,
        isAdmin: doc.isAdmin,
        _id: doc._id
    }
}