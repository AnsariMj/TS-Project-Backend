import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../database/models/User'

class AuthController {
    // User Registration
    public static async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, password, role } = req.body
            if (!username || !email || !password) {
                res.status(400).json({
                    message: "Please enter username, email and password!!!"
                })
                return
            }
            // The code is querying the database to find a user record based on the provided email. 
            const [data] = await User.findAll({
                where: {
                    email: email,
                }
            })
            if (data) {
                res.status(404).json({
                    message: "email already exists"
                })
                return;
            }
            await User.create({
                username,
                email,
                password: bcrypt.hashSync(password, 8),
                role: role
            })
            res.status(200).json({
                message: "User created successfully"
            })
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    // User Login
    public static async LoginUser(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(403).json({
                    message: "Please enter your correct email and password"
                })
                return;
            }
            //check whether the user with above email and password exist or not
            const [data] = await User.findAll({
                where: {
                    email: email,
                }
            })
            if (!data) {
                res.status(404).json({
                    message: "User does not exist with provided email and password"
                })
                return;
            }
            //check password 
            const isMatched = bcrypt.compareSync(password, data.password)
            if (!isMatched) {
                res.status(400).json({
                    message: "Invalid password"
                })
                return;
            }

            // Generate token
            const token = jwt.sign({ id: data.id }, process.env.SECRET_KEY as string, {
                expiresIn: "20d"
            })
            res.status(200).json({
                messsage: " Login successful",
                data: token
            })
        } catch (error) {
            console.error("Error occurred during login:", error);
            res.status(500).json({
                message: "Internal server error"
            });
        }

    }


}
export default AuthController;