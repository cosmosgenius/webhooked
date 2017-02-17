class ValidationError extends Error {
    constructor (msg, status=400) {
        super();
        this.message = msg;
        this.status = status;
    }
}

module.exports.ValidationError = ValidationError;
