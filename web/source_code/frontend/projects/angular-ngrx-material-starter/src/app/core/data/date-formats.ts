import { Component } from '@angular/core';

import { MAT_DATE_FORMATS } from '@angular/material/core';

   

export const MY_DATE_FORMATS = {

    parse: {

      dateInput: 'DD/MM/YYYY',

    },

    display: {

      dateInput: 'DD/MM/YYYY',

      monthYearLabel: 'MMMM YYYY',

      dateA11yLabel: 'LL',

      monthYearA11yLabel: 'MMMM YYYY'

    },

};
