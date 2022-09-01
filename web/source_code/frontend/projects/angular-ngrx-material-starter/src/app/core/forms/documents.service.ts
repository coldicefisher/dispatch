import { Injectable, OnInit } from '@angular/core';


import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { printStyles } from "./printStyles";

import { DeviceDetectorService } from 'ngx-device-detector';
import { CryptographyService } from '../core.module';
import { SocketService } from '../socket/socket.service';


@Injectable({providedIn: 'root' })

export class DocumentsService implements OnInit {
  
  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private cryptographyService: CryptographyService,    
    private socketService: SocketService
  ){ }

  ngOnInit(): void {
    
  }

  // MAIN FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////
    
  _generateKeyContent(verifyingKey: string, originalDoc: string, signature: string ) {
    let deviceInfo = this.deviceDetectorService.getDeviceInfo();
  

    let htmlSign = `<div class="printable-container">`;
    htmlSign += `<h1 class="pr pr-h1">Signature details</hl>`;
    htmlSign += `<p class="pr">The encoded document is verified in as bytes of a base64 encoded pdf document. The verifying key is encoded in byte format. The hash used is SHA256 and the signing algorithm is NIST384p. The signature is encoded in bytes</p>`;
    htmlSign += `<br class="pr pr-break"><div class="row"><div class="col">`;
    htmlSign += `<hr><h3 class="pr pr-h1">Encoded document</h3><br>`;
    htmlSign += originalDoc.toString();
    htmlSign += `</div></div><div class="pr-break"></div>`;
    htmlSign += `<div class="row"><div class="col">`;
    htmlSign += `<h4 class="pr pr-h4">Verifying key:</h4><p class="pr">${verifyingKey.toString()}<p>`;
    htmlSign += `<br><br><h4 class="pr pr-h4">Signature:</h4><p class="pr pr-p">${signature.toString()}<br>`;
    // htmlSign += `<h4 class="pr pr-h4">Device information:</h4><p class="pr">${deviceInfo}</p>`
    htmlSign += `</div>`
    
    return htmlSign;

  }

  pdfOpen(args: {showBranding: boolean, 
                }) {
    
    // Get the parent element
    var parents = document.getElementsByClassName('printable-container');
    let content = []; // Array of objects that is passed to the pdfmake class "content"
    var textContent: string[] = ['',];
    var pageHeader = '';
    const BreakError = {}

    Array.from(parents).map((parent) => { // Iterate all printable containers
      let columns = [];
      let columnStatus = 0;
      let bullets = [];
      let bulletStatus = 0;
      let bulletType = '';
      
      
      Array.from(parent.getElementsByClassName('pr')).map((child) => { // Iterate all the elements in the printable containers
          // Add the styles
          let styles = []; // Used to build the styles based on classes prefixed "pr"
          let margin = []; // holds the margin settings
          var element = {text: '', style: [], margin: [], link: '', pageBreak: ''}; // Builds the element that is added to the "content" array for pdfmake
          var headerTitle = '';  // If class "pr-header" is found, the text for the header is set here
          var isColumn = false;
          var isElement = true;
          var lineWidth = 100;
          var isLink = false;
          var linkHref = '';
          var isDuplicate = false;
          
        
          // Process NON ELEMENTAL FIRST///////////////////////////////////
          // BULLETS ////////////
          try {
            
            if (textContent.includes(child.textContent)) { 
              if (child.textContent != ''){
                throw BreakError; 
              }
            }
          
            if (child.nodeName === 'OL') { bulletStatus = 1; bulletType = 'ol'; throw BreakError}
            if (child.nodeName === 'UL') { bulletStatus = 1; bulletType = 'ul'; throw BreakError}
            if (child.nodeName === 'LI') {
            // Get bullet styles
              let bulletStyles = [];
              child.classList.forEach((bulletStyle) => {
                if (bulletStyle.slice(0,2) === 'pr') {
                  bulletStyles.push(bulletStyle);
                }
              bulletStyles.push('pr-li')
              
              bullets.push({text: child.textContent, style: bulletStyles}); 
              throw BreakError;
              });
            };
            if (child.nodeName != 'LI' && child.nodeName != 'UL' && child.nodeName != 'OL' && bulletStatus === 1) 
              {
                
                if (bulletType === 'ul') {content.push({ ul: bullets});}
                else if (bulletType === 'ol') {content.push({ ol: bullets});}
                bulletStatus = 0;
                bullets = [];
                
              }
            // END BULLETS /////////

            // PAGE throw BreakErrorS
            if (child.classList.contains('pr-break')) {
              content.push({text: '', pageBreak: 'after'})
              throw BreakError;
            }

            // Header
            if (child.classList.contains('pr-header')) { headerTitle = child.textContent; pageHeader = child.textContent; throw BreakError}

        
            // ELEMENTS ////////////////////////////////////////////

            // Margins
            if (child.nodeName === "P") 
              { margin = [0, 10, 0, 10]; styles.push('pr-p') }
            else if (child.nodeName === 'H1' || child.nodeName === 'H2' || child.nodeName === 'H3') 
              { margin = [0, 20, 0, 10] }
              else { margin = [0, 10, 0, 10] }

            // Create links
            if (child.nodeName === 'A') {
              isLink = true;
              linkHref = child.getAttribute('href');
            }
            
            // Set header styling
            if (child.nodeName === 'H1'){styles.push('pr-h1')}
            if (child.nodeName === 'H2'){styles.push('pr-h2')}
            if (child.nodeName === 'H3'){styles.push('pr-h3')}
            if (child.nodeName === 'H4'){styles.push('pr-h4')}
            if (child.nodeName === 'H5'){styles.push('pr-h5')}
            if (child.nodeName === 'H6'){styles.push('pr-h6')}
            
            // Set the classes for each class iterable of child
            child.classList.forEach((style) => {
              
              if (style.slice(0,2) === 'pr') {
                styles.push(style);

                // Set indent and blockquote //////////////////////////////////////////
                if (style === 'pr-indent') { margin = [20, 10, 0, 10] }
                if (style === 'pr-blockquote') { margin = [20, 10, 10, 10] }
                //else if (style === 'pr-paragraph') { margin = [0, 10, 0, 10] }
                
                // End set the margins ////////////////////////////////////////////////

                // Set columns
                if (style.slice(0,6) === 'pr-col' ) {isColumn = true}
                if (style === 'pr-col-container') {
                  Array.from(child.getElementsByClassName('pr-col')).map((col) => {  
                    let colStyles = []
                    col.classList.forEach((colStyle) => {
                      if (colStyle.slice(0,2) === 'pr') {
                        colStyles.push(colStyle);
                      }
                    });
                    // Add columns to column array
                    columns.push({text: col.textContent, style: colStyles})
                    
                  });
                  content.push({columns: columns});
                  columns = [];
                  throw BreakError;
                }
                // END COLUMNS
                // Draw lines
                if (style.slice(0, 7) === 'pr-line') {
                  lineWidth = Number(style.split("-")[2]);
                  if (lineWidth < 100 || isNaN(lineWidth)) {lineWidth = 100;}
                  // Add line to page
                  {content.push({canvas: [{
                        type: 'line',
                        x1: 0, y1: 0,
                        x2: Number(lineWidth), y2: 0,
                        lineWidth: 1
                      }]
                    });
                    throw BreakError;
                  }

                }
              }
            });
            
            // Build the element ///////////////////////////////////////////////////
            
            if (isLink) { // make link
              content.push({
                text: child.textContent,
                style: styles,
                margin: margin,
                link: linkHref,
                
              })
              throw BreakError;
            }

            //if (isElement) {
            if (! isColumn) {
            content.push({
                text: child.textContent,
                style: styles,
                margin: margin,
              })
            }


            textContent.push(child.textContent);

            // Debug print ////////////////////////////////
            // console.log(`Element:`);
            // console.log(element);
            // console.log(`Is element: ${isElement}`);
            // console.log(`bulletStatus: ${bulletStatus}`);
            // console.log(`bulletType: ${bulletType}`);
          
        }  // END TRY BLOCK
          catch (err) {
            if (err === BreakError){}
            if (err !== BreakError){throw err}
          }
        
      }); // END CHILD LOOP
    }); // END PARENT LOOP

    // console.log(content);
    var documentDefinition = {}
    if (args.showBranding) {
      documentDefinition = { content: content, styles: printStyles, pageMargins: [ 40, 80, 40, 120 ],
          header: function() {
            return [{ text: pageHeader, alignment: 'left', style: {fontSize: 9}, margin: [40, 40, 0, 0]}]
        },
          footer: function(currentPage, pageCount) { 
              return [
                { text: '\n\n\n' + 'Brought to you by bizniz.io', alignment: 'left', style: {fontSize: 9}, margin: [40, 0, 0, 0]},  
                { text:  currentPage.toString() + ' of ' + pageCount, alignment: 'right', style: {fontSize: 9}, margin: [0, 0, 40, 0] },
                
              ]
        },
          watermark: { text: 'Brought to you by bizniz.io', color: 'blue', opacity: 0.1, bold: true, italics: false, fontSize: 28, angle: -45 }
        }
    }
    else {
      documentDefinition = { content: content, styles: printStyles, pageMargins: [ 40, 100, 40, 100 ],
          header: function() {
            return [{ text: pageHeader, alignment: 'left', style: {fontSize: 9}, margin: [40, 20, 0, 0]  },]
        },
          footer: function(currentPage, pageCount) { 
                return [{ text: '\n\n\n' + currentPage.toString() + ' of ' + pageCount, alignment: 'right', style: {fontSize: 9}, margin: [0, 0, 40, 0] },]
        },
      
      }
    }

    
    let doc = pdfMake.createPdf(documentDefinition); 
    return doc;
    
  }
  
  
  sendSignedDocument(args: {profileId: string, 
                            templateName: string, 
                            showBranding: boolean,
                            allowDuplicates: boolean
                          }) {
    
    let doc = this.pdfOpen({showBranding: args.showBranding});
    doc.getBase64((buffered) => {
      console.log(buffered);
      this.cryptographyService.signMessage(buffered)
      .then((values) => {
        let signature = values.signature;
        let pubKey = values.publicKey;
        let encoded = values.encodedMessage;
        
        this.socketService.send({
          'command': "signed_document", 
          "payload": {
            'signature': signature, 
            'public_key': pubKey, 
            'contents': encoded,
            'profile_id': args.profileId, 
            'template_name': args.templateName,
            'allow_duplicates': args.allowDuplicates
          }
        })
      });
    })
    return doc;
  }

  getClientFriendlyTemplate(s: string) {
    let [businessName, templateName, ...rest] = s.split('.');
    let words = templateName.split("_");
    words = words.slice(0,-1);
    let finalWords = [];
    for (let w of words) {
      finalWords.push(this.capitalizeFirstLetter(w));
    } 
    return finalWords.join(' ');
  }
  
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}