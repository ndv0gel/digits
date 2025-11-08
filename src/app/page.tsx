import { Col, Container, Row } from 'react-bootstrap';
// import { prisma } from '@lib/prisma'; // Comment out or remove this line
// import StuffItem from '@components/StuffItem'; // Comment out or remove this line
import { Contact } from '@lib/validationSchemas';
import ContactCard from '@components/ContactCard';

/** The List Contacts page. */
const ListContacts = () => {
  // const owner = 'john@foo.com'; // Comment out or remove this line
  // const stuff = await prisma.stuff.findMany({ where: { owner }, orderBy: { name: 'asc' } }); // Comment out or remove this line
  const contacts: Contact[] = [
    {
      firstName: 'Philip',
      lastName: 'Johnson',
      address: 'POST 307, University of Hawaii',
      image: 'https://github.com/philipmjohnson.png',
      description:
        'I am a Professor of Information and Computer Sciences at the '
        + 'of the Collaborative Software Development Laboratory, and the CEO of OpenPowerQuality.com.',
    },
    {
      firstName: 'Henri',
      lastName: 'Casanova',
      address: 'POST 307, University of Hawaii',
      image: 'https://avatars0.githubusercontent.com/u/7494478?s=460&v=4',
      description:
        'I am originally from France. I maintain a list of reports from my surf sessions. I have proof '
        + 'that I ran the Hana relay with an actual Team.',
    },
    {
      firstName: 'Kim',
      lastName: 'Binsted',
      address: 'POST 307, University of Hawaii',
      image: 'https://www.ics.hawaii.edu/wp-content/uploads/2013/08/kim_binsted-square-300x300.jpg',
      description:
        'Kim Binsted received her BSc in Physics at McGill (1991), and her PhD in Artificial Intelligence'
        + 'from the University of Edinburgh (1996). Her thesis topic was the computational modeling and generation of '
        + 'punning riddles, and her program, JAPE (Joke Analysis and Production Engine), generated puns such as '
        + '"What do you call a Martian who drinks beer? An ale-ien!".',
    },
  ];

  return (
    <Container id="list-contacts-page" className="py-3">
      <Col>
        {/* Changed from "List Contacts" to "Contacts" to match image */}
        <h2>Contacts</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {contacts.map((contact) => ( // Removed index from map for react/no-array-index-key
            /* Using firstName as key, assuming unique */
            <Col key={`Contact-${contact.firstName}`}>
              <ContactCard contact={contact} />
            </Col>
          ))}
        </Row>
      </Col>
    </Container>
  );
};

export default ListContacts;
