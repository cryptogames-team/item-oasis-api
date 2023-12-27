import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
    .setTitle('Item Oasis API Docs')
    .setDescription('Item Oasis API Docs')
    .setVersion('1.0.0')
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            name: 'JWT',
            in: 'heaer'
        },
        'access-token'
    )
    .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
}