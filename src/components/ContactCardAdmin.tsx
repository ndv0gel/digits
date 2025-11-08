'use client';

import { Card, Image } from 'react-bootstrap';
import { Contact } from '@prisma/client'; // Import Contact from @prisma/client

interface ContactCardAdminProps {
  contact: Contact;
}

const ContactCardAdmin: React.FC<ContactCardAdminProps> = ({ contact }) => (
  <Card className="h-100">
    <Card.Header>
      <Image src={contact.image} width="75px" roundedCircle className="me-2" />
      <Card.Title>{`${contact.firstName} ${contact.lastName}`}</Card.Title>
      <Card.Subtitle>{contact.address}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>{contact.description}</Card.Text>
      <p className="blockquote-footer">{contact.owner}</p>
    </Card.Body>
  </Card>
);

export default ContactCardAdmin;
