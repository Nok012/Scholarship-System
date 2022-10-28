package entity

import (
	"time"

	"gorm.io/gorm"
)

type Admin struct {
	gorm.Model
	Name      string
	Email     string     `gorm:"uniqueIndex"`
	Password  string     `json:"-"`

	SlipLists 	 []SlipList `gorm:"foreignKey:AdminID"`
	StudentLists []StudentList `gorm:"foreignKey:AdminID"`
	Scholarships []Scholarship `gorm:"foreignKey:AdminID"`
	Donators 	 []Donator `gorm:"foreignKey:AdminID"`

}

//ระบบธุรกรรมการเงินทุนการศึกษา---------------------------------------------------------------
type Banking struct {
	gorm.Model
	
	Name      string
	Commerce  string
	Branch    string

	SlipLists []SlipList `gorm:"foreignKey:BankingID"`
}
type PaymentStatus struct {
	gorm.Model

	Name      string
	
	SlipLists []SlipList `gorm:"foreignKey:PayID"`
}

type SlipList struct {
	gorm.Model

	Total    float64
	Slipdate time.Time

	AdminID *uint
	Admin   Admin

	BankingID *uint
	Banking   Banking

	PayID *uint
	Pay   PaymentStatus

	StudentListID *uint
	StudentList   StudentList
}

//ระบบคัดเลือกนักศึกษา---------------------------------------------------------------
type Status struct {
	gorm.Model

	Status       string

	StudentLists []StudentList `gorm:"foreignKey:StatusID"`
}
type StudentList struct {
	gorm.Model

	Reason string
	Amount int
	SaveTime  time.Time

	AdminID *uint
	Admin   Admin

	ReportID *uint
	Report   Report 

	StatusID *uint
	Status   Status 
	
	
	SlipLists []SlipList `gorm:"foreignKey:StudentListID"`
}

//ระบบจัดการทุน--------------------------------------------------------------

type ScholarStatus struct {
	gorm.Model
	StatusName   string
	Scholarships []Scholarship `gorm:"foreignKey:ScholarStatusID"`
}

type ScholarType struct {
	gorm.Model
	TypeName     string
	Scholarships []Scholarship `gorm:"foreignKey:ScholarTypeID"`
}

type Scholarship struct {
	gorm.Model
	ScholarName    string

	AdminID *uint
	Admin   Admin

	ScholarStatusID *uint
	ScholarStatus   ScholarStatus

	ScholarTypeID *uint
	ScholarType   ScholarType

	ScholarDetail string
}
//ระบบผู้ให้ทุน---------------------------------------------------------------
type TypeFund struct {
	gorm.Model
	TypeFund string

	Donators []Donator `grom:"foreignKey:TypeFundID"`
}

type Organization struct {
	gorm.Model
	Organization string

	Donators []Donator `grom:"foreignKey:OrganizationID"`
}

type Donator struct {
	gorm.Model

	UserName string
	DateTime string
	UserInfo string
	UserNote string
	Amount   int
	NameFund string

	TypeFundID *uint
	TypeFund   TypeFund
	
	OrganizationID *uint
	Organization   Organization

	AdminID *uint
	Admin   Admin
}

