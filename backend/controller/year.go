package controller

import (
	"net/http"

	"github.com/Nok012/sa-65-g02/entity"
	"github.com/gin-gonic/gin"
)

// POST /years
func CreateYear(c *gin.Context) {

	var year entity.Year

	if err := c.ShouldBindJSON(&year); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&year).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": year})
}

// GET /year/:id
func GetYear(c *gin.Context) {

	var year entity.Year
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM years WHERE id = ?", id).Scan(&year).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": year})
}

// GET /years
func ListYears(c *gin.Context) {

	var years []entity.Year

	if err := entity.DB().Raw("SELECT * FROM years").Scan(&years).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": years})
}

// DELETE /years/:id
func DeleteYear(c *gin.Context) {

	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM years WHERE id = ?", id); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "year not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /years
func UpdateYear(c *gin.Context) {

	var year entity.Year

	if err := c.ShouldBindJSON(&year); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", year.ID).First(&year); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "year not found"})
		return
	}

	if err := entity.DB().Save(&year).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": year})
}
