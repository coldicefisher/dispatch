import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Injectable } from "@angular/core";

import { SocketService } from "../socket/socket.service";

import {from, pipe } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    private BASE_URL = 'http://localhost/api/login/';

    constructor(
        private http: HttpClient,
        private socketService: SocketService,

    ){}

    private getData(formData: FormData): Observable<any> {
        const url = `https://api.cloudflare.com/client/v4/accounts/f84073b7dfdcf0d7b7654a527b5446e6/images/v1`;
        return from(
        fetch(
            url, // the url you are trying to access
            {
                body: formData,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET', // GET, POST, PUT, DELETE
                mode: 'no-cors' // the most important option
            }
        ));
    }
    public uploadImageToCloudflare(image: File) {
        console.log('form data cloudflare');
        console.log(image);
        const formData = new FormData();
        formData.append('file', image);

        formData.append('file', image);
        //curl -X POST -F file=@.//home/test.png -H "Authorization: Bearer 0PbtDqN33iPr1agtvAlL46cGQoLBYkaHOLxZMj50" 
        const url = `https://api.cloudflare.com/client/v4/accounts/f84073b7dfdcf0d7b7654a527b5446e6/images/v1`;
        let headers = new HttpHeaders();
        headers.append('Authorization', 'Bearer 0PbtDqN33iPr1agtvAlL46cGQoLBYkaHOLxZMj50');
        //headers.append('Content-Type', 'application/json');
        //headers.append('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        headers.append('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
        headers.append('Access-Control-Max-Age', '86400');
        headers.append('vary', 'origin');

        headers.append('Access-Control-Allow-Origin', '*');
        //return this.getData(formData);
        return this.http.post<any>(url, formData, {headers: {'Allow-Access-Control-Origin': '*'}} )
        return this.http.post<any>(url, formData, {headers: headers})
                .pipe(
                    map( response => {
                        response.mode = 'no-cors';
                        response.headers.append('Allow-Access-Control-Origin', '*');
                        return response;
                    }),
                )
        
    }

    public processImageInfoFromUploadCare(id: number, imageType: string, uuid: string, originalUrl: string, cdnUrl: string, name: string, mimeType: string, size: number) {
        let payload = {
            'id': id,
            'imageType': imageType,
            'uuid': uuid,
            'originalUrl': originalUrl,
            'cdnUrl': cdnUrl,
            'name': name,
            'mimeType': mimeType,
            'size': size
        }
        this.socketService.send(payload);        
    }

    // public uploadImage(image: File, formData: FormData): Observable<any> {
    public uploadImage(image: File) { 
        // formData.append('fileKey', image, image.name);
        console.log('form data');
        console.log(image);
        const formData = new FormData();
        formData.append('file', image);
        const url = `${this.BASE_URL}/post-image`;
        return this.http.post(url, formData);
        return this.http.post<any>(url, formData);
        return this.http.post(url, formData);
    }
}