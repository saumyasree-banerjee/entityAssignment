import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-action-renderer',
  templateUrl: './action-renderer.component.html',
  styleUrls: ['./action-renderer.component.css']
})
export class ActionRendererComponent  {
    public params: any;
    public agGridId: string;
    public deleteSelectedRow: boolean;
    public editSelectedRow: any;
    public enableAddNewVersion: any;
    public downloadSelectedRow: any;
    public uploadSelectedRow: any;
    public dataCollectionListPermissions: any;
    public entityAssignmentStatus: any;
    // user assignment
    public isAssign: boolean;
    public isUnassign: boolean;
    agInit(params: any): void {
        this.params = params;
        if (params && params.node && params.node.data) {
            this.agGridId = this.params.context.thisComponent.agGridId;
            // this permissions applicable only for data collection list for collections and submisions page.
            if (this.agGridId === 'SUBMISSIONS' || this.agGridId === 'DATACOLLECTIONS') {
                this.dataCollectionListPermissions = params.node.data.permissions;
            }
            this.enableAddNewVersion = params.node ? params.node.data.latest === 1 ? true : false : null;
            this.deleteSelectedRow = params.node ? params.node.data.canDelete === 'Y' ? false : true : null;
            this.isAssign = params.node ? (params.node.data.action === 'A' || params.node.data.action === 'AU') ? false : true : null;
            this.isUnassign = params.node ? (params.node.data.action === 'U' || params.node.data.action === 'AU') ? false : true : null;
            if (this.agGridId === 'CUSTOMENTITY') {
                this.editSelectedRow = params.node ? params.node.data.attrCode !== 'COUNTRY' ? false : true : null;
            }
            if (this.agGridId === 'SUBMISSIONSLIST') {
                this.downloadSelectedRow = params.node ? params.node.data.fileUploadPath !== null ? false : true : null;
            }
            if (this.agGridId === 'VIEWMODULES') {
                this.uploadSelectedRow = params.node ? params.node.data.definitionStatus === 'RED' ? false : true : null;
            }
        }
        if (this.agGridId === 'EDITENTITYASSIGHNMENT') {
            this.entityAssignmentStatus = params.node ? params.node.data.assignmentStatus !== 'ASSIGNED' ? false : true : null;
        }
    }
    public invokeEditMethod() {
        this.params.context.thisComponent.editScreen(this.params.node.data);
    }
    public invokeViewMethod() {
        this.params.context.thisComponent.viewScreen(this.params.node.data);
    }
    public invokeDeleteMethod() {
        this.params.context.thisComponent.deleteScreen(this.params.node.data);
    }
    public invokeAddNewVersion() {
        this.params.context.thisComponent.addnewversion(this.params.node.data);
    }
    public invokeUploadExcel() {
        this.params.context.thisComponent.uploadtemplate(this.params.node.data);
    }
    public invokeViewAssignments() {
        this.params.context.thisComponent.viewAssignmentsScreen(this.params.node.data);
    }
    public invokeEditAssignments() {
        this.params.context.thisComponent.editAssignmentsScreen(this.params.node.data);
    }
    public invokeDownloadMethod() {
        this.params.context.thisComponent.downloadFile(this.params.node.data);
    }
    public invokeviewSubmissionList() {
        this.params.context.thisComponent.viewSubmissionListScreen(this.params.node.data);
    }
    public invokevviewFileVault() {
        this.params.context.thisComponent.viewFileVaultScreen(this.params.node.data);
    }
    public invokeValidationResluts() {
        this.params.context.thisComponent.ShowValidationResluts(this.params.node.data);
    }
    // User Assignment module
    public invokeAssignMethod() {
        this.params.context.thisComponent.addUserAssignmentScreen(this.params.node.data);
    }
    public invokeUnassignMethod() {
        this.params.context.thisComponent.removeUserAssignmentScreen(this.params.node.data);
    }
    public invokeAddDupMethod() {
        this.params.context.thisComponent.addDuplicate(this.params.node.data, this.params.node.rowIndex);
    }
    refresh(): boolean {
        return false;
    }
    @HostListener('click') onCick() {
        document.body.click();
    }
}
