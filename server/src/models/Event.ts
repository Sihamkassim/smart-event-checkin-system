import { DataTypes, Model, Optional } from 'sequelize';
import  sequelize  from '../config/database';

interface EventAttributes {
  id: number;
  name: string;
  date: Date;
  location: string;
  status: 'draft' | 'active' | 'completed';
  created_at: Date;
  updated_at: Date;
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: number;
  public name!: string;
  public date!: Date;
  public location!: string;
  public status!: 'draft' | 'active' | 'completed';
  public created_at!: Date;
  public updated_at!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'completed'),
      defaultValue: 'draft',
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
    tableName: 'events',
    timestamps: false,
  }
);

export default Event;