package controller

import (
	"net/http"

	"github.com/Nok012/sa-65-g02/entity"
	"github.com/gin-gonic/gin"
)

// POST /student_lists
func CreateStudentList(c *gin.Context) {

	var studentlist entity.StudentList
	var status entity.Status
	var report entity.Report
	var admin  entity.Admin

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 7 จะถูก bind เข้าตัวแปร studentList
	if err := c.ShouldBindJSON(&studentlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 8: ค้นหา report ด้วย id
	if tx := entity.DB().Where("id = ?", studentlist.ReportID).First(&report); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "report not found"})
		return
	}

	// 9: ค้นหา status ด้วย id
	if tx := entity.DB().Where("id = ?", studentlist.StatusID).First(&status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "status not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", studentlist.AdminID).First(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "status not found"})
		return
	}

	// 10: สร้าง StudentList
	sl := entity.StudentList{
		Report:   report,               // โยงความสัมพันธ์กับ Entity Report
		Status:   status,               // โยงความสัมพันธ์กับ Entity Status
		Admin:	  admin,
		SaveTime: studentlist.SaveTime, // ตั้งค่าฟิลด์ saveTime
		Reason:   studentlist.Reason,
		Amount:   studentlist.Amount,
		
	}

	// 11: บันทึก
	if err := entity.DB().Create(&sl).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": sl})
}

// GET /studentlist/:id
func GetStudentList(c *gin.Context) {
	var studentlist entity.StudentList
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&studentlist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "studentlist not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": studentlist})
}

// GET /student_lists
func ListStudentLists(c *gin.Context) {
	var studentlists []entity.StudentList
	if err := entity.DB().Preload("Status").Preload("Report").Preload("Admin").Raw("SELECT * FROM student_lists").Find(&studentlists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": studentlists})
}

// DELETE /student_lists/:id
func DeleteStudentList(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM student_lists WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "studentlist not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /student_list
func UpdateStudentList(c *gin.Context) {
	var studentlist entity.StudentList
	if err := c.ShouldBindJSON(&studentlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", studentlist.ID).First(&studentlist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "studentlist not found"})
		return
	}

	if err := entity.DB().Save(&studentlist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": studentlist})
}

// // POST /StudentList
// func CreateStudentList(c *gin.Context) {
// 	var StudentList entity.StudentList
// 	if err := c.ShouldBindJSON(&StudentList); err != nil {

// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

// 		return
// 	}
// 	if err := entity.DB().Create(&StudentList).Error; err != nil {

// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": StudentList})

// }

// // GET /StudentList/:id
// func GetStudentList(c *gin.Context) {

// 	var admin entity.Admin

// 	StudentListID := c.Param("StudentListID")

// 	if err := entity.DB().Raw("SELECT * FROM student_lists WHERE id = ?", StudentListID).Scan(&admin).Error; err != nil {

// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

// 		return

// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": StudentListID})
// }

// // GET /StudentList
// func ListStudentList(c *gin.Context) {

// 	var StudentList []entity.StudentList

// 	if err := entity.DB().Raw("SELECT * FROM student_lists").Scan(&StudentList).Error; err != nil {

// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

// 		return

// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": StudentList})
// }

// // DELETE /StudentList/:id
// func DeleteStudentList(c *gin.Context) {

// 	StudentListID := c.Param("StudentListID")
// 	if tx := entity.DB().Exec("DELETE FROM student_lists WHERE id = ?", StudentListID); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "StudentList not found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": StudentListID})
// }

// // PATCH /StudentList
// func UpdateStudentList(c *gin.Context) {

// 	var StudentList entity.StudentList

// 	if err := c.ShouldBindJSON(&StudentList); err != nil {

// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

// 		return

// 	}
// 	if tx := entity.DB().Where("id = ?", StudentList.ID).First(&StudentList); tx.RowsAffected == 0 {

// 		c.JSON(http.StatusBadRequest, gin.H{"error": "SlipList not found"})

// 		return

// 	}
// 	if err := entity.DB().Save(&StudentList).Error; err != nil {

// 		c.JSON(http.StatusBadRequest, gin.H{"StudentList": err.Error()})

// 		return

// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": StudentList})
// }