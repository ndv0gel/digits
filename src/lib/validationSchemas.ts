import * as yup from 'yup';

export const AddStuffSchema = yup.object({
  name: yup.string().required(),
  quantity: yup.number().positive().required(),
  condition: yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: yup.string().required(),
});

export const EditStuffSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  quantity: yup.number().positive().required(),
  condition: yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: yup.string().required(),
});

export interface Contact {
  firstName: string;
  lastName: string;
  address: string;
  image: string;
  description: string;
}

// ADD THESE NEW SCHEMAS
export const AddContactSchema = yup.object({
  firstName: yup.string().required('First Name is required.'),
  lastName: yup.string().required('Last Name is required.'),
  address: yup.string().required('Address is required.'),
  image: yup.string().url('Image must be a valid URL.').required('Image URL is required.'), // Added .url() for image validation
  description: yup.string().required('Description is required.'),
  owner: yup.string().required('Owner is required.'),
});

export const EditContactSchema = yup.object({
  firstName: yup.string().required('First Name is required.'),
  lastName: yup.string().required('Last Name is required.'),
  address: yup.string().required('Address is required.'),
  image: yup.string().url('Image must be a valid URL.').required('Image URL is required.'), // Added .url() for image validation
  description: yup.string().required('Description is required.'),
  owner: yup.string().required('Owner is required.'),
});
