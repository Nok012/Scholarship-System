import { StudentInterface } from "./IStudent";
import { ReasonInterface } from "./IReason";
import { ScholarshipInterface } from "./IScholarship";

export interface ReportInterface {

  ID?: number;
  ReasonInfo: string | null;

  ScholarshipID?: number;
  Scholarship?: ScholarshipInterface;
  ReasonID?: number;
  Reason?: ReasonInterface;
  StudentID?: number;
  Student?: StudentInterface;

}