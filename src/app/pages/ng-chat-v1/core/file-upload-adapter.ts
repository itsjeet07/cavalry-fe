import { Observable } from 'rxjs';
import { User } from './user';
import { Message } from './message';

export interface IFileUploadAdapter
{
    uploadFile(file: File, participantId: any, userId?: any): Observable<Message>;
}
