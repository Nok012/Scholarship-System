package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Nok012/sa-65-g02/entity"
)

// POST /reasons
func CreateReason(c *gin.Context) {
	var reason entity.Reason
	if err := c.ShouldBindJSON(&reason); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&reason).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": reason})
}

// GET /reason/:id
func GetReason(c *gin.Context) {
	var reason entity.Reason
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&reason); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reason not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reason})
}

// GET /reasons
func ListReason(c *gin.Context) {
	var reasons []entity.Reason
	if err := entity.DB().Raw("SELECT * FROM reasons").Scan(&reasons).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reasons})
}

// DELETE /reasons/:id
func DeleteReason(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM reasons WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reason not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /reasons
func UpdateReason(c *gin.Context) {
	var reason entity.Reason
	if err := c.ShouldBindJSON(&reason); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", reason.ID).First(&reason); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reason not found"})
		return
	}

	if err := entity.DB().Save(&reason).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reason})
}