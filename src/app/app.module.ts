import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { MultipleDropdownControlComponent } from './jsonforms/control/multiple-dropdown-control.component';
import { PrintDataControlComponent } from './jsonforms/control/print-data-control.component';
import { TestGroupButtonLayoutComponent } from './jsonforms/layout/test-group-button-layout.component';
import { RegisterComponent } from './register/register.component';
import { DummyInterceptor } from './utils/interceptors/dummy.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        DynamicFormComponent,
        RegisterComponent,
        TestGroupButtonLayoutComponent,
        PrintDataControlComponent,
        MultipleDropdownControlComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        NgbModule,
        NgSelectModule,
        JsonFormsModule,
        JsonFormsAngularMaterialModule,
        ReactiveFormsModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: DummyInterceptor, multi: true }
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
