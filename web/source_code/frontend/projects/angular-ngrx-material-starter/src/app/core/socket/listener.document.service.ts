// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

// import { Observable } from 'rxjs';
// import { WebSocketSubject, webSocket } from 'rxjs/webSocket'; // new
// import { map, share, tap, catchError, retryWhen } from 'rxjs/operators'; // changed

import { Store, select } from '@ngrx/store';
import { AppState } from '../core.module';

// import { profileWorkHistory } from '../profile/state';
import { SocketService } from './socket.service';
import { takeUntil } from 'rxjs/operators';

import { BehaviorSubject } from 'rxjs';

import { 
  actionSignedDocumentExists,
  actionSignedDocumentFailure,
  actionSignedDocumentInvalid,
  actionSignedDocumentSuccess
} from '../forms/actions';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ListenerDocumentService implements OnInit {
  destroyed$ = new Subject();
  started$: BehaviorSubject<boolean>;
  constructor(
    private socketService: SocketService,
    private store: Store<AppState>,
  )
  { 
    this.started$  = new BehaviorSubject<boolean>(false);

  }
  ngOnInit(): void { }

//this.webSocket.closed
  downloadPdf(hexData, contentType='', sliceSize=512) {
    const byteString = window.atob(hexData.slice(1,-1));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    //const blob = new Blob([int8Array], { type: 'application/pdf'});
    const blob = new Blob([int8Array], { type: 'application/pdf'});
    return blob;
  }
  
  start(): boolean {
    if (this.started$.value) { return false; }
    
    this.socketService.connect().pipe(
      takeUntil(this.destroyed$)
    ).subscribe(message => {
      if (message && message != null && message.key && message.payload && message.command) {

        if (message.key === 'document'){

          switch (message.command) {

            // GET AND VIEW DOCUMENT /////////////////////////////////////////////
            case 'document_fetched':
              let contents = message.payload.contents;
              let d = this.downloadPdf(contents, 'document');
              
              ///////////////////////////////////////////
              var url = window.URL.createObjectURL(d);
              //   //window.open(url, '_blank', '');
              var anchor = document.createElement('a');
              anchor.href = url;
              anchor.target = '_blank';
              anchor.click();
              break;
            // END GET AND VIEW DOCUMENT /////////////////////////////////////////
            
            // DOCUMENT SIGNED ///////////////////////////////////////////////////
            case "document_processed":
              switch (message.payload.status) {
                case "invalid_signature":
                  this.store.dispatch(actionSignedDocumentInvalid({templateName: message.payload.templateName}));
                  break;

                case "document_exists":
                  this.store.dispatch(actionSignedDocumentExists({templateName: message.payload.templateName}));
                  break;
                
                case "document_failed":
                  this.store.dispatch(actionSignedDocumentFailure({templateName: message.payload.templateName}))
                  break;

                case "document_created":
                  this.store.dispatch(actionSignedDocumentSuccess({templateName: message.payload.templateName}));
                  break;

              }
              break;
          }
        }
      }
    })
    this.started$.next(true);
    return true;
  }  
}
