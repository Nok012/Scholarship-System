package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Nok012/sa-65-g02/entity"
)

func CreateScholarStatus(c *gin.Context) {
	var scholar_status entity.ScholarStatus
	if err := c.ShouldBindJSON(&scholar_status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&scholar_status).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": scholar_status})

}

// GET /status/:id
func GetScholarStatus(c *gin.Context) {
	var scholar_status entity.ScholarStatus
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&scholar_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "scholar_status not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": scholar_status})
}

// GET /status
func ListScholarStatuses(c *gin.Context) {
	var scholar_statuses []entity.ScholarStatus
	if err := entity.DB().Raw("SELECT * FROM scholar_statuses").Scan(&scholar_statuses).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": scholar_statuses})
}

// DELETE /status/:id
func DeleteScholarStatus(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM scholar_statuses WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "scholar_statuses not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /statuss
func UpdateScholarStatus(c *gin.Context) {
	var scholar_status entity.ScholarStatus
	if err := c.ShouldBindJSON(&scholar_status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", scholar_status.ID).First(&scholar_status); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "resolution not found"})
		return
	}

	if err := entity.DB().Save(&scholar_status).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": scholar_status})
}