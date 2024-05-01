"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../database/models/User"));
var Role;
(function (Role) {
    Role["Admin"] = "admin";
    Role["customer"] = "customer";
})(Role || (exports.Role = Role = {}));
class AuthMiddleware {
    isAthenticated(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // get token form user
            const token = req.headers.authorization;
            if (!token || token === undefined) {
                res.status(403).json({
                    message: "Token not found"
                });
                return;
            }
            // verify token if it it is legit or tampered 
            jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.status(403).json({
                        message: "Invalid token"
                    });
                }
                else {
                    // check if that decoded object id user exist or not
                    try {
                        const userData = yield User_1.default.findByPk(decoded.id);
                        if (!userData) {
                            res.status(403).json({
                                messsgea: "No user with that token was found"
                            });
                            return;
                        }
                        req.user = userData;
                        next();
                    }
                    catch (error) {
                        res.status(500).json({
                            message: " Something went wrong"
                        });
                    }
                }
            }));
        });
    }
    restrictTo(...roels) {
        return (req, res, next) => {
            var _a;
            let userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
            /* This line of code is checking if the `userRole` extracted from the request object is included in the array of roles passed as arguments to the `restrictTo` method. */
            if (!roels.includes(userRole)) {
                res.status(403).json({
                    meassage: " You don't have permission"
                });
            }
            else {
                next();
            }
        };
    }
}
exports.default = new AuthMiddleware();
