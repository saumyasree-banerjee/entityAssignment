import { CommonValidators } from '../../../shared/validations/common-validators';
import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { DialogComponent,  DialogService } from 'ng2-bootstrap-modal';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { EntitygroupService } from '../../../shared/services/entitygroup.service';
import { Router, RouterLinkActive } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

export interface ConfirmModel {
  dataCollectionCode: string;
  }

@Component({
  selector: 'app-confirm',
  templateUrl: './add-entity-group.component.html',
  styleUrls: ['./add-entity-group.component.css']
})

export class AddEntityGroupComponent extends DialogComponent<ConfirmModel, string> implements ConfirmModel, OnInit {
  dataCollectionCode:  string;
  addEntityGroup: FormGroup;
  errors: Array<string> = [];
  disposable: any;
  serverSideError;
  @ViewChild('addentityGroupNameNative') addentityGroupNameNative: ElementRef;

    constructor(dialogService:  DialogService,
                fb: FormBuilder,
                private logger: NGXLogger,
                private addentityGroupService: EntitygroupService,
                protected router: Router ) {
        super(dialogService);
    this.addEntityGroup = fb.group({
      entityGroupName: ['', [Validators.required]],
      entityGroupDescription: ['', [Validators.required, Validators.maxLength(500)]]
   });
  }
  get entityGroupName(){ return this.addEntityGroup.get('entityGroupName'); }
  get entityGroupDescription(){ return this.addEntityGroup.get('entityGroupDescription'); }
  ngOnInit() {}

  addEntityGroups() {
      const jsonstring = JSON.stringify({
        dataCollectionCode: this.dataCollectionCode,
        name: this.entityGroupName.value === '' ? this.entityGroupName.value : this.entityGroupName.value.replace(/[^a-zA-Z0-9 ]/gi, ''),
        description: this.entityGroupDescription.value,
        dataCollectionId: ''
      });
      this.logger.debug('entry data: ' + jsonstring);
      this.addentityGroupService.addEntityGroup(jsonstring).subscribe(
        entry => this.handleSubmitSuccess(entry),
        error => this.handleSubmitError(error)
      );
  }
  protected handleSubmitError(error: any) {
    console.log('handleSubmitError', error);
    if (error.errorList.length > 0) {
      this.serverSideError = error.errorList;
      this.addEntityGroup.setErrors({'errorResponse': true});
    } else {
      this.result = this.createJsonResp(error);
      this.close();
    }
  }
  protected handleSubmitSuccess(data: any) {
    if (data.errorList.length > 0) {
      this.serverSideError = data.errorList;
      this.addEntityGroup.setErrors({'errorResponse': true});
    } else {
      this.result = this.createJsonResp(data);
      this.close();
    }
  }
  private createJsonResp(data) {
    const jsonstring = JSON.stringify({
      result: 'success',
      entityGroupId: data.responseData.entityGroupId
    });
    return jsonstring;
  }
  refineModel(event) {
      // tslint:disable-next-line:max-line-length
      if (event.key === 'Left' || event.key === 'Right' || event.key === 'Del' || event.key === 'Home' || (event.keyCode === 65 && event.ctrlKey) || (event.keyCode === 88 && event.ctrlKey) ) {
        return;
      } else {
        setTimeout(() => {
          this.entityGroupName.setValue(this.addentityGroupNameNative.nativeElement.value);
        }, 15);
      }

    }

}
