import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, UserService } from '../../../_services';
// import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../config/config';
declare var $: any;



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  enableSubmitStatus = false;

  id:String;
    userManagementeditForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    showLoaderImg = false;
    username: string;
    mobileNo: string;
    firstName: string;
    lastName: string;
    company: string;
    businessPhone: string;
    role: string;
    email: string;
    address: string;
    submitRes: any;

    userData: any;

    roleListData: any;
    companyListData: any;
    roleListRes: any;
    companyListRes: any;
    userRole: any;
    companyName: any;
    // clicked = false;
    profileImage:String;
    // enableSubmitStatus: boolean;
    fileRes:any;
    company_background_sheet: any;
    base64textString:String;
    imageURL:String;
    // Private
    private _unsubscribeAll: Subject<any>;
    /**
         * Constructor
         *
         
         * @param {FuseSidebarService} _fuseSidebarService
         
         */
    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService) {
        // Configure the layout
        this.showLoaderImg = false;
        // this.enableSubmitStatus = true;
        this.roleListData = [];
        this.companyListData = [];

        let userToken = localStorage.getItem('userToken')
        if (userToken == undefined) {
            this.router.navigate(['/']);
            
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.userData = JSON.parse(localStorage.getItem('userData'));
        // localStorage.setItem('profileImg',this.imageURL);
        this.userRole = this.userData.userRoleId;
        console.log(this.userData);

        
        this.companyName = this.userData.companyId;
        this.userManagementeditForm = this._formBuilder.group({
            // profileimage: [this.userData.image,''],
            username: [this.userData.username,[ Validators.required, Validators.pattern("[A-Za-z0-9_.&()]+")]],
            // mobileNo: [this.userData.mobileNo, Validators.required],
            mobileNo: [this.userData.mobileNo, [ Validators.required, Validators.pattern("[A-Za-z0-9_.&()]+")]],
            firstName: [this.userData.firstName,[ Validators.required, Validators.pattern("[A-Za-z0-9_.&()][ a-zA-Z0-9_.&()]+")]],
            lastName: [this.userData.lastName, [Validators.required,Validators.pattern("[A-Za-z0-9_.&()][ a-zA-Z0-9_.&()]+")]],
            // enterlocation: [this.userData.enterlocation,[ Validators.required, Validators.pattern("[A-Za-z0-9][ a-zA-Z0-9]+")]],
            userRoleId: [this.userData.userRoleId,[ Validators.required, Validators.pattern("[A-Za-z0-9_.&()]+")]],
            email: [this.userData.email, [ Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+.[a-zA-Z]{2,4}$")]],
            whatsappId: [this.userData.whatsappId,[Validators.pattern("[0-9]{6,14}") ]],
            skypeid: [this.userData.skypeId,[Validators.pattern("[a-zA-Z0-9_.&():@]+")]],
            address: [this.userData.address,[ Validators.required, Validators.pattern("[A-Za-z0-9][ a-zA-Z0-9]+")]],
           
        });
        this.id = this.userData.id;
        this.imageURL =  this.userData.image;
        console.log(this.userManagementeditForm);
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/dashboards/analytics]';
        this.roleList();
        this.companyList();
        this.checkValue();
        localStorage.setItem('countryCodeInfo','+91');

    }


    onFileSelect2(value) {
        if (value.target.files.length > 0) {
            const file = value.target.files[0];
            // this.vessal_history_sheet = file;
            this.fileUpload(file, 'first')
        }
    }
    fileUpload(file, num) {
        if(file.type == "image/jpeg" || file.type == "image/png"){
        try {
            console.log(file);

            const formData = new FormData();
            formData.append('file', file);
            this._userService.addprofile(this.id,formData)
                .pipe(first())
                .subscribe((res) => {
                    this.fileRes = res;

                    
                    if (this.fileRes.success === true) {
                        if (num === 'first') {
                            this.imageURL = this.fileRes.fileurl;
                            console.log('first', this.imageURL);
                    
                        } 
                    }
                },
                    err => {
                        this.alertService.error(err, 'Error');
                        console.log(err);
                    });

        } catch (err) {
            console.log(err);
        }
    }
        else{
            this.alertService.error('please Select only JPEG,JPG or Png image','Error');

        }

    }
    checkValue() {

        if ($('#phone').length) {
            var input = document.querySelector("#phone");
            var iti = (<any>window).intlTelInput(input, {
                preferredCountries: ['in', 'us'],

                separateDialCode: true,
                placeholderNumberType: "MOBILE",

            });
            console.log(input);
            input.addEventListener("countrychange", function () {
                var countryData = iti.getSelectedCountryData();
                 localStorage.setItem('countryCodeInfo','+' + countryData.dialCode);
            });
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {

    }
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    get f() { return this.userManagementeditForm.controls; }


    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    changeImage(evt){

        
            var files = evt.target.files;
            var file = files[0];
          
          if (files && file) {
              var reader = new FileReader();
      
              reader.onload =this._handleReaderLoaded.bind(this);
      
              reader.readAsBinaryString(file);
          }
        }
        
        _handleReaderLoaded(readerEvt) {
           var binaryString = readerEvt.target.result;
                  this.base64textString= btoa(binaryString);
                  console.log(btoa(binaryString));
          

    }

    onSubmit() {
        console.log("fsf");
        this.showLoaderImg = true;
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();
console.log(this.userManagementeditForm);

        // stop here if form is invalid
        if (this.userManagementeditForm.invalid) {
            console.log("if");
            // this.clicked = true;
            // this.enableSubmitStatus = true;
            return;
        } else {
            console.log("add");
            const reqData = {
                "id": this.userData.id,
                "username": this.f.username.value,
                "mobileNo": this.f.mobileNo.value,
                "firstName": this.f.firstName.value,
                "lastName": this.f.lastName.value,
                "whatsappId": this.f.whatsappId.value,
                "skypeId": this.f.skypeid.value,
                "image": this.imageURL,
                "companyId": this.companyName,
                "userRoleId": this.userRole,
                "email": this.f.email.value,
                "address": this.f.address.value,
            }
            localStorage.setItem('userData', JSON.stringify(reqData));
            localStorage.setItem('profileImg',JSON.stringify(this.imageURL));
            console.log(reqData);
            this.loading = true;
            this._userService.updateUserManagement(reqData)
                .pipe(first())
                .subscribe(
                    data => {
                        this.showLoaderImg = false;
                        this.submitRes = data;
                        // this.router.navigate([this.returnUrl]);

                        if (this.submitRes.success === true) {
                            this.alertService.success(this.submitRes.message, 'Success');
                            // console.log(this.router.navigate([this.returnUrl]));
                            window.location.replace('/apps/dashboards/analytics');
                            // this.router.navigate(['/apps/dashboards/analytics']);
                            // this.enableSubmitStatus = false;
                            // this.clicked = false;
                            
                        } else {
                            this.alertService.error(this.submitRes.message, 'Error');
                        }
                        console.log(data);
                    },
                    error => {
                        console.log(error.message);
                        this.alertService.error(error.message, 'Error');
                        this.loading = false;
                    });
        }


    }


    //companylist
    companyList(): void {
        try {
            this.http.get(`${config.baseUrl}/companylist`, {}).subscribe(
                res => {
                    // console.log(res);
                    this.companyListRes = res;
                    if (this.companyListRes.success) {
                        this.companyListData = this.companyListRes.data;
                    }
                },
                err => {
                    console.log(err);
                });

        } catch (err) {
            console.log(err);
        }
    }
    changecompany(event): void {
        this.companyName = event.target.value;
        console.log(this.companyName);
    }

    // Role List
    roleList(): void {
        try {
            this.http.post(`${config.baseUrl}/userroleread`, {}, {}).subscribe(
                res => {
                    // console.log(res);
                    this.roleListRes = res;
                    if (this.roleListRes.success) {
                        this.roleListData = this.roleListRes.data;
                    }
                },
                err => {
                    console.log(err);
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

    changeRole(event): void {
        this.userRole = event.target.value;
    }

    // enableSubmit(value) {
    //     if (value !== this.roleNameForUpdate) {
    //         this.enableSubmitStatus = false;
    //     } else {
    //         this.enableSubmitStatus = true;
    //     }
    // }


}