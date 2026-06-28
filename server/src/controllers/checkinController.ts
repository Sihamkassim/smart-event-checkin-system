import { Request, Response } from 'express';
import { CheckInService } from '../service/checkinService';
import { AuthRequest } from '../middleware/auth';

export const checkInVisitor = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    const result = await CheckInService.checkIn(token, req.user.id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};