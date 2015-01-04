"use strict";

module.exports.handleError = function handleError(err, req, res, next) {
    res.status(err.status)
        .json({
            status: err.status,
            message: err.message
        });
    next();
};

module.exports.operationNotPossible = function operationNotPossible(req, res, next) {
    next({
        status: 405,
        message: "operation not possible"
    });
};