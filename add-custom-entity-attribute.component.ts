import { NGXLogger } from 'ngx-logger';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { ReportingEntitiesService } from '../../../shared/services/reporting-entities.service';
import { CommonValidators } from '../../../shared/validations/common-validators';
export interface ConfirmModel {
  dataCollectionCode: string;
  // attrCode:string;
}
@Component({
  selector: 'app-add-custom-entity-attribute',
  templateUrl: './add-custom-entity-attribute.component.html',
  styleUrls: ['./add-custom-entity-attribute.component.css']
})
export class AddCustomEntityAttributeComponent extends DialogComponent<ConfirmModel, string> implements ConfirmModel, OnInit {
  dataCollectionCode: string;
  private list: any;
  private dropdownList = [];
  private isIdentifier = false;
  private isMandatory = false;
  private uniqLabels: any;
  private addCustomAttributeGroup: FormGroup;
  private showList;
  private isMultiSelect;
  private serverSideError;
  @ViewChild('addCustomAttributeCodeNative') addCustomAttributeCodeNative: ElementRef;
  constructor(dialogService: DialogService,
              private fb: FormBuilder,
              private logger: NGXLogger,
              private reportingEntitiesService: ReportingEntitiesService) {
    super(dialogService);
  }
  addCustomAttribute() {
    const listBox: Array<string> = [];
    let isValueList = 'N';
    if (this.addCustomAttributeGroup.get('addCustomAttributeList').value.length >= 1) {
      isValueList = 'Y';
    }
    if (this.uniqLabels !== null && this.uniqLabels !== undefined) {
      for (let l = 0; l < this.uniqLabels.length; l++) {
        if (this.uniqLabels[l] !== null && this.uniqLabels[l] !== '') {
          listBox.push(this.uniqLabels[l]);
        }
      }
    }
    const addCustomAttributeRequest = JSON.stringify({
      dcCode: this.dataCollectionCode,
      attrCode: this.addCustomAttributeCode.value,
      attrDesc: this.addCustomAttributeDesc.value,
      dataType : this.addCustomAttributeDataType.value,
      isIdentifier: this.addCustomAttributeIdentifier.value ? 'Y' : 'N',
      isValueList: isValueList,
      isMultiSelect: this.addCustomAttributeMultiSelect.value ? 'Y' : 'N',
      valueList : listBox
    });
    this.logger.debug(addCustomAttributeRequest);
    this.reportingEntitiesService.addCustomAttribute(addCustomAttributeRequest).subscribe(
      entry => this.handleSubmitSuccess(entry),
      error => this.handleSubmitError(error)
    );
  }
  protected handleSubmitError(error: any) {
    console.log('handleSubmitError', error);
    if (error.errorList.length > 0) {
      this.serverSideError = error.errorList;
      this.addCustomAttributeGroup.setErrors({'errorResponse': true});
    } else {
      this.result = this.createJsonResp(error);
      this.close();
    }
  }
  protected handleSubmitSuccess(data: any) {
    if (data.errorList.length > 0) {
      this.serverSideError = data.errorList;
      this.addCustomAttributeGroup.setErrors({'errorResponse': true});
    } else {
      this.result = this.createJsonResp(data);
      this.close();
    }
  }


  private createJsonResp(data) {
    const jsonstring = JSON.stringify({
      result: 'success',
      attrCodeID: data.responseData.attrCodeID
    });
    return jsonstring;
  }

  remove_duplicates_es6(arr) {
      const s = new Set(arr);
      const it = s.values();
      return Array.from(it);
  }

  prepareListData(listBox) {
    this.dropdownList = [];
    if (listBox.length > 0) {
    const csvnilspaces = listBox.trim();
    this.list = csvnilspaces.split(';').map((x) => {
      if ( x.trim().length > 30) {
        this.addCustomAttributeList.setErrors({'invalidCode': true});
      } else {
        return x.trim();
      }
    });
    this.list = this.list.filter(function(n) { return n !== undefined; });
    this.list.sort();
    this.uniqLabels = this.remove_duplicates_es6(this.list);

    /*This code is added for checking case sensitive duplicates inside array elements*/
     const finalArray = this.uniqLabels
     .reduce((result, element) => {
       const normalize = function(x) { return typeof x === 'string' ? x.toLowerCase() : x; };
       const normalizedElement = normalize(element);
       if (result.every(otherElement => normalize(otherElement) !== normalizedElement)) {
         result.push(element);
       }
       return result;
     }, []);
     console.log(finalArray);
    /*This code is added for checking case sensitive duplicates inside array elements - End here*/

    finalArray.forEach((value, key) => {
      const obj = {
      id: key,
      itemName: value
      };
      if (obj.itemName !== '') {
      this.dropdownList.push(obj);
      }
    });
    } else {
      const obj = {
        id: '',
        itemName: ''
      };
      this.dropdownList.push(obj);
    }
  }


  ngOnInit() {
    this.addCustomAttributeGroup = this.fb.group({
      addCustomAttributeCode: ['', [Validators.required, Validators.maxLength(30)]],
      addCustomAttributeIdentifier: [''],
      addCustomAttributeMandatory: [''],
      addCustomAttributeDesc: ['', [Validators.required, Validators.maxLength(500)]],
      addCustomAttributeDataType : ['', Validators.required],
      addCustomAttributeList : ['', Validators.required],
      addCustomAttributeMultiSelect: [''],
    });
    this.onChanges();
  }
  onChanges(): void {
    this.addCustomAttributeIdentifier.valueChanges.subscribe(val => {
      if (val) {
        this.addCustomAttributeMandatory.setValue(true);
        this.addCustomAttributeMandatory.disable();
      } else {
        this.addCustomAttributeMandatory.enable();
      }
    });
    this.addCustomAttributeCode.valueChanges.subscribe(val => {
      if (val === 'COUNTRY') {
        this.addCustomAttributeCode.setErrors({'invalidCode': true});
      } else if (val !== '') {
        this.addCustomAttributeCode.setErrors(null);
      }
    });
    this.addCustomAttributeDataType.valueChanges.subscribe(val => {

      if (val === 'LISTBOX') {
        this.showList = true;
      } else {
        this.showList = false;
        this.addCustomAttributeList.setValue('');
        this.addCustomAttributeList.setErrors(null);
      }
    });
    this.addCustomAttributeList.valueChanges.subscribe(val => {
      this.prepareListData(val);
    });
    this.addCustomAttributeMultiSelect.valueChanges.subscribe(val => {

      if (val) {
        this.isMultiSelect = true;
      } else {
        this.isMultiSelect = false;
      }
    });
  }

  refineModel(event) {
      // tslint:disable-next-line:max-line-length
      if (event.key === 'Left' || event.key === 'Right' || event.key === 'Del' || event.key === 'Home' || (event.keyCode === 65 && event.ctrlKey) || (event.keyCode === 88 && event.ctrlKey) ) {
        return;
      } else {
        setTimeout(() => {
          this.addCustomAttributeCode.setValue(this.addCustomAttributeCodeNative.nativeElement.value);
        }, 15);
      }
    }

  get addCustomAttributeCode(){ return this.addCustomAttributeGroup.get('addCustomAttributeCode'); }
  get addCustomAttributeIdentifier(){ return this.addCustomAttributeGroup.get('addCustomAttributeIdentifier'); }
  get addCustomAttributeMandatory(){ return this.addCustomAttributeGroup.get('addCustomAttributeMandatory'); }
  get addCustomAttributeDesc(){ return this.addCustomAttributeGroup.get('addCustomAttributeDesc'); }
  get addCustomAttributeDataType(){ return this.addCustomAttributeGroup.get('addCustomAttributeDataType'); }
  get addCustomAttributeList(){ return this.addCustomAttributeGroup.get('addCustomAttributeList'); }
  get addCustomAttributeMultiSelect(){ return this.addCustomAttributeGroup.get('addCustomAttributeMultiSelect'); }
}
