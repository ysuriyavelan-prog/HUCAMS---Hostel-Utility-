const prisma = require('../utils/prisma');
const predictionService = require('../services/predictionService');

exports.getPredictions = async (req, res) => {
    try {
        const { roomId } = req.query;
        if (!roomId) return res.status(400).json({ message: 'Room ID required' });

        // Get last 30 days readings
        const readings = await prisma.utilityReading.findMany({
            where: { roomId: parseInt(roomId) },
            orderBy: { date: 'asc' },
            take: 30
        });

        const electricityValues = readings.map(r => r.electricity_kwh);
        const waterValues = readings.map(r => r.water_liters);

        const electricityForecast = predictionService.predictNextWeek(electricityValues);
        const waterForecast = predictionService.predictNextWeek(waterValues);

        res.json({
            roomId,
            electricityForecast,
            waterForecast
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
