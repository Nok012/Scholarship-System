package controller

import (
	"net/http"

	"github.com/Nok012/sa-65-g02/entity"
	"github.com/gin-gonic/gin"
)

// POST /admins
func CreateAdmin(c *gin.Context) {
	var admin entity.Admin
	if err := c.ShouldBindJSON(&admin); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return
	}
	if err := entity.DB().Create(&admin).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return
	}
	c.JSON(http.StatusOK, gin.H{"data": admin})

}

// GET /admin/:id
func GetAdmin(c *gin.Context) {

	var admin entity.Admin

	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM admins WHERE id = ?", id).Scan(&admin).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	c.JSON(http.StatusOK, gin.H{"data": admin})
}

// GET /admins
func ListAdmin(c *gin.Context) {

	var admin []entity.Admin

	if err := entity.DB().Raw("SELECT * FROM admins").Scan(&admin).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	c.JSON(http.StatusOK, gin.H{"data": admin})
}

// DELETE /admins/:id
func DeleteAdmin(c *gin.Context) {

	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM admins WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "admin not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /admins
func UpdateAdmin(c *gin.Context) {

	var admin entity.Admin

	if err := c.ShouldBindJSON(&admin); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	if tx := entity.DB().Where("id = ?", admin.ID).First(&admin); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})

		return

	}
	if err := entity.DB().Save(&admin).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	c.JSON(http.StatusOK, gin.H{"data": admin})
}