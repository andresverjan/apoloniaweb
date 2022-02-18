import {
    Component,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    EventEmitter,
    Input,
    Output
} from "@angular/core";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from "@angular/material-moment-adapter";
import * as moment from "moment";
import {APP_DATETIME_FORMATS} from "src/app/modules/core/components/datepicker/format-datepicker";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-datetime",
    templateUrl: "./datetime.component.html",
    styleUrls: ["./datetime.component.scss"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter
        }, {
            provide: MAT_DATE_FORMATS,
            useValue: APP_DATETIME_FORMATS,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatetimeComponent {
    private onChange = (value : any) => {};

    public lForm: FormGroup;
    public myDatePicker;
    
    @Input()  label : any;
    @Input()  dateValue : string = null;
    @Input()  requerido : boolean = false;
    @Input()  datecontrol : FormControl;
    @Input()  datecontrolChange = new EventEmitter<FormControl>();

    @Output() valor = new EventEmitter<string>();

    public tForm: FormGroup = new FormGroup({
        date: new FormControl("", []),
      });

    public tFormControl = new FormControl('');

    public parms : any = {
        disabled: false,
        showSpinners: true,
        showSeconds: false,
        disableMinute: false,
        touchUi: false,
        hideTime: false,
        enableMeridian: false,
        stepHour: 1,
        stepMinute: 1,
        stepSecond: 1,
        color: "Primary"
    };

    constructor(private cdr : ChangeDetectorRef) {}
    ngOnInit(): void {
        console.log("INIT");
    }

    onDateChange(event : any) {
        console.log("onDateChange");        
        this.dateValue = moment(event.value).format();
        this.onChange(event.value);
        console.log(this.dateValue);
        this.valor.emit(this.dateValue);
    }

    changeInput(){
        console.log("entro a changeInput");
    }

    onDateChangeTest(event : any) {
        console.log("onDateChangeTest");        
        console.log(event);
        //this.dateValue = moment(this.dateControl.value).format();
        //console.log(this.dateValue);
        //this.onChange(this.dateControl.value);
        /*this.valor.emit(this.dateValue);
        if(this.requerido == true && this.dateValue!= ''){
            console.log("Son requeridos...");
        }*/
        console.log("will emit algo.");
        //console.log(this.myDatePicker);
        //this.datecontrolChange.emit(this.datecontrol);
    }
}
