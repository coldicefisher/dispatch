import { Injectable } from "@angular/core";

export interface AddressType {
    display: string,
    value: string
}

export interface Gender {
    display: string,
    value: string
}

export interface PrivacyStatus {
    display: string,
    value: string
}

export interface SeekingStatus {
    display: string,
    value: string
}

export interface LegalStructureType {
    display: string,
    value: string
}

export interface Industry {
  display: string,
  value: string
}

@Injectable({
    providedIn: 'root'
})
export class ApplicationDataService {

    constructor() { }

    public addressTypes: AddressType[] = [
        {
            display: "Mailing",
            value: "Mailing"
        },
        {
            display: "Physical",
            value: "Physical"
        }
    ]

    public legalStructureTypes: LegalStructureType[] = [
        {
            display: "Sole Proprietor",
            value: "Individual"
        },
        {
            display: "Limited Liability Business",
            value: "LLC"
        },
        {
            display: "Corporation",
            value: "Corporation"
        }
    ]
    public genders: Gender[] = [
        {
            display: "Prefer not to say",
            value: ""
        },
        {
            display: "Male",
            value: "Male"
        },
        {
            display: "Female",
            value: "Female"
        },
        {
            display: "Other",
            value: "Other"
        },
    ]
    public privacyStatus: PrivacyStatus[] = [
        {
            display: "Private",
            value: "Private"
        },
        {
            display: "Public",
            value: "Public"
        }
    ]

    public seekingStatus: SeekingStatus[] = [
        {
            display: "Not Looking",
            value: "Not Looking"
        },
        {
            display: "Looking",
            value: "Looking"
        }
    ]

    public industry: Industry[] = [
      {
        display: "Office Management",
        value: "Office Management"
      },
      {
        display: "Professional Services",
        value: "Professional Services"
      },
      {
        display: "Marketing",
        value: "Marketing"
      },
      {
        display: "P&C Insurance",
        value: "P&C Insurance"
      },
      {
        display: "Financial Services",
        value: "Financial Services"
      },
      {
        display: "Software Provider",
        value: "Software Provider"
      },
      {
        display: "Other",
        value: "Other"
      }
    ]
  }   