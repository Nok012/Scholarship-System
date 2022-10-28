
import { AdminsInterface } from "./IAdmin";
import { ScholarStatusesInterface } from "./IScholarStatus";
import { ScholarTypesInterface } from "./IScholarType";

export interface ScholarshipInterface {
    ID?: number;
    
    ScholarName: string | null;
    ScholarDetail: string | null;

    
    AdminID?: number;
    Admin?: AdminsInterface;
    ScholarStatusID?: number;
    ScholarStatus?: ScholarStatusesInterface;
    ScholarTypeID?: number;
    ScholarType?: ScholarTypesInterface;
    
  }