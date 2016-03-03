var connectionString = (function() {
    var dbName = "track",
        dbPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017,
        dbHost = process.env.OPENSHIFT_MONGODB_DB_HOST || "127.0.0.1",
        dbUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME || "",
        dbPassword = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || "";

    var hasAuth = dbUser && dbPassword;

    var auth = hasAuth ? dbUser + ":" + dbPassword + "@" : "";

    var conStr = "mongodb://" + auth + dbHost + ":" + dbPort + "/" + dbName;

    return conStr;
})();

var secretKey = [164, 60, 194, 0, 161, 189, 41, 38, 130, 89, 141, 164, 45, 170, 159, 209, 69, 137, 243, 216, 191, 131, 47, 250, 32, 107, 231, 117, 37, 158, 225, 234];

var useAuthToken = true;

var appPort = process.env.OPENSHIFT_NODEJS_PORT || 1337;

var ipAddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

// change the debug rule as you please
var isDebug = appPort === 1337;

module.exports = {
    connectionString: connectionString,
    secret: new Buffer(secretKey),
    useAuthToken: useAuthToken,
    appPort: appPort,
    ipAddress: ipAddress,
    isDebugEnabled: isDebug
};