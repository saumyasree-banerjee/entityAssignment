import { EntitygroupService } from '../../../shared/services/entitygroup.service';
import { NGXLogger } from 'ngx-logger';
import { CommonValidators } from '../../../shared/validations/common-validators';
import { AfterViewChecked, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { Observable } from 'rxjs';
import { GridOptions } from 'ag-grid';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgGridCustomComponent } from '../../../shared/components/common/ag-grid-custom/ag-grid-custom.component';
import { CustomDateComponent } from '../../../shared/components/common/custom-date-component.component/custom-date-component.component.component';
import { ActionRendererComponent } from '../action-renderer/action-renderer.component';
import { DateCellRendererComponent } from '../datecell-renderer/datecell-renderer.component';
declare var $: any;

export  interface  EditAssignmentModel  {
  entityRow: any;
  dataCollectionCode: string;
}

@Component({
  selector: 'app-edit-entity-assignment',
  templateUrl: './edit-entity-assignment.component.html',
  styleUrls: ['./edit-entity-assignment.component.css']
})
export  class  EditEntityAssignmentComponent  extends  DialogComponent<EditAssignmentModel, string>  implements  EditAssignmentModel, OnInit  {
  rowData: any;
  gridOptions: GridOptions;
  columnDefs: any[];
  private customList = [];
  private customeAttrChildren = [];
  private exportKeys = [];
  private entriesvalue = 0;
  private agGridId = 'EDITENTITYASSIGHNMENT';
  assigmenthasValidDate = true;
  private currentValidOn: string;
  entityRow: any;
  dataCollectionCode: string;
  serverSideError: any;
  editEntityAssignment: FormGroup;
  validOnDateOptions: INgxMyDpOptions;
    constructor(dialogService: DialogService,
    private logger: NGXLogger,
    private entityGroupService: EntitygroupService,
    private cd: ChangeDetectorRef,
    private assignEdit: FormBuilder,
    private translate: TranslateService)  {
    super(dialogService);
  }
  onDateChanged(event: IMyDateModel): void {
    console.log(event);
  }
  private getContextMenuItems(translations, params): any {
    // Required to close action menu if it was open.
    document.body.click();
    params.context.thisComponent.entityAssignmentStatus = params.node ? params.node.data.assignmentStatus !== 'ASSIGNED' ? false : true : null;
    const result: Array<any> = [];
    if (params.node && params.context.thisComponent.entityAssignmentStatus) {
      result.push({
        name: translations.actions.common.duplicate,
        action: function () { params.context.thisComponent.addDuplicate(params.node.data, params.node.rowIndex); }
      });
    }
    return result;
  }

  generateColumns(data: any[]) {
    this.customeAttrChildren = [];
    this.exportKeys = ['entityGroupVFDate', 'entityGroupVTDate', 'repEntityColUnqID', 'repEntityName', 'reportingCode', 'repEntityType', 'repEntitySTDate', 'repEntityENDate'];
      data.map(object => {
        Object.keys(object).map(key => {
            const mappedColumn = {
              headerName: key.toUpperCase(),
              field: 'customAttributeMap.' + key,
              filter: 'agTextColumnFilter',
              width: 330,
              minWidth: 140,
              comparator: function (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any) {
                return AgGridCustomComponent.caseInsensitiveSort(valueA, valueB, nodeA, nodeB, isInverted);
              }
            };
            this.exportKeys.push('customAttributeMap.' + key);
            this.customeAttrChildren.push(mappedColumn);
          });
      });
  }
  createColumnDefs(translatedVals) {
    this.columnDefs = [
      { headerName: '', headerCheckboxSelection: true, checkboxSelection: true, minWidth: 60, width: 100, suppressFilter: true, menuTabs: [] },
      {
        headerName: translatedVals.entityAssignments.assignment,
        children: [
          {
            headerName: translatedVals.entityAssignments.assignmentStart,
            cellRenderer: 'dateCellRenderer', filter: 'agDateColumnFilter', field: 'entityGroupVFDate', suppressSorting: true, cellStyle: { 'overflow': 'visible !important' },
            maxWidth: 170, width: 170, minWidth: 170,
            comparator: function (date1, date2) {
              return AgGridCustomComponent.dateComparator(date1, date2);
            },
            filterParams: {
              comparator: function (filterLocalDateAtMidnight, cellValue) {
                return AgGridCustomComponent.dateFilterCompare(filterLocalDateAtMidnight, cellValue);
              }
            }
          },
          {
            headerName: translatedVals.entityAssignments.assignmentEnd, field: 'entityGroupVTDate', suppressSorting: true, cellRenderer: 'dateCellRenderer', cellStyle: { 'overflow': 'visible !important' },
            filter: 'agDateColumnFilter', maxWidth: 170, width: 170, minWidth: 170,
            comparator: function (date1, date2) {
              return AgGridCustomComponent.dateComparator(date1, date2);
            },
            filterParams: {
              comparator: function (filterLocalDateAtMidnight, cellValue) {
                return AgGridCustomComponent.dateFilterCompare(filterLocalDateAtMidnight, cellValue);
              }
            }
          },
        ],
      },
      {
        headerName: translatedVals.entityAssignments.reportingEntity,
        children: [
          {
            headerName: translatedVals.entityAssignments.collectionUId, field: 'repEntityColUnqID', filter: 'agTextColumnFilter', width: 330, minWidth: 190,
            comparator: function (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any) {
              return AgGridCustomComponent.caseInsensitiveSort(valueA, valueB, nodeA, nodeB, isInverted);
            }
          },
          {
            headerName: translatedVals.entityAssignments.reportingEntityName, field: 'repEntityName', filter: 'agTextColumnFilter', width: 330, minWidth: 140,
            comparator: function (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any) {
              return AgGridCustomComponent.caseInsensitiveSort(valueA, valueB, nodeA, nodeB, isInverted);
            }
          },
          {
            headerName: translatedVals.entityAssignments.reportingCode, field: 'reportingCode', filter: 'agTextColumnFilter', width: 330, minWidth: 140,
            comparator: function (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any) {
              return AgGridCustomComponent.caseInsensitiveSort(valueA, valueB, nodeA, nodeB, isInverted);
            },
            cellRenderer : function(params) {
              return '<span title="' + params.value + '">' + params.value + '</span>';
            }
          },
          {
            headerName: translatedVals.entityAssignments.entityType, field: 'repEntityType', filter: 'agTextColumnFilter', width: 170, minWidth: 140, hide: true,
            comparator: function (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any) {
              return AgGridCustomComponent.caseInsensitiveSort(valueA, valueB, nodeA, nodeB, isInverted);
            }
          },
          {
            headerName: translatedVals.entityAssignments.entityStart, field: 'repEntitySTDate', filter: 'agDateColumnFilter', maxWidth: 170, width: 170, minWidth: 170, hide: true,
            comparator: function (date1, date2) {
              return AgGridCustomComponent.dateComparator(date1, date2);
            },
            filterParams: {
              comparator: function (filterLocalDateAtMidnight, cellValue) {
                return AgGridCustomComponent.dateFilterCompare(filterLocalDateAtMidnight, cellValue);
              }
            }
          },
          {
            headerName: translatedVals.entityAssignments.entityEnd, field: 'repEntityENDate', filter: 'agDateColumnFilter', maxWidth: 170, width: 170, minWidth: 170, hide: true,
            comparator: function (date1, date2) {
              return AgGridCustomComponent.dateComparator(date1, date2);
            },
            filterParams: {
              comparator: function (filterLocalDateAtMidnight, cellValue) {
                return AgGridCustomComponent.dateFilterCompare(filterLocalDateAtMidnight, cellValue);
              }
            }
          }
        ]
      },
      {
        headerName: translatedVals.entityAssignments.customAttribute,
        children: this.customeAttrChildren
      },
      // tslint:disable-next-line:max-line-length
      {
        headerName: translatedVals.common.actions, field: '', suppressFilter: true, suppressSorting: true, menuTabs: [], cellStyle: { 'overflow': 'visible !important' }, maxWidth: 100, width: 100, minWidth: 100,
        cellRenderer: 'actionRenderer'
      }
    ];
  }
  onBtnExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      skipRow: true,
      columnKeys: this.exportKeys,
      fileName: 'EditAssignedEntities.csv'
    };
    this.gridOptions.api.exportDataAsCsv(params);
  }

  loadAssignments(validOn: string, assignmentStatus) {
    this.editEntityAssignment.setErrors({ 'errorResponse': true });
    this.currentValidOn = validOn;
    this.entityGroupService.viewonEditEntityAssignment(this.entityRow.name, validOn, this.dataCollectionCode, assignmentStatus).subscribe(
      success => {
        if (success.responseData !== null && success.responseData !== 'null'
          && success.responseData !== '' && success.responseData.length > 0) {
          this.entriesvalue = success.responseData.length;
          this.customList = [];
          if (success.responseData[0].customAttributeMap !== null && success.responseData[0].customAttributeMap !== 'null'
          && success.responseData[0].customAttributeMap !== '') {
            this.customList.push(success.responseData[0].customAttributeMap);
            this.generateColumns(this.customList);
          }else {
            this.generateColumns([]);
          }
          if (this.translate.currentLang) {
            this.translate.getTranslation(this.translate.currentLang).subscribe((data) => {
              this.createColumnDefs(data.gridLables);
              this.gridOptions.getContextMenuItems = this.getContextMenuItems.bind(this, data);
            });
          }
          this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.createColumnDefs(event.translations.gridLables);
            this.gridOptions.getContextMenuItems = this.getContextMenuItems.bind(this, event.translations);
          });
          this.rowData = success.responseData;
          this.gridOptions.api.setRowData(success.responseData);
          this.gridOptions.api.setGroupHeaderHeight(25);
          this.editEntityAssignment.setErrors({ 'errorResponse': true });
          this.gridOptions.api.forEachNode((node) => {
            if (node.data.assignmentStatus === 'ASSIGNED') {
              node.setSelected(true);
              this.editEntityAssignment.setErrors({ 'errorResponse': true });
            }
          });
        } else {
          this.gridOptions.api.hideOverlay();
          this.gridOptions.api.setRowData([]);
          this.entriesvalue = 0;
          this.gridOptions.api.setGroupHeaderHeight(25);
        }
      },
      error => {
        this.logger.debug('error from response');
        error.push(error.ExceptionMessage);
      },
      () => {
        console.log('completed');
      });
  }
  ngOnInit() {
    console.log('current date::', CommonValidators.setDateObject());
    this.validOnDateOptions = {
      dateFormat: 'dd/mm/yyyy',
      showTodayBtn: false,
      todayBtnTxt: new Date().toString(),
      showSelectorArrow: false,
      dayLabels: { su: 'S', mo: 'M', tu: 'T', we: 'W', th: 'Th', fr: 'F', sa: 'S' }
    };
    this.editEntityAssignment = this.assignEdit.group({
      editEntityAssignmentDateFrom: [CommonValidators.setDateObject() , [Validators.required]],
      assignmentStatus: ['', ]
    });
    if (this.translate.currentLang) {
      this.translate.getTranslation(this.translate.currentLang).subscribe((data) => {
        this.validOnDateOptions = CommonValidators.setDateOptions(data.calendar);
        this.assignmentStatus.setValue('ALL');
        this.loadAssignments(this.editEntityAssignmentDateFrom.value ? this.editEntityAssignmentDateFrom.value.formatted : '', 'ALL');
      });
    }
    // Set grid resize events.
    this.setGrid();
  }
  setGrid() {
    this.gridOptions = AgGridCustomComponent.setGridCommonOptions(this);
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.suppressRowClickSelection = true;
    this.gridOptions.rowHeight = 60;
    this.gridOptions.suppressCellSelection = false;
    this.gridOptions.onGridReady = () => {
      this.gridOptions.api.setRowData([]);
    };
    this.gridOptions.onRowSelected = (event) => {
      if (event.node.isSelected()) {
        event.node.data.assignmentStatus = 'ASSIGNED';
        if (event.node.data.entityGroupVFDate === null) {
          event.node.data.entityGroupVFDate = (CommonValidators.setDateObject() as Object)['formatted'];
        }
      }else {
        event.node.data.assignmentStatus = 'UNASSIGNED';
        event.node.data.entityGroupVFDate = null;
        event.node.data.entityGroupVTDate = null;
      }
        this.gridOptions.api.redrawRows({ rowNodes: [event.node] });
        console.log('assigmenthasValidDate::', this.assigmenthasValidDate);
        if (this.assigmenthasValidDate) {
          this.editEntityAssignment.markAsDirty();
          this.editEntityAssignment.setErrors(null);
        } else {
          this.editEntityAssignment.setErrors({'errorResponse': true});
        }
    };
  }
  addDuplicate(item, i) {
    const newObj = Object.assign({}, item);
    newObj.enityGroupEntityId = null;
    newObj.duplicateRow = 'Y';
    this.gridOptions.api.updateRowData({
      add: [newObj],
      addIndex: i + 1
    });
    this.gridOptions.api.forEachNode((node) => {
      if (node.data.assignmentStatus === 'ASSIGNED') {
        node.setSelected(true);
      }
    });
    this.editEntityAssignment.setErrors(null);
  }
  trackByIndex(index: number, value: number) {
    return index;
  }

  populateAssignments() {
    this.serverSideError = null;
    this.currentValidOn = this.editEntityAssignmentDateFrom.value ? this.editEntityAssignmentDateFrom.value.formatted : '';
    this.loadAssignments(this.currentValidOn, this.assignmentStatus.value);
  }
  resetFrom() {
    this.editEntityAssignmentDateFrom.setValue(CommonValidators.setDateObject());
    this.assignmentStatus.setValue('ALL');
    this.serverSideError = null;
  }
  checkMandatoryField(event) {
    CommonValidators.dateValidator(event.target.value, this.editEntityAssignmentDateFrom);
    if (event.target.value === '') {
      this.editEntityAssignmentDateFrom.setErrors({ 'required': true });
    } else if ((String(event.target.value).length === 10 && this.editEntityAssignmentDateFrom.value === null) && !this.editEntityAssignmentDateFrom.hasError('invalidFormat')) {
      this.editEntityAssignmentDateFrom.setErrors({ 'invalidDateFormat': true });
    } else if (this.editEntityAssignmentDateFrom.value === null) {
      this.editEntityAssignmentDateFrom.setErrors({ 'invalidFormat': true, 'required': false });
    }
  }
  saveEditAssignments()  {
    const finalRowData = [];
    this.gridOptions.api.forEachNode(function (node) {
      if (node.data.duplicateRow === 'Y' && node.data.assignmentStatus === 'UNASSIGNED') {
        node.data.entityGroupVFDate = null;
        node.data.entityGroupVTDate = null;
      }
      if (node.data.entityGroupVTDate === '') {
        node.data.entityGroupVTDate = null;
      }
      if (node.data.duplicateRow === 'Y' && node.data.entityGroupVFDate === null && node.data.assignmentStatus === 'ASSIGNED') {
        node.data.entityGroupVFDate = (CommonValidators.setDateObject() as Object)['formatted'];
      }
      finalRowData.push(node.data);
    });
    const postEntity = {
      'entityGroupName': this.entityRow.name,
      'dataCollectionCode': this.dataCollectionCode,
      'validOn': this.currentValidOn,
      'assignmentStatus': this.assignmentStatus.value,
      'entityVersion': this.entityRow.entityVersion,
      'entityGroupEntityDTOList': finalRowData
    };
    this.logger.debug('Edit assignment Post Request: ', postEntity);
    this.entityGroupService.editEntityAssignment(postEntity).subscribe(
      entry => this.handleSubmitSuccess(entry),
      error => this.handleSubmitError(error)
    );
  }
  protected handleSubmitError(error: any) {
    console.log('handleSubmitError', error);
    if (error.errorList.length > 0) {
      this.serverSideError = error.errorList;
      this.editEntityAssignment.setErrors({ 'errorResponse': true });
      $('#model-body').scrollTop(0);
    } else {
      this.result  = this.createJsonResp(error);
      this.close();
    }
  }
  protected handleSubmitSuccess(data: any) {
    if (data.errorList.length > 0) {
      this.serverSideError = data.errorList;
      this.logger.debug('this.serverSideError: ', this.serverSideError);
      this.editEntityAssignment.setErrors({ 'errorResponse': true });
      $('#model-body').scrollTop(0);
    } else {
      this.result  = this.createJsonResp(data);
      this.close();
    }
  }
  private createJsonResp(data) {
    const jsonstring = JSON.stringify({
      result: 'success',
      entityGroupId: this.entityRow.entityGroupId
    });
    return jsonstring;
  }
  get assignmentStatus() { return this.editEntityAssignment.get('assignmentStatus'); }
  get editEntityAssignmentDateFrom() { return this.editEntityAssignment.get('editEntityAssignmentDateFrom'); }

  cleanMessages() {

  }
}
