import { Response } from 'express';
import { UserService } from '../service/userService';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const result = await UserService.getAllUsers();
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, permissions } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    
    const result = await UserService.createStaff({ name, email, permissions });
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    const result = await UserService.updateStaff(parseInt(id), { name, permissions });
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const sendActivationEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    // We need to fetch the user to get their email, name, and activation token
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.status !== 'pending' || !user.activation_token) {
      return res.status(400).json({ success: false, message: 'User is already active or missing activation token' });
    }
    
    const { EmailService } = await import('../service/emailService');
    const result = await EmailService.sendActivationEmail(user.email, user.name, user.activation_token);
    
    if (!result.success) {
      return res.status(500).json({ success: false, message: 'Failed to send email' });
    }
    
    res.json({ success: true, message: 'Activation email sent successfully!' });
  } catch (error) {
    console.error('Send activation email error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
