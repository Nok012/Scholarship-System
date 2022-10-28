package controller

import (
	"net/http"

	"github.com/Nok012/sa-65-g02/entity"
	"github.com/gin-gonic/gin"
)
// POST  TypeFund
func CreateTypeFund(c *gin.Context) {
	var typeFund entity.TypeFund
	if err := c.ShouldBindJSON(&typeFund); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&typeFund).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": typeFund})
}

// GET /TypeFund/:id
func GetTypeFund(c *gin.Context) {

	var typeFund entity.TypeFund

	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM type_funds WHERE id = ?", id).Scan(&typeFund).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	c.JSON(http.StatusOK, gin.H{"data": typeFund})
}

// GET /TypeFund
func ListTypeFund(c *gin.Context) {

	var typeFund []entity.TypeFund

	if err := entity.DB().Raw("SELECT * FROM type_funds").Scan(&typeFund).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	c.JSON(http.StatusOK, gin.H{"data": typeFund})
}

// DELETE /TypeFund/:id
func DeleteTypeFund(c *gin.Context) {

	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM type_funds WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "TypeFund not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /TypeFund
func UpdateTypeFund(c *gin.Context) {

	var typeFund entity.TypeFund

	if err := c.ShouldBindJSON(&typeFund); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	if tx := entity.DB().Where("id = ?", typeFund.ID).First(&typeFund); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "TypeFund not found"})

		return

	}
	if err := entity.DB().Save(&typeFund).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	c.JSON(http.StatusOK, gin.H{"data": typeFund})
}