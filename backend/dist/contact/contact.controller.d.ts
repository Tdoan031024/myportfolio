import { CreateContactDto } from './contact.dto';
import { ContactService } from './contact.service';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(payload: CreateContactDto): Promise<import("./contact.entity").ContactMessage>;
}
