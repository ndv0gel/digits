import { Col, Container, Row } from 'react-bootstrap';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/authOptions';
import { prisma } from '@lib/prisma';
import ContactCardAdmin from '@components/ContactCardAdmin';

const Admin = async () => {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.email === 'admin@foo.com'; // Or check role from session

  if (!isAdmin) {
    return (
      <Container id="admin-page" className="py-3">
        <Col>
          <h2>Access Denied</h2>
          <p>You must be an administrator to view this page.</p>
        </Col>
      </Container>
    );
  }

  const contacts = await prisma.contact.findMany({ orderBy: { lastName: 'asc' } });

  return (
    <Container id="admin-page" className="py-3">
      <Col>
        <h2>List Contacts (Admin)</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {contacts.map((contact) => (
            <Col key={`Contact-${contact.id}`}>
              <ContactCardAdmin contact={contact} />
            </Col>
          ))}
        </Row>
      </Col>
    </Container>
  );
};

export default Admin;
