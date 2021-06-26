package services

import (
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/api/v1/app"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/api/v1/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

// GetToken godoc
// @Summary Retrieves all the Tokens
// @Description Retrieves all the Tokens
// @Accept json
// @Produce json
// @Router /tokens [get]
// @Success 200 {object} app.JSONResult{data=[]models.Token}
// @Tags tokens
func GetToken(entity models.TokenEntity) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		app := app.Gin{Context: ctx}
		tokens, err := entity.List()
		if err != nil {
			app.Response(http.StatusBadRequest, err.Error(), nil)
			return
		}
		app.Response(http.StatusOK, "", tokens)
	}
}

// GetTokenDetails godoc
// @Summary Retrieves one token by id
// @Description Retrieves one token by id
// @ID get-token-by-id
// @Accept json
// @Produce json
// @Param id path string true "Object ID"
// @Router /tokens/{id} [get]
// @Success 200 {object} app.JSONResult{data=models.Token}
// @Failure 500 {object} app.JSONResult
// @Tags tokens
func GetTokenDetails(entity models.TokenEntity) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		app := app.Gin{Context: ctx}
		id := ctx.Param("id")
		token, err := entity.Read(id)
		if err != nil {
			app.Response(http.StatusInternalServerError, err.Error(), nil)
			return
		}
		app.Response(http.StatusOK, "", token)
	}
}

// DeleteToken godoc
// @Summary Deletes a Token
// @Description Deletes a Token
// @ID delete-token-by-id
// @Accept json
// @Produce json
// @Param id path string true "Object ID"
// @Router /tokens/{id} [delete]
// @Failure 500 {object} app.JSONResult
// @Tags tokens
func DeleteToken(entity models.TokenEntity) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		app := app.Gin{Context: ctx}
		id := ctx.Param("id")
		err := entity.Delete(id)
		if err != nil {
			app.Response(http.StatusInternalServerError, err.Error(), nil)
			return
		}
		ctx.Status(http.StatusOK)
	}
}

// CreateToken godoc
// @Summary Creates a Token
// @Description Creates a JWT Token with embedded Team and Tenant
// @Accept json
// @Produce json
// @Param data body models.TokenRequest true "Create a Token"
// @Router /tokens [post]
// @Success 200 {object} app.JSONResult{data=models.Token}
// @Tags tokens
func CreateToken(entity models.TokenEntity) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		app := app.Gin{Context: ctx}
		var data models.TokenRequest
		if err := ctx.ShouldBindJSON(&data); err != nil {
			app.Response(http.StatusBadRequest, err.Error(), nil)
			return
		}
		token, err := entity.Create(&data)
		if err != nil {
			app.Response(http.StatusInternalServerError, err.Error(), nil)
			return
		}
		app.Response(http.StatusOK, "", token)
	}
}

// UpdateToken godoc
// @Summary Updates a Token
// @Description Updates a Token
// @Accept json
// @Produce json
// @Param data body models.TokenRequest true "Update a Token"
// @Param id path string true "Object ID"
// @Router /tokens/{id} [put]
// @Success 200 {object} app.JSONResult{data=models.Token}
// @Tags tokens
func UpdateToken(entity models.TokenEntity) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		app := app.Gin{Context: ctx}
		id := ctx.Param("id")
		var data models.TokenRequest
		if err := ctx.ShouldBindJSON(&data); err != nil {
			app.Response(http.StatusBadRequest, err.Error(), nil)
			return
		}
		token, err := entity.Update(id, &data)
		if err != nil {
			app.Response(http.StatusInternalServerError, err.Error(), nil)
			return
		}
		app.Response(http.StatusOK, "", token)
	}
}

