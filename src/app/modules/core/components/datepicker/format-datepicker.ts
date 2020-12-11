import { NativeDateAdapter } from '@angular/material/core';
import { MatDateFormats } from '@angular/material/core';

export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      let year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return date.toDateString();
  }
}

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY', //whichever format you are tyring, define here
  },
  display: {
    dateInput: 'DD/MM/YYYY', //change accordingly, to display
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

export const APP_DATETIME_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY, HH:mm', //whichever format you are tyring, define here
  },
  display: {
    dateInput: 'DD/MM/YYYY, HH:mm', //change accordingly, to display
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};


