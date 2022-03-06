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
    cambioFecha(){
        this.date = moment(this.dateControl.value).format("YYYY-MM-DD hh:mm A");
        this.dateControl.setValue(moment(this.dateControl.value).format("YYYY-MM-DD hh:mm A")) 
        this.valor.emit(this.date);
    }
}
