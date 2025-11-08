import { PrismaClient, Condition, Role } from '@prisma/client';
import { hash } from 'argon2';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

// Define explicit types for the data from settings.development.json
interface UserData {
  email: string;
  password: string;
  role?: string; // role is optional in some default accounts
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
  await Promise.all(config.defaultAccounts.map(async (data: UserData) => { // Explicitly type data
    const role = (data.role as Role) || Role.USER;
    console.log(`  Creating user: ${data.email} with role: ${role}`);
    const hashedPassword = await 
  hash(data.password);
    await prisma.user.upsert({
      where: { email: data.email },
      update: { password: hashedPassword },
      create: {
        email: data.email,
        password: hashedPassword,
        role: role,
      },
    });
  }));

  // Seed stuff
  await Promise.all(config.defaultStuff.map(async (data: StuffData) => { // Explicitly type data
    const condition = (data.condition as Condition) || Condition.good;
    console.log(`  Adding stuff: ${data.name} (${data.owner})`);
    await prisma.stuff.upsert({
      where: { 
        name_owner: {
          name: data.name,
          owner: data.owner,
        },
      }, // Assuming 'name' is unique for Stuff or we use ID
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition: condition,
      },
    });
  }));

  // Seed contacts
  await Promise.all(config.defaultContacts.map(async (data: ContactData) => { // Explicitly type data
    console.log(`  Adding contact: ${data.firstName} ${data.lastName}`);
    await prisma.contact.upsert({
      where: {
        // Correct syntax for composite unique field in upsert
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
