package entity

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Email    string `gorm:"uniqueIndex"`
	Password string `json:"-"`

	Students []Student `grom:"foreignKey:UserID"`
}

//ระบบลงทะเบียนข้อมูลนักศึกษา---------------------------------------------------------------
type Year struct {
	gorm.Model
	Number string

	Students []Student `grom:"foreignKey:YearID"`
}

type Faculty struct {
	gorm.Model
	Name     string
	ThaiName string

	Students []Student `grom:"foreignKey:FacultyID"`
}

type Advisor struct {
	gorm.Model
	Name     string
	ThaiName string

	Students []Student `grom:"foreignKey:AdvisorID"`
}

type Student struct {
	gorm.Model
	Personalid string
	Name       string
	Phon       string
	Gpax       float64
	Money      int

	YearID *uint
	Year   Year

	FacultyID *uint
	Faculty   Faculty

	AdvisorID *uint
	Advisor   Advisor

	UserID *uint `gorm:"uniqueIndex"`
	User   User

	Reports []Report `grom:"foreignKey:StudentID"`
}

//ระบบลงทะเบียนขอทุน---------------------------------------------------
type Reason struct {
	gorm.Model
	Name string

	Reports []Report `grom:"foreignKey:ReasonID"`
}

type Report struct {
	gorm.Model
	ReasonInfo string 

	StudentID *uint
	Student   Student

	ScholarshipID *uint
	Scholarship   Scholarship

	ReasonID *uint
	Reason   Reason	

	StudentLists []StudentList `gorm:"foreignKey:ReportID"`
}