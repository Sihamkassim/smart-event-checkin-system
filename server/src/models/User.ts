import { DataTypes, Model, Optional } from 'sequelize';
import  sequelize  from '../config/database';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'staff';
  status: 'pending' | 'active';
  permissions: string[];
  activation_token: string | null;
  created_at: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'status' | 'permissions' | 'activation_token'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public role!: 'admin' | 'staff';
  public status!: 'pending' | 'active';
  public permissions!: string[];
  public activation_token!: string | null;
  public created_at!: Date;

  // Method to check password
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'staff'),
      defaultValue: 'staff',
    },
    status: {
      type: DataTypes.ENUM('pending', 'active'),
      defaultValue: 'active',
    },
    permissions: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    activation_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);

export default User;