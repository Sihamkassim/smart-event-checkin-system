import { Visitor, Event } from "../models";
import { Op } from "sequelize";
import { generateToken } from "../utils/tokenGenerator";
import { EmailService } from "./emailService";

export class VisitorService {
  static async getVisitorsByEvent(eventId: number) {
    try {
      const visitors = await Visitor.findAll({
        where: { event_id: eventId },
        order: [["created_at", "DESC"]],
      });

      return {
        success: true,
        visitors,
      };
    } catch (error) {
      console.error("Get visitors service error:", error);
      return {
        success: false,
        message: "Failed to get visitors",
      };
    }
  }

  static async searchVisitors(eventId: number, query: string) {
    try {
      const visitors = await Visitor.findAll({
        where: {
          event_id: eventId,
          [Op.or]: [
            { full_name: { [Op.like]: `%${query}%` } },
            { phone: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
          ],
        },
        order: [["created_at", "DESC"]],
      });

      return {
        success: true,
        visitors,
      };
    } catch (error) {
      console.error("Search visitors service error:", error);
      return {
        success: false,
        message: "Failed to search visitors",
      };
    }
  }

  static async bulkCreateVisitors(eventId: number, visitors: Array<{
    full_name: string;
    phone: string;
    email?: string;
    company?: string;
  }>, sendEmails: boolean = false) {
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return { success: false, message: "Event not found" };
      }

      if (!visitors || visitors.length === 0) {
        return { success: false, message: "No visitors provided for import" };
      }

      // Find existing visitors to prevent duplicates
      const existingVisitors = await Visitor.findAll({
        where: { event_id: eventId },
        attributes: ['full_name', 'phone', 'email']
      });

      const existingSet = new Set(
        existingVisitors.map(v => `${v.full_name.toLowerCase().trim()}|${v.phone?.trim()}`)
      );

      const visitorRecords = [];
      const incomingSet = new Set(); // To prevent duplicates within the CSV itself

      for (const v of visitors) {
        const uniqueKey = `${v.full_name.toLowerCase().trim()}|${v.phone?.trim()}`;
        
        if (existingSet.has(uniqueKey) || incomingSet.has(uniqueKey)) {
          continue; // Skip duplicate
        }
        
        incomingSet.add(uniqueKey);

        const token = await generateToken();
        visitorRecords.push({
          event_id: eventId,
          full_name: v.full_name,
          phone: v.phone,
          email: v.email || undefined,
          company: v.company || undefined,
          check_in_token: token,
          checked_in: false,
        });
      }

      if (visitorRecords.length === 0) {
        return { success: false, message: "All visitors in the list already exist." };
      }

      await Visitor.bulkCreate(visitorRecords);

      if (sendEmails) {
        // Send emails asynchronously
        Promise.all(visitorRecords.map(async (v) => {
          if (v.email) {
            await EmailService.sendVisitorTicketEmail(
              v.email,
              v.full_name,
              event.name, // Pass the event name
              v.check_in_token
            );
          }
        })).catch(err => console.error("Error sending bulk ticket emails:", err));
      }

      return {
        success: true,
        message: `${visitorRecords.length} visitors imported successfully`,
        count: visitorRecords.length
      };
    } catch (error) {
      console.error("Bulk create visitors service error:", error);
      return { success: false, message: "Failed to import visitors" };
    }
  }

  static async createVisitor(data: {
    event_id: number;
    full_name: string;
    phone: string;
    email?: string;
    company?: string;
  }) {
    try {
      // Check if event exists
      const event = await Event.findByPk(data.event_id);
      if (!event) {
        return {
          success: false,
          message: "Event not found",
        };
      }

      // Check for duplicate
      const existing = await Visitor.findOne({
        where: {
          event_id: data.event_id,
          full_name: data.full_name.trim(),
          phone: data.phone.trim()
        }
      });

      if (existing) {
        return {
          success: false,
          message: "A visitor with this name and phone already exists for this event.",
        };
      }

      // Generate unique token
      const token = await generateToken();

      const visitor = await Visitor.create({
        ...data,
        check_in_token: token,
        checked_in: false,
      });

      return {
        success: true,
        visitor,
      };
    } catch (error) {
      console.error("Create visitor service error:", error);
      return {
        success: false,
        message: "Failed to create visitor",
      };
    }
  }

  static async updateVisitor(
    id: number,
    data: {
      full_name?: string;
      phone?: string;
      email?: string;
      company?: string;
    }
  ) {
    try {
      const visitor = await Visitor.findByPk(id);

      if (!visitor) {
        return {
          success: false,
          message: "Visitor not found",
        };
      }

      await visitor.update({
        ...data,
        updated_at: new Date(),
      });

      return {
        success: true,
        visitor,
      };
    } catch (error) {
      console.error("Update visitor service error:", error);
      return {
        success: false,
        message: "Failed to update visitor",
      };
    }
  }

  static async deleteVisitor(id: number) {
    try {
      const visitor = await Visitor.findByPk(id);

      if (!visitor) {
        return {
          success: false,
          message: "Visitor not found",
        };
      }

      await visitor.destroy();

      return {
        success: true,
        message: "Visitor deleted successfully",
      };
    } catch (error) {
      console.error("Delete visitor service error:", error);
      return {
        success: false,
        message: "Failed to delete visitor",
      };
    }
  }
}
