package controller

import (
	"net/http"

	"github.com/Nok012/sa-65-g02/entity"
	"github.com/gin-gonic/gin"
)

// POST /paymentstatus
func CreatePaymentStatus(c *gin.Context) {
	var paymentstatus entity.PaymentStatus
	if err := c.ShouldBindJSON(&paymentstatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&paymentstatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": paymentstatus})
}

// GET /paymentstatus
func ListMyPaymentStatus(c *gin.Context) {
	var paymentstatus []entity.PaymentStatus
	if err := entity.DB().Raw("SELECT * FROM payment_statuses").Scan(&paymentstatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paymentstatus})
}

// GET /paymentstatus/:id
func GetPaymentStatus(c *gin.Context) {
	var paymentstatus entity.PaymentStatus
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&paymentstatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment_statuses not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paymentstatus})
}

// DELETE /paymentstatus/:id
func DeletePaymentStatus(c *gin.Context) {
	PayID := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM payment_statuses WHERE id = ?", PayID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment_statuses not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": PayID})
}

// PATCH /paymentstatus
func UpdatePaymentStatus(c *gin.Context) {
	var paymentstatus entity.PaymentStatus
	if err := c.ShouldBindJSON(&paymentstatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", paymentstatus.ID).First(&paymentstatus); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment_statuses not found"})
		return
	}

	if err := entity.DB().Save(&paymentstatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paymentstatus})
}