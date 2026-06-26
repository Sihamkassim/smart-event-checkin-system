import { DataTypes, Model, Optional } from 'sequelize';
import  sequelize  from '../config/database';

interface CheckInLogAttributes {
  id: number;
  event_id: number;
  visitor_id: number;
  token: string;
  status: 'success' | 'duplicate' | 'invalid';
  message: string;
  checked_in_at: Date;
  created_at: Date;
}

interface CheckInLogCreationAttributes extends Optional<CheckInLogAttributes, 'id' | 'created_at'> {}

class CheckInLog extends Model<CheckInLogAttributes, CheckInLogCreationAttributes> implements CheckInLogAttributes {
  public id!: number;
  public event_id!: number;
  public visitor_id!: number;
  public token!: string;
  public status!: 'success' | 'duplicate' | 'invalid';
  public message!: string;
  public checked_in_at!: Date;
  public created_at!: Date;
}

CheckInLog.init(
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
    },
    visitor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'visitors',
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('success', 'duplicate', 'invalid'),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    checked_in_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'check_in_logs',
    timestamps: false,
  }
);

export default CheckInLog;