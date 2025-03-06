// import './start.handler'
// import './birthday.command'
import bot from '../core/bot';
import { checkExpireMethod } from './check-expire.handler';
import { generateCodeCommand } from './generateCode.command';
import { langListMenuCommand } from './lasnglist.handler';
import { mainMenu } from './start.handler';

bot.command('generate', generateCodeCommand);
bot.command('start', async (ctx) => mainMenu(ctx));
bot.command('check', checkExpireMethod);
bot.command('language', langListMenuCommand);
