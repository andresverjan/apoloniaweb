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
import { FormControl } from "@angular/forms";

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
    @Input() dateControl = new FormControl('');
    @Input()label : any;
    @Input()dateValue : string = null;
    @Input()requerido : boolean = false;
    @Input()minDate  = new Date();
    @Input() date:  any;
    @Output()valor = new EventEmitter<string>();

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
    ngOnInit(): void {}
    onDateChange(event : any) {    
        this.dateValue = moment(event.value).format("YYYY-MM-DD hh:mm A");
        this.onChange(event.value);
        this.valor.emit(this.dateValue);
        console.log('DATE VALUE DESPUES ' + this.dateValue);
        console.log('VALOR ' + this.valor);
        console.log(this.dateControl.value);
    }

    changeInput(){
        console.log("entro a changeInput");
    }

    // onDateChange2(event){
    //     console.log("EVENTO CONTROL: "+ event)
    //     this.dateControl = moment(event.value).format("YYYY-MM-DD hh:mm A");
    //     this.onChange(event.value);
    //     this.valor.emit(this.dateControl);
    //     console.log("DATE CONTROL: "+ this.dateControl);

    // }

    onDateChangeTest(event : any) {   
        this.dateValue = moment(event.value).format();
        this.onChange(event.value);
        this.valor.emit(this.dateValue);
        if(this.requerido == true && this.dateValue != ''){
            console.log("Son requeridos...");
        }
    }

    cambioFecha(val){
        console.log("ENTROO");
        this.date = this.dateValue;
        console.log(this.date);
    }

    cambioFecha2(val){
        console.log("ENTROO");
        console.log("DATE CONTROL " + this.dateControl.value)
        this.date = moment(this.dateControl.value).format("YYYY-MM-DD hh:mm A");
        
        this.valor.emit(this.date);
        console.log("valor:");
        console.log(this.valor);
        console.log("date");
        console.log(this.date);
    }
}
