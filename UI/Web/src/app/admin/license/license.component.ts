import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import {AccountService} from "../../_services/account.service";
import {ScrobblingService} from "../../_services/scrobbling.service";
import {ToastrService} from "ngx-toastr";
import {ConfirmService} from "../../shared/confirm.service";
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgbTooltip, NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import {environment} from "../../../environments/environment";
import {translate, TranslocoDirective} from "@ngneat/transloco";

@Component({
    selector: 'app-license',
    templateUrl: './license.component.html',
    styleUrls: ['./license.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
  imports: [NgIf, NgbTooltip, LoadingComponent, NgbCollapse, ReactiveFormsModule, TranslocoDirective]
})
export class LicenseComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({});
  isViewMode: boolean = true;

  hasValidLicense: boolean = false;
  hasLicense: boolean = false;
  isChecking: boolean = false;
  isSaving: boolean = false;

  buyLink = environment.buyLink;
  manageLink = environment.manageLink;



  constructor(public accountService: AccountService, private scrobblingService: ScrobblingService,
              private toastr: ToastrService, private readonly cdRef: ChangeDetectorRef,
              private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.formGroup.addControl('licenseKey', new FormControl('', [Validators.required]));
    this.formGroup.addControl('email', new FormControl('', [Validators.required]));
    this.accountService.hasAnyLicense().subscribe(res => {
      this.hasLicense = res;
      this.cdRef.markForCheck();
    });
    this.accountService.hasValidLicense().subscribe(res => {
      this.hasValidLicense = res;
      this.cdRef.markForCheck();
    });
  }


  resetForm() {
    this.formGroup.get('licenseKey')?.setValue('');
    this.formGroup.get('email')?.setValue('');
    this.cdRef.markForCheck();
  }

  saveForm() {
    this.isSaving = true;
    this.cdRef.markForCheck();
    this.accountService.updateUserLicense(this.formGroup.get('licenseKey')!.value.trim(), this.formGroup.get('email')!.value.trim())
      .subscribe(() => {
      this.accountService.hasValidLicense(true).subscribe(isValid => {
        this.hasValidLicense = isValid;
        if (!this.hasValidLicense) {
          this.toastr.info(translate('toasts.k+-license-saved'));
        } else {
          this.toastr.success(translate('toasts.k+-unlocked'));
        }
        this.hasLicense = this.formGroup.get('licenseKey')!.value.length > 0;
        this.resetForm();
        this.isViewMode = true;
        this.isSaving = false;
        this.cdRef.markForCheck();
      });
    }, err => {
        if (err.hasOwnProperty('error')) {
          this.toastr.error(JSON.parse(err['error'])['message']);
        } else {
          this.toastr.error(translate('toasts.k+-error'));
        }
        this.isSaving = false;
        this.cdRef.markForCheck();
    });
  }

  async deleteLicense() {
    if (!await this.confirmService.confirm(translate('toasts.k+-delete-key'))) {
      return;
    }

    this.accountService.deleteLicense().subscribe(() => {
      this.resetForm();
      this.toggleViewMode();
      this.validateLicense();
    });

  }


  toggleViewMode() {
    this.isViewMode = !this.isViewMode;
    this.resetForm();
  }

  validateLicense() {
    this.isChecking = true;
    this.accountService.hasValidLicense(true).subscribe(res => {
      this.hasValidLicense = res;
      this.isChecking = false;
      this.cdRef.markForCheck();
    });
  }
}
