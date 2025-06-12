const CircleService = require('../services/circle.service');

class CircleController {
  static async createCircle(req, res) {
    try {
      if (req.user.role !== 'mentor') {
        throw new Error('Only mentors can create circles');
      }
      const circleId = await CircleService.create({
        name: req.body.name,
        description: req.body.description,
        mentor_id: req.user.id
      });
      res.status(201).json({ id: circleId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getMyCircle(req, res) {
    try {
      const circle = await CircleService.findByMentor(req.user.id);
      if (!circle) throw new Error('Circle not found');
      res.json(circle);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async addMember(req, res) {
    try {
      await CircleService.addMember(req.params.circleId, req.body.userId);
      res.json({ message: 'Member added' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllCircles(req, res) {
    try {
      const circles = await CircleService.findAll();
      res.json(circles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getMyCircles(req, res) {
    try {
      const circles = await CircleService.findByUser(req.user.id);
      res.json(circles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = CircleController;