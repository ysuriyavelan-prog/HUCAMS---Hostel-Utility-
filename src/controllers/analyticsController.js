const prisma = require('../utils/prisma');

exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Mock rates
        const ELEC_RATE = 10; // per kWh
        const WATER_RATE = 0.5; // per Liter

        const totalReadings = await prisma.utilityReading.aggregate({
            where: { date: { gte: today } },
            _sum: {
                electricity_kwh: true,
                water_liters: true
            }
        });

        const openAlerts = await prisma.alert.count({
            where: { status: 'OPEN' }
        });

        // Top wasting rooms (mock logic: highest usage today)
        const topRooms = await prisma.utilityReading.findMany({
            where: { date: { gte: today } },
            orderBy: { electricity_kwh: 'desc' },
            take: 5,
            include: { room: true }
        });

        const stats = {
            electricityToday: totalReadings._sum.electricity_kwh || 0,
            waterToday: totalReadings._sum.water_liters || 0,
            electricityCost: (totalReadings._sum.electricity_kwh || 0) * ELEC_RATE,
            waterCost: (totalReadings._sum.water_liters || 0) * WATER_RATE,
            openAlerts,
            topRooms
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTrends = async (req, res) => {
    // TODO: Implement daily trends
    res.json({ message: 'Trends endpoint' });
};
