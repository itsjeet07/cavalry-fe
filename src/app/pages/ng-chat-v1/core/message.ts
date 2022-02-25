import { flattenDiagnosticMessageText } from 'typescript';
import { MessageType } from './message-type.enum';

export class Message {
  public type?: MessageType = MessageType.Text;
  public fromId: any;
  public toId: any;
  public message: string;
  public messageType?: string;
  public dateSent?: Date;
  public dateSeen?: Date;
  public totalMessages?: number;
  public id?: string;
  public sender?: any;
  public resourceDetails?: any;
  public isGroup?: boolean = false;
  public fileSizeInBytes?: any;
  public downloadUrl?: any;
  public fromInternal?: boolean = false;
  public replyTo?:any;
  subscribers?:any[];

}
