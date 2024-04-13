import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from '../database/models/User';


export interface AuthRequest extends Request {
    user?: {
        username: string,
        email: string,
        role: string,
        password: string,
        id: string
    }
}

export enum Role {
    Admin = 'admin',
    customer = "customer",
}
class AuthMiddleware {
    async isAthenticated(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        // get token form user
        const token = req.headers.authorization
        if (!token || token === undefined) {
            res.status(403).json({
                message: "Token not found"
            })
            return
        }
        // verify token if it it is legit or tampered 
        jwt.verify(token, process.env.SECRET_KEY as string, async (err, decoded: any) => {
            if (err) {
                res.status(403).json({
                    message: "Invalid token"
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