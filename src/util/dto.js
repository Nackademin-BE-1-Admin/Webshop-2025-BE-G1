export const toUserDTO = (doc) => {
    return {
        email: doc.email,
        firstName: doc.firstName,
        lastname: doc.lastName,
        isAdmin: doc.isAdmin,
        _id: doc._id
    }
}