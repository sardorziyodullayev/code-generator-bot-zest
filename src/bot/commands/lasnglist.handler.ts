import { MyContext } from '../types/types';
import { languagesListInline } from '../helpers/inline.keyboard';

export async function langListMenuCommand(ctx: MyContext) {
  ctx.session.is_editable_message = true;

  return await ctx.reply(ctx.i18n.t('menu.langListContent'), {
    reply_markup: languagesListInline(ctx),
  });
}
