import { Response } from 'express';
import { EventService } from '../service/eventService';
import { AuthRequest } from '../middleware/auth';

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const result = await EventService.getAllEvents();

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEventById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Event ID is required' });
    }

    const result = await EventService.getEventById(parseInt(id));

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createEvent = async (req: any, res: Response) => {
  try {
    const { name, date, location, status } = req.body;

    if (!name || !date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Name, date, and location are required',
      });
    }

    let image_url = null;
    if (req.file) {
      // The file path relative to the server root
      image_url = `/uploads/${req.file.filename}`;
    }

    const result = await EventService.createEvent({ name, date, location, status, image_url });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateEvent = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { name, date, location, status } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Event ID is required' });
    }

    let image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const result = await EventService.updateEvent(parseInt(id), { name, date, location, status, image_url });

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Event ID is required' });
    }

    const result = await EventService.deleteEvent(parseInt(id));

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEventStats = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Event ID is required' });
    }

    const result = await EventService.getEventStats(parseInt(id));

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
