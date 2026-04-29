import { Repository } from 'typeorm';
import { CreateContactDto } from './contact.dto';
import { ContactMessage } from './contact.entity';
export declare class ContactService {
    private readonly contactRepository;
    constructor(contactRepository: Repository<ContactMessage>);
    create(payload: CreateContactDto): Promise<ContactMessage>;
}
