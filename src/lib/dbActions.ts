'use server';

import { Stuff, Condition } from '@prisma/client';
import { hash } from 'argon2'; // Using argon2 for password hashing
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';
import { prisma } from './prisma';
import { AddStuffSchema, EditStuffSchema } from './validationSchemas';
import { AddContactSchema, EditContactSchema } from './validationSchemas';

/**
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
  // console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);
  let condition: Condition = 'good';
  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}

/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: Stuff) {
  // console.log(`editStuff data: ${JSON.stringify(stuff, null, 2)}`);
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 */
export async function deleteStuff(id: number) {
  // console.log(`deleteStuff id: ${id}`);
  await prisma.stuff.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password); // Hashing password with argon2
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password); // Hashing password with argon2
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

/**
 * Adds a new contact to the Contacts table.
 * @param contact, an object containing the fields of the contact to be inserted.
 */
export async function addContact(contact: { firstName: string, lastName: string, address: string, image: string, description: string, owner: string }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('You must be logged in to add a contact.');
  }
  try {
    const validatedContact = await AddContactSchema.validate(contact, { abortEarly: false });
    await prisma.contact.create({ data: validatedContact });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      throw new Error(error.errors.join(', '));
    }
    throw error;
  }
  redirect('/list');
}

/**
 * Updates an existing contact in the Contacts table.
 * @param id, the id of the contact to update.
 * @param contact, an object containing the fields of the contact to be updated.
 */
export async function editContact(id: number, contact: { firstName: string, lastName: string, address: string, image: string, description: string, owner: string }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('You must be logged in to edit a contact.');
  }
  try {
    const validatedContact = await EditContactSchema.validate(contact, { abortEarly: false });
    await prisma.contact.update({ where: { id }, data: validatedContact });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      throw new Error(error.errors.join(', '));
    }
    throw error;
  }
  redirect('/list');
}
