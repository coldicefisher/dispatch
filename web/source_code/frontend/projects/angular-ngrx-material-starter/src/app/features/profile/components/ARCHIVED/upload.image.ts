
  onFileSelected(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new imageSnippet(event.target.result, file);
      this.selectedFile.pending = true;
      
    //   this.imageService.uploadImage(this.selectedFile.file).subscribe(
    //     (res) => {
    //       this.onSuccess();
    //     },
    //     (err) => {
    //       this.onError();
    //     }
    //   )
      console.log('selected file');
      console.log(this.selectedFile.file);

      this.store.dispatch(actionImageUpload({ image: this.selectedFile.file }));
      this.store.dispatch(actionImageUploadToCloudflare({ image: this.selectedFile.file }))
    });
    
    reader.readAsDataURL(file);
  }
