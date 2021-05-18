import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { FileUploadService } from '../file-upload.service';
import { UtilConstants } from '../utils/util-constants';

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
        fileName: new FormControl(null, Validators.required),
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
        this.registerForm.get('fileName').patchValue(this.file.name);
        this.registerForm.get('fileName').updateValueAndValidity();
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

        this.fileUploadService
          .upload(this.file, this.registerForm.value)
          .pipe(
            filter((event: any) => typeof (event) === 'object'),
            catchError((err) => {
                alert('Invalid mime type');
                this.loading = false;
                return throwError(new HttpErrorResponse({
                    error: err.error,
                    statusText: err.message,
                    status: err.status
                }));
            })
          )
          .subscribe(
            (event: any) => {
                // Short link via api response
                this.loading = false;
                this.activeModal.close('web component/json registered successfully');
            }
          );
    }

    get utilConstants() {
        return UtilConstants;
    }
}
