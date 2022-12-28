const get = (request) => {
    return {
        avatar: request.session.isLoggedIn ? request.session.account.avatar : 'https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg'
    }
}

module.exports = get;