import { Col, Container } from 'react-bootstrap';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/authOptions';
import { prisma } from '@lib/prisma';
import EditContactForm from '@components/EditContactForm';

interface EditContactPageProps {
  params: { id: string };
}

const EditContact = async ({ params }: EditContactPageProps) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <Container id="edit-contact-page" className="py-3">
        <Col>
          <h2>Access Denied</h2>
          <p>Please log in to edit a contact.</p>
        </Col>
      </Container>
    );
  }

  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return (
      <Container id="edit-contact-page" className="py-3">
        <Col>
          <h2>Invalid Contact ID</h2>
          <p>The provided ID is not a valid number.</p>
        </Col>
      </Container>
    );
  }

  const contact = await prisma.contact.findUnique({ where: { id } });

  if (!contact) {
    return (
      <Container id="edit-contact-page" className="py-3">
        <Col>
          <h2>Contact Not Found</h2>
          <p>
            The contact with ID
            {id}
            does not exist.
          </p>
        </Col>
      </Container>
    );
  }

  // Check if the logged-in user is the owner of the contact
  if (session.user?.email !== contact.owner) {
    return (
      <Container id="edit-contact-page" className="py-3">
        <Col>
          <h2>Unauthorized</h2>
          <p>You do not have permission to edit this contact.</p>
        </Col>
      </Container>
    );
  }

  return <EditContactForm contact={contact} userEmail={session.user?.email || ''} />;
};

export default EditContact;
