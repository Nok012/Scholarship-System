package controller

import (
	"math"
	"net/http"

	"github.com/Nok012/sa-65-g02/entity"
	"github.com/gin-gonic/gin"
)

// POST /students
func CreateStudent(c *gin.Context) {

	var student entity.Student
	var year entity.Year
	var faculty entity.Faculty
	var advisor entity.Advisor
	var user entity.User

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 9 จะถูก bind เข้าตัวแปร watchVideo
	if err := c.ShouldBindJSON(&student); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 10: ค้นหา advisor ด้วย id
	if tx := entity.DB().Where("id = ?", student.AdvisorID).First(&advisor); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "video not found"})
		return
	}

	// 11: ค้นหา faculty ด้วย id
	if tx := entity.DB().Where("id = ?", student.FacultyID).First(&faculty); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "resolution not found"})
		return
	}

	// 12: ค้นหา year ด้วย id
	if tx := entity.DB().Where("id = ?", student.YearID).First(&year); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "playlist not found"})
		return
	}

	// 13: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", student.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "playlist not found"})
		return
	}

	// 14: สร้าง WatchVideo
	st := entity.Student{
		Advisor:    advisor,                              // โยงความสัมพันธ์กับ Entity Advisor
		Faculty:    faculty,                              // โยงความสัมพันธ์กับ Entity Faculty
		Year:       year,                                 // โยงความสัมพันธ์กับ Entity Year
		User:       user,                                 // โยงความสัมพันธ์กับ Entity User
		Personalid: student.Personalid,                   // ตั้งค่าฟิลด์ Personalid
		Name:       student.Name,                         // ตั้งค่าฟิลด์ Name
		Phon:       student.Phon,                         // ตั้งค่าฟิลด์ Phon
		Gpax:       math.Floor((student.Gpax)*100) / 100, // ตั้งค่าฟิลด์ Gpax
		Money:      student.Money,                        // ตั้งค่าฟิลด์ Money
	}

	// 15: บันทึก
	if err := entity.DB().Create(&st).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": st})
}

// GET /student/:id
func GetStudent(c *gin.Context) {

	var student entity.Student
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM students WHERE id = ?", id).Scan(&student).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": student})
}

// GET /student/:uid
func GetStudentByUser(c *gin.Context) {

	var student entity.Student
	user_id := c.Param("user_id")

	if err := entity.DB().Preload("Year").Preload("Faculty").Preload("Advisor").Preload("User").Raw("SELECT * FROM students WHERE user_id = ?", user_id).Find(&student).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": student, "status": "getstudentbyid success "})
}

// GET /students
func ListStudents(c *gin.Context) {

	var students []entity.Student

	if err := entity.DB().Raw("SELECT * FROM students").Scan(&students).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": students})
}

// DELETE /students/:id
func DeleteStudent(c *gin.Context) {

	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM students WHERE id = ?", id); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "student not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /students
func UpdateStudent(c *gin.Context) {

	var student entity.Student

	if err := c.ShouldBindJSON(&student); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", student.ID).First(&student); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "student not found"})
		return
	}

	if err := entity.DB().Save(&student).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": student})
}
