import { Col, Container, Row } from 'react-bootstrap';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/authOptions';
import { prisma } from '@lib/prisma';
// import { Contact } from '@lib/validationSchemas'; // No longer needed for hardcoded data
import ContactCard from '@components/ContactCard';

/** The List Contacts page. */
const ListContacts = async () => {
  const session = await getServerSession(authOptions);
  const owner = session?.user?.email;

  if (!owner) {
    return (
      <Container id="list-contacts-page" className="py-3">
        <Col>
          <h2>List Contacts</h2>
          <p>Please log in to see your contacts.</p>
        </Col>
      </Container>
    );
  }

  const contacts = await prisma.contact.findMany({ where: { owner }, orderBy: { lastName: 'asc' } });

  return (
    <Container id="list-contacts-page" className="py-3">
      <Col>
        <h2>List Contacts</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {contacts.map((contact) => (
            <Col key={`Contact-${contact.id}`}>
              <ContactCard contact={contact} />
            </Col>
          ))}
        </Row>
      </Col>
    </Container>
  );
};

export default ListContacts;
