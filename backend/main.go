package main

import (
	"github.com/Nok012/sa-65-g02/controller"
	"github.com/Nok012/sa-65-g02/entity"
	"github.com/Nok012/sa-65-g02/middlewares"
	"github.com/gin-gonic/gin"
)

const PORT = "8080"

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())
	router := r.Group("/")
	{
		router.Use(middlewares.Authorizes())
		{

			// Admin Routes
			router.GET("/admin", controller.ListAdmin)
			router.GET("/admin/:id", controller.GetAdmin)
			router.PATCH("/admin", controller.UpdateAdmin)
			router.DELETE("/admin/:id", controller.DeleteAdmin)

			// User Routes
			router.GET("/users", controller.ListUsers)
			router.GET("/user/:id", controller.GetUser)
			router.POST("/users", controller.CreateUser)
			router.PATCH("/users", controller.UpdateUser)
			router.DELETE("/users/:id", controller.DeleteUser)

			//ระบบลงทะเบียนข้อมูลนักศึกษา---------------------------------------------------------------
			// Student Routes
			router.GET("/students", controller.ListStudents)
			router.GET("/student/:user_id", controller.GetStudentByUser)
			router.POST("/students", controller.CreateStudent)
			router.PATCH("/students", controller.UpdateStudent)
			router.DELETE("/students/:id", controller.DeleteStudent)

			// Year Routes
			router.GET("/years", controller.ListYears)
			router.GET("/year/:id", controller.GetYear)
			router.POST("/years", controller.CreateYear)
			router.PATCH("/years", controller.UpdateYear)
			router.DELETE("/years/:id", controller.DeleteUser)

			// Faculty Routes
			router.GET("/faculties", controller.ListFaculties)
			router.GET("/faculty/:id", controller.GetFaculty)
			router.POST("/faculties", controller.CreateFaculty)
			router.PATCH("/faculties", controller.UpdateFaculty)
			router.DELETE("/faculties/:id", controller.DeleteFaculty)

			// Advisor Routes
			router.GET("/advisors", controller.ListAdvisors)
			router.GET("/advisor/:id", controller.GetAdvisor)
			router.POST("/advisors", controller.CreateAdvisor)
			router.PATCH("/advisors", controller.UpdateAdvisor)
			router.DELETE("/advisors/:id", controller.DeleteAdvisor)

			//ระบบลงทะเบียนขอทุนการศึกษา---------------------------------------------------------------
			// Reason Routes
			router.GET("/reasons", controller.ListReason)
			router.GET("/reason", controller.GetReason)
			router.POST("/reasons", controller.CreateReason)
			router.PATCH("/reasons", controller.UpdateReason)
			router.DELETE("/reason", controller.DeleteReason)

			// Report Routes
			router.GET("/reports", controller.ListReport)
			router.GET("/report", controller.GetReport)
			router.GET("/report/:student_id", controller.GetReportByStudent)
			router.POST("/reports", controller.CreateReport)
			router.PATCH("/reports", controller.UpdateReport)
			router.DELETE("/report", controller.DeleteReport)

			//ระบบธุรกรรมการเงินทุนการศึกษา---------------------------------------------------------------
			// Sliplist Routes
			router.GET("/Sliplist", controller.SlipList)
			router.GET("/Sliplist/:id", controller.GetSlipList)
			router.POST("/Sliplist", controller.CreateSlipList)
			router.PATCH("/Sliplist", controller.UpdateSlipList)
			router.DELETE("/Sliplist/:id", controller.DeleteSlipList)

			// Banking Routes
			router.GET("/bankings", controller.ListBanking)
			router.GET("/banking/:id", controller.GetBanking)
			router.POST("/bankings", controller.CreateBanking)
			router.PATCH("/bankings", controller.UpdateBanking)
			router.DELETE("/bankings/:id", controller.DeleteBanking)

			// PaymentStatus Routes
			router.GET("/paymentstatus", controller.ListMyPaymentStatus)
			router.GET("/paymentstatus/:id", controller.GetPaymentStatus)
			router.POST("/paymentstatus", controller.CreatePaymentStatus)
			router.PATCH("/paymentstatus", controller.UpdatePaymentStatus)
			router.DELETE("/paymentstatus/:id", controller.DeletePaymentStatus)

			//ระบบคัดเลือกนักศึกษา-----------------------------------------------------------------------
			// Status Routes
			router.GET("/statuses", controller.ListStatuses)
			router.GET("/statuses/:id", controller.GetStatus)
			router.POST("/statuses", controller.CreateStatus)
			router.PATCH("/statuses", controller.UpdateReport)
			router.DELETE("/statuses/:id", controller.DeleteStatus)

			// StudentList Routes
			router.GET("/studentlist", controller.ListStudentLists)
			router.GET("/studentlist/:id", controller.GetStudentList)
			router.POST("/studentlist", controller.CreateStudentList)
			router.PATCH("/studentlist", controller.UpdateStudentList)
			router.DELETE("/studentlist/:id", controller.DeleteStudentList)

			//ระบบจัดการทุน----------------------------------------------------------------------------
			// Scholarship Routes

			// Status Routes
			router.GET("/scholar_statuses", controller.ListScholarStatuses)
			router.GET("/scholar_status/:id", controller.GetScholarStatus)
			router.POST("/scholar_statuses", controller.CreateScholarStatus)
			router.PATCH("/scholar_statuses", controller.UpdateScholarStatus)
			router.DELETE("/scholar_statuses/:id", controller.DeleteScholarStatus)

			// Type Routes
			router.GET("/scholar_types", controller.ListScholarTypes)
			router.GET("/scholar_type/:id", controller.GetScholarType)
			router.POST("/scholar_types", controller.CreateScholarType)
			router.PATCH("/scholar_types", controller.UpdateScholarType)
			router.DELETE("/scholar_types/:id", controller.DeleteScholarType)

			// Scholarship Routes
			router.GET("/scholarships", controller.ListScholarships)
			router.GET("/scholarship/:id", controller.GetScholarship)
			router.POST("/scholarships", controller.CreateScholarship)
			router.PATCH("/scholarships", controller.UpdateScholarship)
			router.DELETE("/scholarships/:id", controller.DeleteScholarship)

			// ScholarshipsType Routes
			
			//ระบบผู้ให้ทุน------------------------------------------------------------------------------
			// Donator Router
			router.GET("/donators", controller.ListDonators)
			router.GET("/donator/:id", controller.GetDonator)
			router.POST("/donators", controller.CreateDonator)
			router.PATCH("/donators", controller.UpdateDonator)
			router.DELETE("/donator/:id", controller.CreateDonator)

			// TypeFund Router
			router.GET("/TypeFunds", controller.ListTypeFund)
			router.GET("/TypeFund/:id", controller.GetTypeFund)
			router.POST("/TypeFunds", controller.CreateTypeFund)
			router.PATCH("/TypeFunds", controller.UpdateTypeFund)
			router.DELETE("/TypeFund/:id", controller.DeleteTypeFund)

			//Organization Router
			router.GET("/Organizations", controller.ListOrganization)
			router.GET("/Organization/:id", controller.GetOrganization)
			router.POST("/Organizations", controller.CreateOrganization)
			router.PATCH("/Organizations", controller.UpdateOrganization)
			router.DELETE("/Organization/:id", controller.DeleteOrganization)

		}
	}

	// Signup User Route
	r.POST("/signup", controller.CreateUser)

	// login User Route
	r.POST("/login", controller.LoginUser)
	// login Admin Route
	r.POST("/logins", controller.LoginAdmin)

	// Run the server go run main.go
	r.Run("localhost: " + PORT)
}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
