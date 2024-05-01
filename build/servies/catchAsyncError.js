"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            return res.status(500).json({
                messsage: "Internal Server Error",
                errorMessage: err.message
            });
        });
    };
};
exports.default = errorHandler;
