import { DataTypes, Model, Optional } from 'sequelize';
import  sequelize  from '../config/database';

interface VisitorAttributes {
  id: number;
  event_id: number;
  full_name: string;
  phone: string;
  email?: string;
  company?: string;
  check_in_token: string;
  checked_in: boolean;
  checked_in_at?: Date;
  created_at: Date;
  updated_at: Date;
}

interface VisitorCreationAttributes extends Optional<VisitorAttributes, 'id' | 'checked_in' | 'checked_in_at' | 'created_at' | 'updated_at'> {}

class Visitor extends Model<VisitorAttributes, VisitorCreationAttributes> implements VisitorAttributes {
  public id!: number;
  public event_id!: number;
  public full_name!: string;
  public phone!: string;
  public email?: string;
  public company?: string;
  public check_in_token!: string;
  public checked_in!: boolean;
  public checked_in_at?: Date;
  public created_at!: Date;
  public updated_at!: Date;
}

Visitor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    check_in_token: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    checked_in: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    checked_in_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'visitors',
    timestamps: false,
  }
);

export default Visitor;