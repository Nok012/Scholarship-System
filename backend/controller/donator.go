package controller

import (
	"net/http"

	"github.com/Nok012/sa-65-g02/entity"
	"github.com/gin-gonic/gin"
)

// POST Donators
func CreateDonator(c *gin.Context) {

	var donator entity.Donator
	var organization entity.Organization
	var typeFund entity.TypeFund

	if err := c.ShouldBindJSON(&donator); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", donator.OrganizationID).First(&organization); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Organization Can't found"})
		return
	}

	if tx := entity.DB().Where("id = ?", donator.TypeFundID).First(&typeFund); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "TypeFund Can't found"})
		return
	}

	dn := entity.Donator{
		TypeFund:     typeFund,
		Organization: organization,

		UserName: donator.UserName,
		DateTime: donator.DateTime,
		UserInfo: donator.UserInfo,
		UserNote: donator.UserNote,
		Amount:   donator.Amount,
		NameFund: donator.NameFund,
	}

	if err := entity.DB().Create(&dn).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": dn})
}

// GET /Donator/:id
func GetDonator(c *gin.Context) {
	var donator entity.Donator
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&donator); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Donators not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": donator})
}

// GET /Donators
func ListDonators(c *gin.Context) {
	var Donator []entity.Donator
	if err := entity.DB().Preload("organizations").Preload("TypeFunds").Preload("admins").Raw("SELECT * FROM donators").Find(&Donator).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": Donator})
}

// DELETE /watch_videos/:id
func DeleteWatchVideo(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM donators WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Donators not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /Donators
func UpdateDonator(c *gin.Context) {
	var donator entity.Donator
	if err := c.ShouldBindJSON(&donator); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", donator.ID).First(&donator); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Donators not found"})
		return
	}

	if err := entity.DB().Save(&donator).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": donator})
}