import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { FileUploadService } from '../file-upload.service';

class UtilConstants {
    public static APPROACHES = {
        WEB_COMPONENT: 'web-component',
        JSON: 'json'
    };
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: [ './register.component.scss' ]
})
export class RegisterComponent implements OnInit {

    // Variable to store shortLink from api response
    shortLink = '';
    loading = false; // Flag variable
    file: File = null; // Variable to store file

    // helpers on the form:
    registerForm = new FormGroup({
        file: new FormControl(null, Validators.required),
        approachToRegister: new FormControl(UtilConstants.APPROACHES.JSON, Validators.required),
        jsonFileName: new FormControl(null, Validators.required)
    });

    constructor(public activeModal: NgbActiveModal,
                private fileUploadService: FileUploadService) {
    }

    ngOnInit(): void {
    }

    // On file Select
    onChange(event) {
        this.file = event.target.files[ 0 ];
        this.registerForm.get('file').patchValue(this.file.name);
        this.registerForm.get('file').updateValueAndValidity();
    }

    onChangedApproachType() {
        if (this.registerForm.get('approachToRegister').value === this.utilConstants.APPROACHES.JSON) {
            this.registerForm.get('customTagNameOfWebComponent').disable();
            this.registerForm.get('jsonFileName').enable();
            return;
        }
        this.registerForm.get('jsonFileName').disable();
        if (!this.registerForm.get('customTagNameOfWebComponent')) {
            this.registerForm.addControl('customTagNameOfWebComponent', new FormControl(null, Validators.required));
        } else {
            this.registerForm.get('customTagNameOfWebComponent').enable();
        }
    }

    // OnClick of button Upload
    onUpload() {
        this.loading = !this.loading;
        console.log('this.registerForm.value ->', this.registerForm.value);

        // TODO: need to change this in order to hit the NodeJS API
        this.fileUploadService
          .upload(this.file)
          .pipe(filter((event: any) => typeof (event) === 'object'))
          .subscribe(
            (event: any) => {
                // Short link via api response
                this.shortLink = event.link;
                this.loading = false;
            }
          );
    }

    get utilConstants() {
        return UtilConstants;
    }
}
