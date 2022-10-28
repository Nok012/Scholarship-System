package controller

import (
	"net/http"

	"github.com/Nok012/sa-65-g02/entity"
	"github.com/gin-gonic/gin"
)

// POST /sliplist
func CreateSlipList(c *gin.Context) {

	var sliplist entity.SlipList
	var banking entity.Banking
	var paymentstatus entity.PaymentStatus
	var studentlist entity.StudentList
	var admin entity.Admin

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร sliplist
	if err := c.ShouldBindJSON(&sliplist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา Banking ด้วย id
	if tx := entity.DB().Where("id = ?", sliplist.BankingID).First(&banking); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "banking not found"})
		return
	}

	// 10: ค้นหา paymentstatuses ด้วย id
	if tx := entity.DB().Where("id = ?", sliplist.PayID).First(&paymentstatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment_statuses not found"})
		return
	}

	// 11: ค้นหา studentlist ด้วย id
	if tx := entity.DB().Where("id = ?", sliplist.StudentListID).First(&studentlist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "studentlist not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", sliplist.AdminID).First(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "studentlist not found"})
		return
	}
	// 12: สร้าง sliplist
	sl := entity.SlipList{
		Pay:         paymentstatus,     // โยงความสัมพันธ์กับ Entity Resolution
		Banking:     banking,           // โยงความสัมพันธ์กับ Entity Video
		StudentList: studentlist,       // โยงความสัมพันธ์กับ Entity Playlist	
		Slipdate:    sliplist.Slipdate, // ตั้งค่าฟิลด์ Slipdate
		Total:       sliplist.Total,	// ตั้งค่าฟิลด์ Total
		Admin:       admin,
	}

	// 13: บันทึก
	if err := entity.DB().Create(&sl).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": sl})
}

// GET /sliplist/:id
func GetSlipList(c *gin.Context) {
	var sliplist entity.SlipList
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&sliplist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "sliplist not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": sliplist})
}

// GET /sliplist
func SlipList(c *gin.Context) {
	var sliplist []entity.SlipList
	if err := entity.DB().Preload("StudentList").Preload("Pay").Preload("Admin").Preload("Banking").Raw("SELECT * FROM slip_lists").Find(&sliplist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": sliplist})
}

// DELETE /sliplist/:id
func DeleteSlipList(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM sliplist WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "sliplist not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /sliplist
func UpdateSlipList(c *gin.Context) {
	var sliplist entity.SlipList
	if err := c.ShouldBindJSON(&sliplist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", sliplist.ID).First(&sliplist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "sliplist not found"})
		return
	}

	if err := entity.DB().Save(&sliplist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": sliplist})
}