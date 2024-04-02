export class Contacts {
    constructor(
        public ContactID: number,
        public LeadID: number,
        public LeadFor: string,
        public LeadSource: string,
        public LeadPriority: string,
        public FirstName: string,
        public LastName: string,
        public MobileNo: number,
        public Email: string,
        public Address: string
    ) {

    }

}