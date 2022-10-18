import { Injectable } from '@angular/core';

export interface State {
  name: string,
  flag: string,
  abbreviation: string
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor() { }

  public states: State[] = [
    {
      name: 'Alabama',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Alabama.svg',
      abbreviation: "AL"
    },
    {
      name: 'Alaska',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Alaska.svg',
      abbreviation: "AK"
    },
    {
      name: 'Arizona',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arizona.svg',
      abbreviation: "AZ"
    },
    {
      name: 'Arkansas',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg',
      abbreviation: "AR"
    },
    {
      name: 'California',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg',
      abbreviation: "CA"
    },
    {
      name: 'Colorado',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Flag_of_Colorado.svg',
      abbreviation: "CO"
    },
    {
      name: 'Connecticut',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Flag_of_Connecticut.svg',
      abbreviation: "CT"
    },
    {
      name: 'Delaware',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Flag_of_Delaware.svg',
      abbreviation: "DE"
    },
    {
      name: 'District of Columbia',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_the_District_of_Columbia.svg',
      abbreviation: "DC"
    },
    {
      name: 'Florida',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
      abbreviation: "FL"
    },
    {
      name: 'Georgia',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Georgia_%28U.S._state%29.svg',
      abbreviation: "GA"
    },
    {
      name: 'Hawaii',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Hawaii.svg',
      abbreviation: "HI"
    },
    {
      name: 'Idaho',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_Idaho.svg',
      abbreviation: "ID"
    },
    {
      name: 'Illinois',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Illinois.svg',
      abbreviation: "IL"
    },
    {
      name: 'Indiana',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Indiana.svg',
      abbreviation: "IN"
    },
    {
      name: 'Iowa',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Iowa.svg',
      abbreviation: "IA"
    },
    {
      name: 'Kansas',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_Kansas.svg',
      abbreviation: "KS"
    },
    {
      name: 'Kentucky',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Flag_of_Kentucky.svg',
      abbreviation: "KY"
    },
    {
      name: 'Indiana',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Indiana.svg',
      abbreviation: "IN"
    },
    {
      name: 'Louisiana',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Flag_of_Louisiana.svg',
      abbreviation: "LA"
    },
    {
      name: 'Maine',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/archive/3/35/20190525024643%21Flag_of_Maine.svg',
      abbreviation: "ME"
    },
    {
      name: 'Maryland',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Maryland.svg',
      abbreviation: "MD"
    },
    {
      name: 'Massachusetts',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Massachusetts.svg',
      abbreviation: "MA"
    },
    {
      name: 'Michigan',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Flag_of_Michigan.svg',
      abbreviation: "MI"
    },
    {
      name: 'Minnesota',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Minnesota.svg',
      abbreviation: "MN"
    },
    {
      name: 'Mississippi',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Mississippi.svg',
      abbreviation: "MS"
    },
    {
      name: 'Missouri',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Missouri.svg',
      abbreviation: "MO"
    },
    {
      name: 'Montana',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_Montana.svg',
      abbreviation: "MT"
    },

    {
      name: 'Nebraska',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Flag_of_Nebraska.svg',
      abbreviation: "NE"
    },

    {
      name: 'Nevada',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Flag_of_Nevada.svg',
      abbreviation: "NV"
    },

    {
      name: 'New Hampshire',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Flag_of_New_Hampshire.svg',
      abbreviation: "NH"
    },

    {
      name: 'New Jersey',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_New_Jersey.svg',
      abbreviation: "NJ"
    },

    {
      name: 'New Mexico',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_New_Mexico.svg/320px-Flag_of_New_Mexico.svg.png',
      abbreviation: "NM"
    },

    {
      name: 'New York',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_New_York.svg',
      abbreviation: "NY"
    },

    {
      name: 'North Carolina',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Flag_of_North_Carolina.svg/320px-Flag_of_North_Carolina.svg.png',
      abbreviation: "NC"
    },

    {
      name: 'North Dakota',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Flag_of_North_Dakota.svg',
      abbreviation: "ND"
    },

    {
      name: 'Ohio',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Ohio.svg',
      abbreviation: "OH"
    },

    {
      name: 'Oklahoma',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Flag_of_Oklahoma.svg',
      abbreviation: "OK"
    },

    {
      name: 'Oregon',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Flag_of_Oregon_%28reverse%29.svg',
      abbreviation: "OR"
    },

    {
      name: 'Pennsylvania',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Pennsylvania.svg',
      abbreviation: "PA"
    },

    {
      name: 'South Carolina',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_South_Carolina.svg',
      abbreviation: "SC"
    },

    {
      name: 'South Dakota',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_South_Dakota.svg',
      abbreviation: "SD"
    },

    {
      name: 'Tennessee',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Tennessee.svg',
      abbreviation: "TN"
    },

    {
      name: 'Texas',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg',
      abbreviation: "TX"
    },
    
    {
      name: 'Utah',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Flag_of_the_State_of_Utah.svg',
      abbreviation: "UT"
    },
    
    {
      name: 'Vermont',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Vermont.svg',
      abbreviation: "VT"
    },
    
    {
      name: 'Virginia',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Flag_of_Virginia.svg',
      abbreviation: "VA"
    },
    
    {
      name: 'Washington',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Washington.svg',
      abbreviation: "WA"
    },
    
    {
      name: 'West Virginia',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_West_Virginia.svg',
      abbreviation: "WV"
    },
    
    {
      name: 'Wisconsin',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Wisconsin.svg',
      abbreviation: "WI"
    },
    
    {
      name: 'Wyoming',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Wyoming.svg',
      abbreviation: "WY"
    },
    
    
  ]
}
