import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { StatsService } from '../service/statsService';
import { AiService } from '../service/aiService';

export const getGlobalStats = async (req: AuthRequest, res: Response) => {
  try {
    const result = await StatsService.getGlobalStats();
    if (!result.success) return res.status(400).json(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const snapshotStats = async (req: AuthRequest, res: Response) => {
  try {
    const result = await StatsService.snapshotStats();
    if (!result.success) return res.status(400).json(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const searchStats = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, message: 'Query is required' });

    const result = await StatsService.searchStats(query);
    if (!result.success) return res.status(400).json(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const askAi = async (req: AuthRequest, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ success: false, message: 'Question is required' });

    const result = await AiService.askAI(question);
    if (!result.success) return res.status(400).json(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const askEventAi = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { question } = req.body;
    
    if (!id) return res.status(400).json({ success: false, message: 'Event ID is required' });
    if (!question) return res.status(400).json({ success: false, message: 'Question is required' });

    const result = await AiService.askEventAI(parseInt(id), question);
    if (!result.success) return res.status(400).json(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
