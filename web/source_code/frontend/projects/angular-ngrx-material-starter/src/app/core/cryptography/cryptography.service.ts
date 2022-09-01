// import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';


// import { Observable } from 'rxjs';

// import { DeviceDetectorService } from "ngx-device-detector";
// import { Store, select } from '@ngrx/store';
// import { AppState } from '../core.module';


// import { SocketService } from '../../core/socket/socket.service';

@Injectable({providedIn: 'root' })

export class CryptographyService implements OnInit {
  
  constructor(){ }

  ngOnInit(): void {
    
  }

  // HELPER FUNCTIONS ///////////////////////////////////////////////////////////////////////////////

  buf2hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
  }
  hex2buf(hexString) {
    return Buffer.from(hexString, 'hex').toString('base64');
  }

  hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
  }

  async generateSignatureKeys() {
    let keys: any = await crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-384"
      },
      true,
      ["sign", "verify"]
      // {name: "HMAC", hash: {name: "SHA-512"}}, true, ["sign", "verify"]
    );      
    let pubKey = await crypto.subtle.exportKey("raw", keys.publicKey);
    let privKey = keys.privateKey;
    return [pubKey, privKey]
  }

  async signMessage(msg, encode: boolean = true) {
    let keys = await this.generateSignatureKeys();
    let pubKey = keys[0];
    let privKey = keys[1];
    let encoded: any;
    if (encode){
      let enc = new TextEncoder();
      encoded = enc.encode(JSON.stringify(msg));
    }
    else {
      encoded = msg;
    }

    let signature = await crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: {name: "SHA-384"},
      },
      privKey,
      encoded
    );
    return {'signature': this.buf2hex(signature), 'publicKey': this.buf2hex(pubKey), 'encodedMessage': this.buf2hex(encoded)};
  }
  exportKey(key) {
    return (crypto.subtle.exportKey("raw", key));
  }

  neuterKey(jwk) {
    var copy = Object.assign({}, jwk);
    delete copy.d;
    copy.key_ops = ['verify']
    return copy;
  }
  // END HELPER FUNCTIONS /////////////////////////////////////////////////////////////////////////////

  // MAIN FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////
  
}
