import {
    Column,
    DataType,
    Model,
    Table
} from 'sequelize-typescript'
@Table({
    tableName: 'payments',
    modelName: 'Payment',
    timestamps: true
})
class Payment extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: String


    @Column({
        type: DataType.ENUM('cod', 'khalti', 'esewa'),
        allowNull: false,
    })
    declare paymentMethod: string


    @Column({
        type: DataType.ENUM('paid', 'unpaid'),
        defaultValue: 'unpaid'
    })
    declare paymentStatus: string


    @Column({
        type: DataType.STRING,
    })
    declare pidx: string
}

export default Payment