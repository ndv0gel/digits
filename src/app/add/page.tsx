import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/authOptions';
import AddContactForm from '@components/AddContactForm';
import { Col, Container } from 'react-bootstrap';

const AddContact = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <Container id="add-contact-page" className="py-3">
        <Col>
          <h2>Access Denied</h2>
          <p>Please log in to add a contact.</p>
        </Col>
      </Container>
    );
  }

  // Pass the session email to the client component
  return <AddContactForm userEmail={session.user?.email || ''} />;
};

export default AddContact;
