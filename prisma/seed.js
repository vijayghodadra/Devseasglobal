const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@devseas.com';
    const plainPassword = 'password';

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const user = await prisma.user.create({
            data: {
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                isAdmin: true,
            },
        });
        console.log(`Created admin user: ${user.email} with password: ${plainPassword}`);
    } else {
        console.log('Admin user already exists.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
