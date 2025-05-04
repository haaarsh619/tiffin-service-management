import { Controller, Get, Post, Body, Param, ParseIntPipe, Res } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Response } from 'express';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get(':userId/:month')
  async generateInvoice(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('month') month: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.invoicesService.generateInvoice(userId, month);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${userId}-${month}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  }
}