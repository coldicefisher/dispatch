import { Injectable } from "@angular/core";


export interface user {
  firstName: string,
  lastName: string,
  fullName: string,
  username: string
}

export class ApplicationDataService {

  constructor() { }

  public users: user[] = [
  ]
}

