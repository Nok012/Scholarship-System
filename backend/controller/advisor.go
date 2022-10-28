package controller

import (
	"net/http"

	"github.com/Nok012/sa-65-g02/entity"
	"github.com/gin-gonic/gin"
)

// POST /advisors
func CreateAdvisor(c *gin.Context) {

	var advisor entity.Advisor

	if err := c.ShouldBindJSON(&advisor); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&advisor).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": advisor})
}

// GET /advisor/:id
func GetAdvisor(c *gin.Context) {

	var advisor entity.Advisor
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM advisors WHERE id = ?", id).Scan(&advisor).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": advisor})
}

// GET /advisors
func ListAdvisors(c *gin.Context) {

	var advisors []entity.Advisor

	if err := entity.DB().Raw("SELECT * FROM advisors").Scan(&advisors).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": advisors})
}

// DELETE /advisors/:id
func DeleteAdvisor(c *gin.Context) {

	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM advisors WHERE id = ?", id); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "advisor not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /advisors
func UpdateAdvisor(c *gin.Context) {

	var advisor entity.Advisor

	if err := c.ShouldBindJSON(&advisor); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", advisor.ID).First(&advisor); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "advisor not found"})
		return
	}

	if err := entity.DB().Save(&advisor).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": advisor})
}
