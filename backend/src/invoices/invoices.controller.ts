import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get(':userId/:month')
  generateInvoice(@Param('userId') userId: string, @Param('month') month: string) {
    return this.invoicesService.generateInvoice(parseInt(userId), month);
  }
}