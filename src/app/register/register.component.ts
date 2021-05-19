import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { FileUploadService } from '../utils/services/file-upload.service';
import { UtilConstants } from '../utils/util-constants';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: [ './register.component.scss' ]
})
export class RegisterComponent implements OnInit {

    loading = false; // Flag variable
    files: File[] = null; // Variable to store files

    // helpers on the form:
    registerForm = new FormGroup({
        fileNames: new FormControl([], Validators.required),
        approachToRegister: new FormControl(UtilConstants.APPROACHES.JSON, Validators.required),
        formName: new FormControl(null, Validators.required)
    });

    constructor(public activeModal: NgbActiveModal,
                private fileUploadService: FileUploadService) {
    }

    ngOnInit(): void {
    }

    get approachToRegister() {
        return this.registerForm.get('approachToRegister');
    }

    // On file Select
    onChange(event) {
        this.files = Object.entries(event.target.files)
          .map(([ , file ]) => file as File);
        this.registerForm.get('fileNames').patchValue(this.files.map(f => f.name));
        this.registerForm.get('fileNames').updateValueAndValidity();
    }

    onChangedApproachType() {
        if (this.approachToRegister.value === this.utilConstants.APPROACHES.JSON) {
            this.registerForm.get('customTagNameOfWebComponent').disable();
            return;
        }
        if (!this.registerForm.get('customTagNameOfWebComponent')) {
            this.registerForm.addControl('customTagNameOfWebComponent', new FormControl(null, Validators.required));
        } else {
            this.registerForm.get('customTagNameOfWebComponent').enable();
        }
    }

    // OnClick of button Upload
    onUpload() {
        let httpCall = this.fileUploadService.upload(this.files[ 0 ], this.registerForm.value);
        if (this.approachToRegister.value === this.utilConstants.APPROACHES.JSON) {
            httpCall = this.fileUploadService.uploadFiles(this.files, this.registerForm.value);
        }
        this.loading = !this.loading;

        httpCall
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
                this.loading = false;
                this.activeModal.close('web component/json registered successfully');
            }
          );
    }

    get utilConstants() {
        return UtilConstants;
    }
}
