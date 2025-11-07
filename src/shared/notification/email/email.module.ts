import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import * as hbs from 'handlebars';
import * as fs from 'fs';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        // ✅ Register Handlebars partials manually
        const partialsDir = join(__dirname, 'templates/partials');
        if (fs.existsSync(partialsDir)) {
          const files = fs.readdirSync(partialsDir);
          files.forEach((file) => {
            if (file.endsWith('.hbs')) {
              const name = file.replace('.hbs', '');
              const template = fs.readFileSync(join(partialsDir, file), 'utf8');
              hbs.registerPartial(name, template);
            }
          });
        }

        return {
          transport: {
            host: config.get('mailHost'),
            port: config.get('mailPort'),
            secure: true,
            auth: {
              user: config.get('mailUser'),
              pass: config.get('mailPassword'),
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
          defaults: {
            from: `"visarocraft" <${config.get('mailFrom')}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
