const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    // Create Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@hucams.com' },
        update: {},
        create: {
            email: 'admin@hucams.com',
            name: 'Hostel Warden',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    // Create Blocks
    const blockA = await prisma.block.upsert({
        where: { name: 'Block A' },
        update: {},
        create: { name: 'Block A', floors: 3 }
    });

    // Create Rooms
    const room101 = await prisma.room.create({
        data: { number: '101', floor: 1, blockId: blockA.id }
    });

    // Create Student
    const studentPass = await bcrypt.hash('student123', 10);
    await prisma.user.create({
        data: {
            email: 'student@hucams.com',
            name: 'John Doe',
            password: studentPass,
            role: 'STUDENT',
            roomId: room101.id
        }
    });

    console.log('Seeding completed');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
