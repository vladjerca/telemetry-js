var connectionString = (function() {
    var dbName = 'track',
        dbPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017,
        dbHost = process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1',
        dbUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME || '',
        dbPassword = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || '';
    
    var conStr = 'mongodb://' + dbUser + ':' + dbPassword + '@' + dbHost + ':' + dbPort + '/' + dbName;

    return conStr;
})();

var secretKey = [164, 60, 194, 0, 161, 189, 41, 38, 130, 89, 141, 164, 45, 170, 159, 209, 69, 137, 243, 216, 191, 131, 47, 250, 32, 107, 231, 117, 37, 158, 225, 234];

var useAuthToken = true;

module.exports = {
    connectionString: connectionString,
    secret: new Buffer(secretKey),
    useAuthToken: useAuthToken
};
