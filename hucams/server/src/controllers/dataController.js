const prisma = require('../utils/prisma');
const csv = require('csv-parser');
const fs = require('fs');

// ============================
// 1) Upload CSV Readings
// POST /api/readings/upload
// ============================
exports.uploadReadings = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        let count = 0;

        for (const row of results) {
          // Expected CSV headers:
          // date, block, floor, room_number, electricity_kwh, water_liters
          const { date, block, floor, room_number, electricity_kwh, water_liters } = row;

          if (!date || !block || !floor || !room_number) continue;

          // Find or create block
          let blockRecord = await prisma.block.findUnique({
            where: { name: block },
          });

          if (!blockRecord) {
            blockRecord = await prisma.block.create({
              data: {
                name: block,
                floors: parseInt(floor), // simplified
              },
            });
          }

          // Find or create room
          let roomRecord = await prisma.room.findFirst({
            where: {
              number: room_number,
              blockId: blockRecord.id,
            },
          });

          if (!roomRecord) {
            roomRecord = await prisma.room.create({
              data: {
                number: room_number,
                floor: parseInt(floor),
                blockId: blockRecord.id,
              },
            });
          }

          // Upsert reading (unique = date + roomId)
          await prisma.utilityReading.upsert({
            where: {
              date_roomId: {
                date: new Date(date),
                roomId: roomRecord.id,
              },
            },
            update: {
              electricity_kwh: parseFloat(electricity_kwh || 0),
              water_liters: parseFloat(water_liters || 0),
            },
            create: {
              date: new Date(date),
              roomId: roomRecord.id,
              electricity_kwh: parseFloat(electricity_kwh || 0),
              water_liters: parseFloat(water_liters || 0),
            },
          });

          count++;
        }

        // cleanup
        fs.unlinkSync(req.file.path);

        return res.json({ message: `Successfully processed ${count} readings` });
      } catch (error) {
        // cleanup even on error
        if (req.file?.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({ error: error.message });
      }
    });
};

// ============================
// 2) Add Manual Reading
// POST /api/readings/manual
// ============================
exports.addManualReading = async (req, res) => {
  try {
    const { date, roomId, electricity_kwh, water_liters } = req.body;

    const reading = await prisma.utilityReading.create({
      data: {
        date: new Date(date),
        roomId: parseInt(roomId),
        electricity_kwh: parseFloat(electricity_kwh || 0),
        water_liters: parseFloat(water_liters || 0),
      },
    });

    return res.json(reading);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ============================
// 3) Get Readings for Dashboard
// GET /api/readings
// ============================
exports.getReadings = async (req, res) => {
  try {
    // Latest reading per room (simple method: take latest readings)
    // You can modify this later for date filters.
    const readings = await prisma.utilityReading.findMany({
      orderBy: { date: 'desc' },
      take: 200, // adjust
      include: {
        room: {
          include: {
            block: true,
          },
        },
      },
    });

    // Convert DB format -> frontend format
    // Frontend expects: [{ room:"A-201", electricity: 14.5, water: 900 }]
    const formatted = readings.map((r) => ({
      id: r.id,
      date: r.date,
      room: `${r.room.block?.name || 'Block'}-${r.room.number}`,
      electricity: Number(r.electricity_kwh || 0),
      water: Number(r.water_liters || 0),
      block: r.room.block?.name || null,
      floor: r.room.floor,
      roomNumber: r.room.number,
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
