'use client';

import { Card, Image } from 'react-bootstrap';
import { Contact } from '@lib/validationSchemas';
import Link from 'next/link';

interface ContactCardProps {
  contact: Contact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => (
  <Card className="h-100">
    <Card.Header>
      <Image src={contact.image} width="75px" roundedCircle className="me-2" />
      <Card.Title>{`${contact.firstName} ${contact.lastName}`}</Card.Title>
      <Card.Subtitle>{contact.address}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>{contact.description}</Card.Text>
    </Card.Body>
    <Card.Footer>
      <Link href={`/edit/${contact.id}`}>Edit</Link>
    </Card.Footer>
  </Card>
);

export default ContactCard;
