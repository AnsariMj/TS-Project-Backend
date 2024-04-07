import bcrypt from 'bcrypt'
import User from './database/models/User'

const adminSeeder = async (): Promise<void> => {
    const [data] = await User.findAll({
        where: {
            email: "mjansari14@gmail.com",
        }
    })
    if (!data) {

        await User.create({

            email: "admin@gmail.com",
            password: bcrypt.hashSync('admin', 8),
            username: "admin",
            role: 'admin',
        })
        console.log("Admin seeded successfully")

    } else {
        console.log("Admin already seeded")

    }
}

export default adminSeeder