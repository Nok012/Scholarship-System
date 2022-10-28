import { BankingInterface } from "./IBanking";
import { PaymentstatusInterface } from "./IPaymentstatus";
import { StudentListInterface } from "./IStudentlist";
import { AdminsInterface } from "./IAdmin";

export interface SliplistInterface {
    ID?: number;
    
    Total: number | null;
    Slipdate: Date | null;


    BankingID?: number;
    Banking?: BankingInterface;
    PayID?: number;
    Pay?: PaymentstatusInterface;
    StudentListID?: number;
    StudentList?: StudentListInterface;
    AdminID?: number;
    Admin?: AdminsInterface;
}