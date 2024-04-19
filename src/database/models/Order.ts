import {
    Column,
    DataType,
    Model,
    Table
} from 'sequelize-typescript'
@Table({
    tableName: 'orders',
    modelName: 'order',
    timestamps: true
})
class Order extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: String


    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare PhoenNumber: string


    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    declare shippingAddress: string


    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    declare totalAmount: number


    @Column({
        type: DataType.ENUM('pending', 'cancelled', 'delivered', 'onTheWay', 'preparation'),
        defaultValue: 'pending'
    })
    declare orderStatus: string
}

export default Order