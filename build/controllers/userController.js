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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../database/models/User"));
class AuthController {
    // User Registration
    static registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password, role } = req.body;
                if (!username || !email || !password) {
                    res.status(400).json({
                        message: "Please enter username, email and password!!!"
                    });
                    return;
                }
                // The code is querying the database to find a user record based on the provided email. 
                const [data] = yield User_1.default.findAll({
                    where: {
                        email: email,
                    }
                });
                if (data) {
                    res.status(404).json({
                        message: "email already exists"
                    });
                    return;
                }
                yield User_1.default.create({
                    username,
                    email,
                    password: bcrypt_1.default.hashSync(password, 8),
                    role: role
                });
                res.status(200).json({
                    message: "User created successfully"
                });
            }
            catch (error) {
                res.status(500).json({
                    message: error.message
                });
            }
        });
    }
    // User Login
    static LoginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(403).json({
                        message: "Please enter your correct email and password"
                    });
                    return;
                }
                //check whether the user with above email and password exist or not
                const [data] = yield User_1.default.findAll({
                    where: {
                        email: email,
                    }
                });
                if (!data) {
                    res.status(404).json({
                        message: "User does not exist with provided email and password"
                    });
                    return;
                }
                //check password 
                const isMatched = bcrypt_1.default.compareSync(password, data.password);
                if (!isMatched) {
                    res.status(400).json({
                        message: "Invalid password"
                    });
                    return;
                }
                // Generate token
                const token = jsonwebtoken_1.default.sign({ id: data.id }, process.env.SECRET_KEY, {
                    expiresIn: "20d"
                });
                res.status(200).json({
                    messsage: " Login successful",
                    data: token
                });
            }
            catch (error) {
                console.error("Error occurred during login:", error);
                res.status(500).json({
                    message: "Internal server error"
                });
            }
        });
    }
}
exports.default = AuthController;
