import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor() {
    //todo  set a api key in env file
    sgMail.setApiKey('YOUR_SENDGRID_API_KEY');
  }
  getHello(): string {
    return 'Hello World!';
  }

  bill(data: any) {
    this.logger.log('Billing ...', data);
  }

  generateEmailContent(message: any): string {
    let content = `گزارش خلاصه فروش روزانه:\n\n`;
    content += `مجموع فروش: ${message.totalSalesAmount} تومان\n\n`;
    content += `خلاصه فروش هر SKU:\n`;
    message.salesSummary.forEach((item: any) => {
      content += `SKU: ${item.sku}, تعداد فروخته شده: ${item.totalQuantity}\n`;
    });
    return content;
  }
  async sendEmail(content: string) {
    const recipient = 'recipient-email@example.com'; // ایمیل گیرنده
    const subject = 'گزارش خلاصه فروش روزانه';

    const msg = {
      recipient,
      from: 'mohammadhossein.zmoradi@gmail.com', // ایمیل فرستنده (میتوانید از ایمیل معتبر خود استفاده کنید)
      subject,
      text: content,
      html: `<p>${content}</p>`, // فرمت HTML نیز به صورت اختیاری قرار داده شده
    };

    try {
      await sgMail.send(msg); // ارسال ایمیل
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email', error);
    }
  }
}
