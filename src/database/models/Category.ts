import {
    Column,
    DataType,
    Model,
    Table
} from 'sequelize-typescript';

@Table({
    tableName: 'categories',
    modelName: 'category',
    timestamps: true,
})
class Category extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4

    })
    declare id: string;




    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare categoryName: string

}

export default  Category