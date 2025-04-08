const express = require('express');
const Client = require('../../models/Client');
const Transaction = require('../../models/Transaction'); 
const Agent = require('../../models/Agent'); 
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware , async (req, res) => {
    const { role, id } = req.user;

    try {
        // Define stats object
        const stats = {
          totalCreditsToday: 0,
          totalCreditsThisMonth: 0,
          activeTransactions: 0,
          activeAgents: 0,
          activeClients: 0,
        };
    
        if (role === 'client') {
          // Client-specific stats
          const clientStats = await Transaction.aggregate([
            { $match: { userId: id, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }, // Match today's transactions
            { $group: { _id: null, totalCreditsToday: { $sum: "$amount" } } }
          ]);
    
          if (clientStats.length > 0) stats.totalCreditsToday = clientStats[0].totalCreditsToday;
          else stats.totalCreditsToday = 0;
          const clientMonthlyStats = await Transaction.aggregate([
            { $match: { userId: id, createdAt: { $gte: new Date(new Date().setDate(1)) } } }, // Match this month's transactions
            { $group: { _id: null, totalCreditsThisMonth: { $sum: "$amount" } } }
          ]);
    
          if (clientMonthlyStats.length > 0) stats.totalCreditsThisMonth = clientMonthlyStats[0].totalCreditsThisMonth;
          else stats.totalCreditsThisMonth = 0;
          
          stats.activeTransactions = await Transaction.countDocuments({ userId: id, status: 'active' });
    
        } else if (role === 'agent') {
          // Agent-specific stats
          const agentStats = await Agent.findOne({ userId: id });
    
          if (!agentStats) {
            return res.status(404).json({ message: 'Agent not found' });
          }
    
          const agentClients = await Client.find({ agentId: agentStats._id });
    
          const agentClientsIds = agentClients.map(client => client._id);
    
          const agentTransactions = await Transaction.aggregate([
            { $match: { userId: { $in: agentClientsIds }, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } },
            { $group: { _id: null, totalCreditsToday: { $sum: "$amount" } } }
          ]);
    
          if (agentTransactions.length > 0) stats.totalCreditsToday = agentTransactions[0].totalCreditsToday;
          else  stats.totalCreditsToday = 0;
    
          const agentTransactionsMonth = await Transaction.aggregate([
            { $match: { userId: { $in: agentClientsIds }, createdAt: { $gte: new Date(new Date().setDate(1)) } } },
            { $group: { _id: null, totalCreditsThisMonth: { $sum: "$amount" } } }
          ]);
    
          if (agentTransactionsMonth.length > 0) stats.totalCreditsThisMonth = agentTransactionsMonth[0].totalCreditsThisMonth;
          else stats.totalCreditsThisMonth = 0;

          stats.activeTransactions = await Transaction.countDocuments({ userId: { $in: agentClientsIds }, status: 'active' });
    
          stats.activeClients = agentClients.filter(c=>c.status === 'active').length;
    
        }else if (role === 'master-agent') {
          // Master-Agent-specific stats
          const agentStats = await Agent.findOne({ userId: id });
    
          if (!agentStats) {
            return res.status(404).json({ message: 'Agent not found' });
          }
    
          const agentClients = await Client.find({ agentId: agentStats._id });
    
          const agentClientsIds = agentClients.map(client => client._id);
    
          const agentTransactions = await Transaction.aggregate([
            { $match: { userId: { $in: agentClientsIds }, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } },
            { $group: { _id: null, totalCreditsToday: { $sum: "$amount" } } }
          ]);
    
          if (agentTransactions.length > 0) stats.totalCreditsToday = agentTransactions[0].totalCreditsToday;
          else  stats.totalCreditsToday = 0;
    
          const agentTransactionsMonth = await Transaction.aggregate([
            { $match: { userId: { $in: agentClientsIds }, createdAt: { $gte: new Date(new Date().setDate(1)) } } },
            { $group: { _id: null, totalCreditsThisMonth: { $sum: "$amount" } } }
          ]);
    
          if (agentTransactionsMonth.length > 0) stats.totalCreditsThisMonth = agentTransactionsMonth[0].totalCreditsThisMonth;
          else stats.totalCreditsThisMonth = 0;

          stats.activeTransactions = await Transaction.countDocuments({ userId: { $in: agentClientsIds }, status: 'active' });
    
          stats.activeAgents = await Agent.countDocuments({ _id: { $in: agentStats.teamMembers } });
          stats.activeClients = await Client.countDocuments({ status: 'active' });
    
        } else if (role === 'admin') {
          // Admin-specific stats
          stats.totalCreditsToday = await Transaction.aggregate([
            { $match: { createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } },
            { $group: { _id: null, totalCreditsToday: { $sum: "$amount" } } }
          ]);
    
          if (stats.totalCreditsToday.length > 0) stats.totalCreditsToday = stats.totalCreditsToday[0].totalCreditsToday;
          else stats.totalCreditsToday = 0;

          stats.totalCreditsThisMonth = await Transaction.aggregate([
            { $match: { createdAt: { $gte: new Date(new Date().setDate(1)) } } },
            { $group: { _id: null, totalCreditsThisMonth: { $sum: "$amount" } } }
          ]);
    
          if (stats.totalCreditsThisMonth.length > 0) stats.totalCreditsThisMonth = stats.totalCreditsThisMonth[0].totalCreditsThisMonth;
          else stats.totalCreditsThisMonth = 0;

          stats.activeTransactions = await Transaction.countDocuments({ status: 'active' });
    
          stats.activeAgents = await Agent.countDocuments({ status: 'active' });

          stats.activeClients = await Client.countDocuments({ status: 'active' });          
        }
    
        return res.json(stats);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }
});

module.exports = router;
