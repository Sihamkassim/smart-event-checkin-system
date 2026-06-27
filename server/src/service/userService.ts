import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User';

export class UserService {
  static async getAllUsers() {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password_hash'] },
        order: [['created_at', 'DESC']],
      });

      return {
        success: true,
        users,
      };
    } catch (error) {
      console.error('Get all users error:', error);
      return {
        success: false,
        message: 'Failed to get users',
      };
    }
  }

  static async createStaff(data: { name: string; email: string; permissions: string[] }) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        return { success: false, message: 'Email is already registered' };
      }

      // Generate an activation token
      const token = crypto.randomBytes(32).toString('hex');
      // Create a temporary unguessable password hash so the account is secure until activated
      const tempPasswordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);

      const user = await User.create({
        name: data.name,
        email: data.email,
        password_hash: tempPasswordHash,
        role: 'staff',
        status: 'pending',
        permissions: data.permissions || [],
        activation_token: token,
      });

      // Construct a generic activation link (the frontend handles this)
      const activationLink = `http://localhost:5173/setup-password?token=${token}`;

      // In a real application, you would send this via Email.
      // Here, we just return it so the admin can copy or view it.

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          permissions: user.permissions,
          activation_token: user.activation_token,
        },
        activationLink,
      };
    } catch (error) {
      console.error('Create staff error:', error);
      return { success: false, message: 'Failed to create staff account' };
    }
  }

  static async updateStaff(id: number, data: { name?: string; permissions?: string[] }) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      if (user.role === 'admin') {
        return { success: false, message: 'Cannot edit admin permissions this way' };
      }

      const updates: any = {};
      if (data.name) updates.name = data.name;
      if (data.permissions !== undefined) updates.permissions = data.permissions;

      await user.update(updates);

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          permissions: user.permissions,
          activation_token: user.activation_token,
        },
      };
    } catch (error) {
      console.error('Update staff error:', error);
      return { success: false, message: 'Failed to update staff account' };
    }
  }
}
