import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { EntitygroupService } from '../../../shared/services/entitygroup.service';
import { Params, Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AutoWidthCalculator, GridOptions } from 'ag-grid/main';
import { AgGridCustomComponent } from '../../../shared/components/common/ag-grid-custom/ag-grid-custom.component';
import { NGXLogger } from 'ngx-logger';
// tslint:disable-next-line:max-line-length
import { CustomDateComponent } from '../../../shared/components/common/custom-date-component.component/custom-date-component.component.component';
import { ActionRendererComponent } from '../action-renderer/action-renderer.component';
import { CommonValidators } from '../../../shared/validations/common-validators';
import { PermissionsCodes } from '../../../shared/constants/permission-codes';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { NgxPermissionsService } from 'ngx-permissions';

export interface ViewAssignmentsModel {
  entityRow: any;
  dataCollectionCode: any;
}

@Component({
  selector: 'app-entity-assignments',
  templateUrl: './entity-assignments.component.html',
  styleUrls: ['./entity-assignments.component.css']
})
export class EntityAssignmentsComponent extends DialogComponent<ViewAssignmentsModel, boolean> implements ViewAssignmentsModel, OnInit {
  entityRow: any;
  dataCollectionCode: any;
  defination = true;
  linkactive = 'entityassignments';
  gridOptions: GridOptions;
  columnDefs: any[];
  errors: Array<string> = [];
  validOnModel: any;
  validToModel: any;
  showResults = true;
  zeroResults = false;
  @ViewChild('entityAssignmentForm') public entityAssignmentForm;
  private entriesvalue= 0;
  validOnDateOptions: INgxMyDpOptions;
  validToDateOptions: INgxMyDpOptions;
  onDateChanged(event: IMyDateModel): void {
    this.logger.debug(event);
  }

  constructor(dialogService: DialogService,
              private logger: NGXLogger,
              public router: Router,
              private activatedRoute: ActivatedRoute,
              public translate: TranslateService,
              private entityAssignmentService: EntitygroupService,
              private permissionsService: NgxPermissionsService,
              private permissions: PermissionsService) {
    super(dialogService);
    }
  resetFrom() {
    this.setCurrentDate();
  }
  cleanMessages() {
  // dummy
  }
  setCurrentDate() {
    const todaysDate = new Date();
    // to set to the date format object
    const currentDay = todaysDate.getDate() <= 9 ? '0' + todaysDate.getDate() : todaysDate.getDate();
    // tslint:disable-next-line:max-line-length
    const currentMonth = Number(Number(todaysDate.getMonth()) + 1) <= 9 ? '0' + Number(Number(todaysDate.getMonth()) + 1) : Number(Number(todaysDate.getMonth()) + 1);
    const currentYear = todaysDate.getFullYear();
    // tslint:disable-next-line:max-line-length
    this.validOnModel = { date: { year: todaysDate.getFullYear(), month: Number(Number(todaysDate.getMonth()) + 1), day: todaysDate.getDate() },
                          formatted: currentDay + '/' + currentMonth + '/' + currentYear};
    this.validToModel = { date: { year: todaysDate.getFullYear(), month: Number(Number(todaysDate.getMonth()) + 1), day: todaysDate.getDate() },
                          formatted: currentDay + '/' + currentMonth + '/' + currentYear};
  }
  private getContextMenuItems(): any {
    document.body.click();
  }
  createColumnDefs(translatedVals) {
    this.columnDefs = [
      {headerName: translatedVals.entityAssignments.assignment,
        children: [
          /* {headerName: translatedVals.entityAssignments.entityGroup, field: 'entityGroupName', width: 160, minWidth: 140,
            filter: 'agTextColumnFilter',
            comparator: function (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any){
              return AgGridCustomComponent.caseInsensitiveSort(valueA, valueB, nodeA, nodeB, isInverted);
            }
          }, */
          {
            headerName: translatedVals.entityAssignments.assignmentStart, field: 'entityGroupVFDate',
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
          {
            headerName: translatedVals.entityAssignments.assignmentEnd, field: 'entityGroupVTDate',
            filter: 'agDateColumnFilter', maxWidth: 170, width: 170, minWidth: 170,
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
      {headerName: translatedVals.entityAssignments.reportingEntity,
        children: [
          {headerName: translatedVals.entityAssignments.collectionUId, field: 'repEntityColUnqID',
          filter: 'agTextColumnFilter', width: 160, minWidth: 140,
            comparator: function (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any){
              return AgGridCustomComponent.caseInsensitiveSort(valueA, valueB, nodeA, nodeB, isInverted);
            }
          },
          {headerName: translatedVals.entityAssignments.reportingEntityName, field: 'repEntityName',
          filter: 'agTextColumnFilter', width: 180, minWidth: 140,
            comparator: function (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any){
              return AgGridCustomComponent.caseInsensitiveSort(valueA, valueB, nodeA, nodeB, isInverted);
            }
          },
          {headerName: translatedVals.entityAssignments.reportingCode, field: 'reportingCode',
          filter: 'agTextColumnFilter', width: 180, minWidth: 140,
            comparator: function (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any){
              return AgGridCustomComponent.caseInsensitiveSort(valueA, valueB, nodeA, nodeB, isInverted);
            },
            cellRenderer : function(params) {
              return '<span title="' + params.value + '">' + params.value + '</span>';
            }
          },
          {headerName: translatedVals.entityAssignments.entityType, field: 'repEntityType',
          filter: 'agTextColumnFilter', width: 180, minWidth: 140, hide: true,
            comparator: function (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any){
              return AgGridCustomComponent.caseInsensitiveSort(valueA, valueB, nodeA, nodeB, isInverted);
            }
          },
          {
            headerName: translatedVals.entityAssignments.entityStart, field: 'repEntitySTDate',
            filter: 'agDateColumnFilter', maxWidth: 170, width: 170, minWidth: 170, hide: true,
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
            headerName: translatedVals.entityAssignments.entityEnd, field: 'repEntityENDate',
            filter: 'agDateColumnFilter', maxWidth: 170, width: 170,  minWidth: 170, hide: true,
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
      }
    ];
  }
  onBtExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      skipRow: true,
      columnKeys: ['entityGroupName', 'entityGroupVFDate', 'entityGroupVTDate',
                    'repEntityColUnqID', 'repEntityName', 'reportingCode', 'repEntityType', 'repEntitySTDate', 'repEntityENDate'],
      fileName: 'entityAssignment.csv'
    };
    this.gridOptions.api.exportDataAsCsv(params);
  }
  private redirectErrorPage() {
    this.router.navigate(['/pagenotfound']);
  }
  private redirectUnAuthErrorPage() {
    this.router.navigate(['/notauthorized']);
  }
  onValidOnDateChanged(event: IMyDateModel): void {
    console.log(event);
  }
  onValidToDateChanged(event: IMyDateModel): void {
    console.log(event);
  }
  checkValidOnDate(event) {
    CommonValidators.dateValidator(event.target.value, this.validOn);
    CommonValidators.dateFromToModelComparator(this.validOn, this.validTo);
    if (event.target.value === '') {
      this.validOn.setErrors({'required': true});
    } else if ((String(event.target.value).length === 10 && this.validOn.value === null)
      && !this.validOn.hasError('invalidFormat')) {
      this.validOn.setErrors({'invalidDateFormat': true});
    } else if (this.validOn.value === null) {
      this.validOn.setErrors({ 'invalidFormat': true, 'required': false });
    }
  }
  checkValidToDate(event) {
    CommonValidators.dateValidator(event.target.value, this.validTo);
    CommonValidators.dateFromToModelComparator(this.validOn, this.validTo);
    if (event.target.value === '') {
      this.validTo.setErrors({'required': true});
    } else if ((String(event.target.value).length === 10 && this.validTo.value === null)
      && !this.validTo.hasError('invalidFormat')) {
      this.validTo.setErrors({'invalidDateFormat': true});
    } else if (this.validTo.value === null) {
      this.validTo.setErrors({ 'invalidFormat': true, 'required': false });
    }
  }
  loadAssignments(validOn: string, validTo: string, assignmentStatus) {
    this.entriesvalue = 0;
    this.logger.debug('data collection code in view assignments', this.dataCollectionCode);
    this.entityAssignmentService.viewEntityAssignment(this.entityRow.name, validOn, validTo, this.dataCollectionCode, assignmentStatus).subscribe(
      success => {
        this.logger.debug(success.responseData);
        if (success.responseData !== null && success.responseData !== 'null'
            && success.responseData !== '' && success.responseData.length > 0) {
              this.entriesvalue = success.responseData.length;
              this.gridOptions.api.setRowData(success.responseData);
              this.gridOptions.api.setGroupHeaderHeight(25);
              this.gridOptions.api.sizeColumnsToFit();
              this.gridOptions.api.hideOverlay();
              this.showResults = true;
              this.zeroResults = false;
        }else {
              this.showResults = false;
              this.zeroResults = true;
              this.gridOptions.api.setRowData(null);
              this.gridOptions.api.setGroupHeaderHeight(25);
        }
      },
      error => {
        this.logger.debug('error from response');
        error.push(error.ExceptionMessage);
      });
  }
  searchViewAssignedEntityResults() {
    this.loadAssignments(this.validOnModel.formatted, this.validToModel.formatted, 'ASSIGNED');
  }
  ngOnInit() {
    // language traslations.
    if (this.translate.currentLang) {
      this.translate.getTranslation(this.translate.currentLang).subscribe((data) => {
        this.validOnDateOptions = CommonValidators.setDateOptions(data.calendar);
        this.validToDateOptions = CommonValidators.setDateOptions(data.calendar);
        this.createColumnDefs(data.gridLables);
        this.setCurrentDate();
        this.gridOptions.getContextMenuItems = this.getContextMenuItems.bind(this, data);
        this.gridOptions.onGridReady = () => {
          if (this.gridOptions) {
            this.loadAssignments(this.validOnModel.formatted, this.validToModel.formatted, 'ASSIGNED');
          }
        };
       });
    }
    // Set grid resize events.
    this.gridOptions = AgGridCustomComponent.setGridCommonOptions(this);
    this.setCurrentDate();
    this.gridOptions.onGridReady = () => {
      if (this.gridOptions) {
        this.loadAssignments(this.validOnModel.formatted, this.validToModel.formatted, 'ASSIGNED');
      }
    };
  }
  get validOn() { return this.entityAssignmentForm.form.controls['validOn']; }
  get validTo() { return this.entityAssignmentForm.form.controls['validTo']; }
}

