package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Nok012/sa-65-g02/entity"
)

// POST /scholarship
func CreateScholarship(c *gin.Context) {

	var scholarship entity.Scholarship
	var admin entity.Admin
	var scholar_status entity.ScholarStatus
	var scholar_type entity.ScholarType

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร scholarship
	if err := c.ShouldBindJSON(&scholarship); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา admin ด้วย id
	if tx := entity.DB().Where("id = ?", scholarship.AdminID).First(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "scholar_admin not found"})
		return
	}

	// 10: ค้นหา status ด้วย id
	if tx := entity.DB().Where("id = ?", scholarship.ScholarStatusID).First(&scholar_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "scholar_status not found"})
		return
	}
	// 11: ค้นหา type ด้วย id
	if tx := entity.DB().Where("id = ?", scholarship.ScholarTypeID).First(&scholar_type); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "scholar_type not found"})
		return
	}

	// 12: สร้าง scholarship
	wv := entity.Scholarship{
		ScholarName:   scholarship.ScholarName,		
		ScholarDetail: scholarship.ScholarDetail,
		Admin:  admin,
		ScholarStatus: scholar_status,
		ScholarType:   scholar_type,
	}

	// 13: บันทึก
	if err := entity.DB().Create(&wv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": wv})
}

// GET /scholarship/:id
func GetScholarship(c *gin.Context) {
	var scholarship entity.Scholarship
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&scholarship); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "หcholarship not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": scholarship})
}

// GET /scholarships
func ListScholarships(c *gin.Context) {
	var scholarships []entity.Scholarship
	if err := entity.DB().Preload("Admin").Preload("ScholarStatus").Preload("ScholarType").Raw("SELECT * FROM scholarships").Find(&scholarships).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": scholarships})
}

// DELETE /scholarships/:id
func DeleteScholarship(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM scholarships WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "scholarships not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /scholarships
func UpdateScholarship(c *gin.Context) {
	var scholarship entity.Scholarship
	if err := c.ShouldBindJSON(&scholarship); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", scholarship.ID).First(&scholarship); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "scholarship not found"})
		return
	}

	if err := entity.DB().Save(&scholarship).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": scholarship})
}