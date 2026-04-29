import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './contact.dto';
import { ContactMessage } from './contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepository: Repository<ContactMessage>,
  ) {}

  async create(payload: CreateContactDto) {
    const message = this.contactRepository.create(payload);
    return this.contactRepository.save(message);
  }
}
