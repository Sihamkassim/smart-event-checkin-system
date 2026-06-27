import { Request, Response } from 'express';
import { VisitorService } from '../service/visitorService';
import { AuthRequest } from '../middleware/auth';

export const getVisitors = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    const result = await VisitorService.getVisitorsByEvent(parseInt(eventId));

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Get visitors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const exportVisitors = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    const result = await VisitorService.getVisitorsByEvent(parseInt(eventId));

    if (!result.success) {
      return res.status(400).json(result);
    }

    const visitors = result.visitors || [];
    
    // Create CSV header
    const headers = ['Full Name', 'Phone', 'Email', 'Company', 'Check-in Token', 'Checked In', 'Created At'];
    
    // Create CSV rows
    const rows = visitors.map((v: any) => {
      // Escape commas and quotes for CSV
      const escapeCsv = (str: any) => {
        if (!str) return '';
        const stringified = String(str);
        if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\\n')) {
          return `"${stringified.replace(/"/g, '""')}"`;
        }
        return stringified;
      };

      return [
        escapeCsv(v.full_name),
        escapeCsv(v.phone),
        escapeCsv(v.email),
        escapeCsv(v.company),
        escapeCsv(v.check_in_token),
        escapeCsv(v.checked_in ? 'Yes' : 'No'),
        escapeCsv(v.created_at ? new Date(v.created_at).toLocaleString() : '')
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="visitors_event_${eventId}.csv"`);
    
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export visitors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const searchVisitors = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    const { q } = req.query;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const result = await VisitorService.searchVisitors(
      parseInt(eventId),
      q as string
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Search visitors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const createVisitor = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    const { full_name, phone, email, company } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    if (!full_name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Full name and phone are required',
      });
    }

    const result = await VisitorService.createVisitor({
      event_id: parseInt(eventId),
      full_name,
      phone,
      email,
      company,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Create visitor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const bulkCreateVisitors = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    const { visitors } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    if (!visitors || !Array.isArray(visitors)) {
      return res.status(400).json({
        success: false,
        message: 'A valid list of visitors is required',
      });
    }

    const result = await VisitorService.bulkCreateVisitors(parseInt(eventId), visitors);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Bulk create visitors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateVisitor = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { full_name, phone, email, company } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Visitor ID is required',
      });
    }

    const result = await VisitorService.updateVisitor(parseInt(id), {
      full_name,
      phone,
      email,
      company,
    });

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Update visitor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const deleteVisitor = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Visitor ID is required',
      });
    }

    const result = await VisitorService.deleteVisitor(parseInt(id));

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Delete visitor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};