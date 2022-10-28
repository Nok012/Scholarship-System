package controller

import (
	"net/http"

	"github.com/Nok012/sa-65-g02/entity"
	"github.com/gin-gonic/gin"
)

// POST  Organization
func CreateOrganization(c *gin.Context) {
	var Organization entity.Organization
	if err := c.ShouldBindJSON(&Organization); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&Organization).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": Organization})
}

// GET /Organization/:id
func GetOrganization(c *gin.Context) {

	var Organization entity.Organization

	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM Organizations WHERE id = ?", id).Scan(&Organization).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	c.JSON(http.StatusOK, gin.H{"data": Organization})
}

// GET /Organization
func ListOrganization(c *gin.Context) {

	var Organization []entity.Organization

	if err := entity.DB().Raw("SELECT * FROM Organizations").Scan(&Organization).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	c.JSON(http.StatusOK, gin.H{"data": Organization})
}

// DELETE /Organization/:id
func DeleteOrganization(c *gin.Context) {

	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM Organizations WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Organizations not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /Organization
func UpdateOrganization(c *gin.Context) {

	var Organization entity.Organization

	if err := c.ShouldBindJSON(&Organization); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	if tx := entity.DB().Where("id = ?", Organization.ID).First(&Organization); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "Organizations not found"})

		return

	}
	if err := entity.DB().Save(&Organization).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	c.JSON(http.StatusOK, gin.H{"data": Organization})
}