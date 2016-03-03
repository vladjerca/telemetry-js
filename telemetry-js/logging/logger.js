var errorHandler = function(err) {
    if (err)
        console.log(err);
};

module.exports = {
    logError: errorHandler
};