const prisma = require('../utils/prisma');

exports.createComplaint = async (req, res) => {
    try {
        const { title, description, studentId } = req.body;
        const complaint = await prisma.complaint.create({
            data: {
                title,
                description,
                studentId: parseInt(studentId)
            }
        });
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getComplaints = async (req, res) => {
    try {
        const complaints = await prisma.complaint.findMany({
            include: { student: { select: { name: true, room: true } } }
        });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
