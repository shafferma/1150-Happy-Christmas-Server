module.exports = {
    getWebAddress: function(req) {
        return `${req.protocol}://${req.get('host')}`
    }
}