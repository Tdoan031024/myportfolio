import { Body, Controller, Post } from '@nestjs/common';
import { CreateContactDto } from './contact.dto';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() payload: CreateContactDto) {
    return this.contactService.create(payload);
  }
}
