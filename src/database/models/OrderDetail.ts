import {
    Column,
    DataType,
    Model,
    Table
} from 'sequelize-typescript'
@Table({
    tableName: 'orderDetails',
    modelName: 'OrderDetail',
    timestamps: true
})
class orderDetail extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: String


    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare quantity: number

}

export default orderDetail