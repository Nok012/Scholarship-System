package controller

import (
	"net/http"

	"github.com/Nok012/sa-65-g02/entity"
	"github.com/gin-gonic/gin"
)

// POST /banking
func CreateBanking(c *gin.Context) {
	var banking entity.Banking
	if err := c.ShouldBindJSON(&banking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&banking).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": banking})
}

// GET /banking/:id
func GetBanking(c *gin.Context) {
	var banking entity.Banking

	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&banking); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "banking not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banking})
}

// GET /bankings
func ListBanking(c *gin.Context) {
	var bankings []entity.Banking
	if err := entity.DB().Raw("SELECT * FROM bankings").Scan(&bankings).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bankings})
}

// DELETE /bankings/:id
func DeleteBanking(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM bankings WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "banking not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /bankings
func UpdateBanking(c *gin.Context) {
	var bankings entity.Banking
	if err := c.ShouldBindJSON(&bankings); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", bankings.ID).First(&bankings); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "banking not found"})
		return
	}

	if err := entity.DB().Save(&bankings).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bankings})
}