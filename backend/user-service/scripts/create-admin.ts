import { UserModel } from '../src/infrastructure/db/mongoose-connection';
import { connectDatabase } from '../src/infrastructure/db/mongoose-connection';
import bcrypt from 'bcrypt';

async function createFirstAdmin() {
    try {
        await connectDatabase();
        
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const adminUser = await UserModel.create({
            email: 'salus@gmail.com',
            password: hashedPassword,
            name: 'Admin User',
            phone: '1234567890',
            isAdmin: true
        });

        console.log('Admin user created:', adminUser);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createFirstAdmin(); 