import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class SystemStat extends Model {
  public id!: number;
  public timestamp!: Date;
  public summary_text!: string;
  public raw_metrics!: any;
  public embedding!: number[]; // Voyage API 1024-d embedding
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SystemStat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    summary_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    raw_metrics: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    embedding: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'system_stats',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default SystemStat;
