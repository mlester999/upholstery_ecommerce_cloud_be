import { Controller, Get } from '@nestjs/common';
import * as Paymongo from 'paymongo';

@Controller('paymongo-test')
export class PaymongoController {
  @Get()
  async paymongoTest() {
    const paymongo = new Paymongo(process.env.SECRET_KEY);

    const result = await paymongo.webhooks.list();

    // await paymongo.webhooks.toggle('hook_2XpFfnMeD6ngKc9hTPAUmJbz', 'disable');

    const retrieveResult = await paymongo.webhooks.retrieve(
      'hook_vEj9sXLZG4UnFucPPTqxgrhV',
    );

    console.log(result);
    console.log(retrieveResult);
    // console.log(retrieveResult.data);

    // async function listWebhooks() {
    //   return paymongo.webhooks.list();
    // }

    // listWebhooks()
    //   .then((result) => console.log(result))
    //   .catch();
  }
}
