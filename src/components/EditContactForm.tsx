'use client'; // This component is a Client Component

import { Col, Container, Card, Row, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditContactSchema } from '@lib/validationSchemas';
import { editContact } from '@lib/dbActions';
import { Contact } from '@prisma/client';
import { useRouter } from 'next/navigation';

// REMOVE these server-side imports from this client component:
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@lib/authOptions';


interface EditContactFormInputs {
  firstName: string;
  lastName: string;
  address: string;
  image: string;
  description: string;
  owner: string; // Include owner for consistency, though it might not be directly editable in this form
}

interface EditContactFormProps {
  contact: Contact;
  userEmail: string; // ADD userEmail PROP
}

const EditContactForm: React.FC<EditContactFormProps> = ({ contact, userEmail }) => { // ACCEPT userEmail PROP
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditContactFormInputs>({
    resolver: yupResolver(EditContactSchema),
    defaultValues: { // SET DEFAULT VALUES FROM THE CONTACT PROP
      firstName: contact.firstName,
      lastName: contact.lastName,
      address: contact.address,
      image: contact.image,
      description: contact.description,
      owner: contact.owner,
    },
  });

  const onSubmit = async (data: EditContactFormInputs) => {
    // Check userEmail prop, not getServerSession
    if (!userEmail) {
      console.error('User email not provided to EditContactForm.');
      router.push('/auth/signin'); // Redirect if no email
      return;
    }
    await editContact(contact.id, { ...data, owner: contact.owner }); // Use the existing contact.owner
    reset(); // Reset form after submission
    router.push('/list'); // Redirect to list page after editing
  };

  return (
    <Container id="edit-contact-page" className="py-3">
      <Col xs={10} className="d-flex flex-column justify-content-center">
        <Card>
          <Card.Header className="text-center">
            <Card.Title>Edit Contact</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="firstName">First Name</Form.Label>
                    <Form.Control
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      {...register('firstName')}
                      isInvalid={!!errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="lastName">Last Name</Form.Label>
                    <Form.Control
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      {...register('lastName')}
                      isInvalid={!!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="address">Address</Form.Label>
                <Form.Control
                  id="address"
                  type="text"
                  placeholder="Address"
                  {...register('address')}
                  isInvalid={!!errors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="image">Image URL</Form.Label>
                <Form.Control
                  id="image"
                  type="text"
                  placeholder="Image URL"
                  {...register('image')}
                  isInvalid={!!errors.image}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control
                  id="description"
                  as="textarea"
                  placeholder="Description"
                  rows={3}
                  {...register('description')}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" variant="primary" className="me-2">
                Submit
              </Button>
              <Button type="reset" variant="secondary" onClick={() => reset()}>
                Reset
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
};

export default EditContactForm;
