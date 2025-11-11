'use client';

import { Col, Container, Card, Row, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddContactSchema } from '@lib/validationSchemas';
import { addContact } from '@lib/dbActions';
import { useRouter } from 'next/navigation';

interface AddContactFormInputs {
  firstName: string;
  lastName: string;
  address: string;
  image: string;
  description: string;
}

interface AddContactFormProps {
  userEmail: string;
}

const AddContactForm: React.FC<AddContactFormProps> = ({ userEmail }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddContactFormInputs>({
    resolver: yupResolver(AddContactSchema),
  });

  const onSubmit = async (data: AddContactFormInputs) => {
    if (!userEmail) {
      console.error('User email not provided to AddContactForm.');
      router.push('/auth/signin');
      return;
    }
    await addContact({ ...data, owner: userEmail });
    reset();
    router.push('/list');
  };

  return (
    <Container id="add-contact-page" className="py-3">
      <Col xs={10} className="d-flex flex-column justify-content-center">
        <Card>
          <Card.Header className="text-center">
            <Card.Title>Add Contact</Card.Title>
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

export default AddContactForm;
