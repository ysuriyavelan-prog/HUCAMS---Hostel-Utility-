const prisma = require('../utils/prisma');

exports.checkAnomalies = async (reading) => {
    // Simple logic: if usage > threshold, create alert
    const ELEC_THRESHOLD = 50; // kWh
    const WATER_THRESHOLD = 500; // Liters

    if (reading.electricity_kwh > ELEC_THRESHOLD) {
        await prisma.alert.create({
            data: {
                type: 'ELECTRICITY_SPIKE',
                severity: 'HIGH',
                message: `High electricity usage detected: ${reading.electricity_kwh} kWh`,
                roomId: reading.roomId,
                status: 'OPEN'
            }
        });
    }

    if (reading.water_liters > WATER_THRESHOLD) {
        await prisma.alert.create({
            data: {
                type: 'WATER_LEAKAGE',
                severity: 'MEDIUM',
                message: `High water usage detected: ${reading.water_liters} L`,
                roomId: reading.roomId,
                status: 'OPEN'
            }
        });
    }
};
