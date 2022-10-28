import { YearsInterface } from "./IYear";
import { FacultiesInterface } from "./IFaculty";
import { AdviorsInterface } from "./IAdvisor";
import { UsersInterface } from "./IUser";

export interface StudentInterface {

    ID?: number;
    Personalid: string | null;
	Name:       string | null;
	Phon:       string | null;
	Gpax:       number | null;
	Money:      number | null;

    YearID?: number;
    Year?: YearsInterface;
    FacultyID?: number;
    Faculty?: FacultiesInterface;
    AdvisorID?: number;
    Advisor?: AdviorsInterface;
    UserID?: number;
    User?: UsersInterface;
}
