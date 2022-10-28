package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Nok012/sa-65-g02/entity"
)

// POST /repoets
func CreateReport(c *gin.Context) {

		/*var report entity.Report
		if err := c.ShouldBindJSON(&report); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	
		if err := entity.DB().Create(&report).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"data": report})*/

	var report entity.Report
	var scholarship entity.Scholarship
	var reason entity.Reason
	var student entity.Student

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร report
	if err := c.ShouldBindJSON(&report); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":"test"})
		return 
	}

	// 9: ค้นหา student ด้วย id
	if tx := entity.DB().Where("id = ?", report.StudentID).First(&student); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "student not found"})
		return
	}

	// 10: ค้นหา scholarship ด้วย id
	if tx := entity.DB().Where("id = ?", report.ScholarshipID).First(&scholarship); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "scholarship not found"})
		return
	}

	// 11: ค้นหา reason ด้วย id
	if tx := entity.DB().Where("id = ?", report.ReasonID).First(&reason); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reason not found"})
		return
	}

	// 12: สร้าง Report
	re := entity.Report{
		Scholarship: scholarship, // โยงความสัมพันธ์กับ Entity Scholarship
		Student:     student,     // โยงความสัมพันธ์กับ Entity Student
		Reason:      reason,      // โยงความสัมพันธ์กับ Entity Reason
		ReasonInfo:  report.ReasonInfo,
	}

	// 13: บันทึก
	if err := entity.DB().Create(&re).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": re})
}

// GET /report/:id
func GetReport(c *gin.Context) {
	var report entity.Report
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&report); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "report not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": report})
}


// GET /repoets
func ListReport(c *gin.Context) {
	var reports []entity.Report
	if err := entity.DB().Preload("Scholarship").Preload("Reason").Preload("Student").Raw("SELECT * FROM reports").Find(&reports).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reports})
}

func GetReportByStudent(c *gin.Context) {
	var report []entity.Report
	student_id := c.Param("student_id")
	if err := entity.DB().Preload("Scholarship").Preload("Reason").Preload("Student").Raw("SELECT * FROM reports WHERE student_id = ?", student_id).Find(&report).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": report})
}

// DELETE /repoets/:id
func DeleteReport(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM repoets WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "report not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /repoets
func UpdateReport(c *gin.Context) {
	var report entity.Report
	if err := c.ShouldBindJSON(&report); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", report.ID).First(&report); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "report not found"})
		return
	}

	if err := entity.DB().Save(&report).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": report})
}