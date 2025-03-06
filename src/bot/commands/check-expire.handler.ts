import { MyContext } from '../types/types';
import { channelId, messageIds } from '../config';
import { CodeLogModel } from '../../db/models/code-logs.model';
import { getDateDuration } from '../../common/utility/date-diff';
import { COLLECTIONS } from '../../common/constant/tables';

export async function checkExpireMethod(ctx: MyContext) {
  // const log = await CodeLogModel.findOne({
  //   codeId: { $ne: null },
  // })
  //   .sort({ createdAt: 1 })
  //   .lean();

  const logs = await CodeLogModel.aggregate([
    {
      $match: {
        userId: ctx.session.user.db_id,
        codeId: { $ne: null },
      },
    },
    {
      $sort: { createdAt: 1 },
    },
    {
      $group: {
        _id: '$codeId',
        createdAt: { $first: '$createdAt' },
      },
    },
    {
      $lookup: {
        from: COLLECTIONS.codes,
        let: { codeId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$codeId'],
              },
            },
          },
        ],
        as: 'codes',
      },
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        productId: { $first: '$codes.productId' },
        value: { $first: '$codes.value' },
      },
    },
    {
      $lookup: {
        from: COLLECTIONS.products,
        let: { productId: '$productId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$productId'],
              },
            },
          },
        ],
        as: 'products',
      },
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        productId: 1,
        value: 1,
        productName: { $first: '$products.name' },
      },
    },
  ]);

  if (logs.length === 0) {
    return await ctx.api.forwardMessage(
      ctx.from.id,
      channelId,
      messageIds[ctx.i18n.languageCode as 'uz' | 'ru'].codeNotRegistered,
    );
  }

  // if (!log) {
  //   return await ctx.api.forwardMessage(
  //     ctx.from.id,
  //     channelId,
  //     messageIds[ctx.i18n.languageCode as 'uz' | 'ru'].codeNotRegistered,
  //   );
  // }

  // await ctx.api.forwardMessage(
  //   ctx.from.id,
  //   channelId,
  //   messageIds[ctx.i18n.languageCode as 'uz' | 'ru'].expiresAt,
  // );

  let text = ``;
  for (const log of logs) {
    const duration = getDateDuration(new Date(), new Date(log.createdAt));
    const time =
      duration.days() <= 365 ? `📅 <b>${ctx.i18n.t('common.days')}: ${365 - duration.days()}</b>` : 0;
    // : ctx.i18n.t('expired');

    text += `${log.productName}\n${log.value}\n${time}\n\n`;
  }
  // ${ctx.i18n.t('years')}: ${duration.years()}\n
  // ${ctx.i18n.t('months')}: ${duration.months()}\n
  // ${ctx.i18n.t('hours')}: ${duration.hours()}\n
  // ${ctx.i18n.t('minutes')}: ${duration.minutes()}\n

  return await ctx.reply(text, { parse_mode: 'HTML' });
}
