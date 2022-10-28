package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Nok012/sa-65-g02/entity"
)
// POST /types
func CreateScholarType(c *gin.Context) {
	var scholar_types entity.ScholarType
	if err := c.ShouldBindJSON(&scholar_types); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&scholar_types).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": scholar_types})
}

// GET /type/:id
func GetScholarType(c *gin.Context) {
	var scholar_type entity.ScholarType

	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&scholar_type); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "video not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": scholar_type})
}

// GET /type
func ListScholarTypes(c *gin.Context) {
	var scholar_types []entity.ScholarType
	if err := entity.DB().Raw("SELECT * FROM scholar_types").Scan(&scholar_types).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": scholar_types})
}

// DELETE /types/:id
func DeleteScholarType(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM scholar_types WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "resolution not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /types
func UpdateScholarType(c *gin.Context) {
	var scholar_types entity.ScholarType
	if err := c.ShouldBindJSON(&scholar_types); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", scholar_types.ID).First(&scholar_types); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "resolution not found"})
		return
	}

	if err := entity.DB().Save(&scholar_types).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": scholar_types.ID})
}