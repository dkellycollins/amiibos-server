import * as _ from 'lodash';
import {injectable, inject} from 'inversify';
import {Controller, Get, Post, Put, Delete} from 'inversify-express-utils';
import {Request} from 'express';
import {IAmiibo} from '../models';
import {IAmiiboManager} from '../managers';
import {IMessageFactory} from './messages/IMessageFactory';
import {IAmiiboMessage} from './messages/AmiiboMessageFactory';
import {TYPES} from '../types';
import * as passport from 'passport';

@injectable()
@Controller('/amiibos')
export class AmiibosController {

  constructor(
    @inject(TYPES.Managers.AmiiboManager) private _amiiboManager: IAmiiboManager,
    @inject(TYPES.Controllers.Messages.AmiiboMessageFactory) private _amiiboMessageFactory: IMessageFactory<IAmiibo, IAmiiboMessage>) {
  }

  @Get('/')
  public async search(req: Request): Promise<IAmiiboMessage[]> {
    const searchResults = await this._amiiboManager.search(req.query);
    return await this._amiiboMessageFactory.toMessages(searchResults);
  }

  @Put('/', passport.authenticate('localapikey', {session: false}))
  public async resolve(req: Request): Promise<IAmiiboMessage[]>{
    const amiibos = await this._amiiboManager.resolve(req.body);
    return await this._amiiboMessageFactory.toMessages(amiibos);
  }

  @Delete('/:name', passport.authenticate('localapikey', {session: false}))
  public async remove(req: Request): Promise<boolean> {
    await this._amiiboManager.remove(req.params.name);
    return true;
  }
}