import { PrismaClient, Condition, Role } from '@prisma/client';
import { hash } from 'argon2'; // Using argon2 for password hashing
// Import the entire JSON file as a module, then access properties
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

// Define explicit types for the data from settings.development.json
interface UserData {
  email: string;
  password: string;
  role?: string;
}

interface StuffData {
  name: string;
  quantity: number;
  owner: string;
  condition: string;
}

interface ContactData {
  firstName: string;
  lastName: string;
  address: string;
  image: string;
  description: string;
  owner: string;
}

async function main() {
  console.log('Seeding the database');

  // Seed users
  await Promise.all(config.defaultAccounts.map(async (data: UserData) => {
    const role = (data.role as Role) || Role.USER;
    console.log(`  Creating user: ${data.email} with role: ${role}`);
    const hashedPassword = await hash(data.password); // HASH THE PASSWORD HERE
    await prisma.user.upsert({
      where: { email: data.email },
      update: { password: hashedPassword }, // Update existing password if user exists
      create: {
        email: data.email,
        password: hashedPassword, // Use the hashed password
        role: role,
      },
    });
  }));

  // Seed stuff
  await Promise.all(config.defaultStuff.map(async (data: StuffData) => {
    const condition = (data.condition as Condition) || Condition.good;
    console.log(`  Adding stuff: ${data.name} (${data.owner})`);
    await prisma.stuff.upsert({
      where: { // CORRECTED WHERE CLAUSE for composite unique
        name_owner: {
          name: data.name,
          owner: data.owner,
        },
      },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition: condition, // Use the 'condition' enum variable
      },
    });
  }));

  // Seed contacts
  await Promise.all(config.defaultContacts.map(async (data: ContactData) => {
    console.log(`  Adding contact: ${data.firstName} ${data.lastName}`);
    await prisma.contact.upsert({
      where: {
        firstName_lastName_owner: {
          firstName: data.firstName,
          lastName: data.lastName,
          owner: data.owner,
        },
      },
      update: {},
      create: {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        image: data.image,
        description: data.description,
        owner: data.owner,
      },
    });
  }));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
