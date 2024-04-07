import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from '../database/models/User';


/* The `interface AuthRequest extends Request` is extending the existing `Request` interface provided by Express in TypeScript. By extending the `Request` interface, we are adding additional properties to the request object that are specific to our application's authentication needs. */
interface AuthRequest extends Request {
    user?: {
        username: string,
        email: string,
        role: string,
        password: string,
        id: string
    }
}

/* The `enum Role` is defining a TypeScript enum with two members: `Admin` and `customer`. Each member is assigned a string value, where `Admin` is assigned the value `'admin'` and `customer` is assigned the value `'customer'`. This enum is used to represent different roles that a user can have within the application. By using an enum, you can ensure type safety and avoid hardcoding role strings throughout the codebase. */
enum Role {
    Admin = 'admin',
    customer = "customer",
}
class AuthMiddleware {
    async isAthenticated(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        // get token form user
        const token = req.headers.authorization
        if (!token || token === undefined) {
            res.status(403).json({
                message: "Invalid token"
            })
            return
        }
        // verify token if it it is legit or tampered 
        /* The `jwt.verify` function is used to verify the authenticity of a JSON Web Token (JWT). In this specific code snippet: */
        jwt.verify(token, process.env.SECRET_KEY as string, async (err, decoded: any) => {
            if (err) {
                res.status(403).json({
                    message: " token is invalid"
                })
            } else {
                // check if that decoded object id user exist or not
                try {
                    const userData = await User.findByPk(decoded.id)
                    if (!userData) {
                        res.status(403).json({
                            messsgea: "No user with that token was found"
                        })
                        return
                    }
                    req.user = userData
                    next()

                } catch (error) {
                    res.status(500).json({
                        message: " Something went wrong"
                    })
                }
            }
        })
    }

    restrictTo(...roels: Role[]) {
        return (req: AuthRequest, res: Response, next: NextFunction) => {
            let userRole = req.user?.role as Role;
            /* This line of code is checking if the `userRole` extracted from the request object is included in the array of roles passed as arguments to the `restrictTo` method. */
            if (!roels.includes(userRole)) {
                res.status(403).json({
                    meassage: " You don't have permission"
                })
            } else {
                next()
            }
        }
    }


}
export default new AuthMiddleware()