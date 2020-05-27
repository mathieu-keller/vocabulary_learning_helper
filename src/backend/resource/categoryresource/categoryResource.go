package categoryresource

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strings"

	"github.com/Afrima/vocabulary_learning_helper/src/backend/entity/categoryentity"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource"
)

func Init(c *gin.Engine) {
	const path = "/category"
	c.GET(path, resource.IsAuthorized(get))
	c.GET(path+"/:id", resource.IsAuthorized(getByID))
	c.POST(path, resource.IsAuthorized(insert))
	c.DELETE(path+"/:id", resource.IsAuthorized(deleteCategory))
}

func getByID(c *gin.Context) {
	id := c.Param("id")
	categoryList, err := categoryentity.GetCategoryByID(id)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		log.Print(err)
		return
	}
	c.JSON(http.StatusOK, categoryList)
}

func get(c *gin.Context) {
	claims, _ := resource.GetTokenClaims(c)
	userName := claims["userName"].(string)
	categoryList, err := categoryentity.GetCategory(userName)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		log.Print(err)
		return
	}
	c.JSON(http.StatusOK, categoryList)
}

func insert(c *gin.Context) {
	body, err := getCategoryFromBody(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		log.Print(err)
		return
	}
	claims, _ := resource.GetTokenClaims(c)
	body.Owner = strings.ToLower(claims["userName"].(string))
	if err = body.Insert(); err != nil {
		switch err.(type) {
		case categoryentity.Error:
			c.String(http.StatusBadRequest, err.Error())
		default:
			c.String(http.StatusInternalServerError, err.Error())
		}
		log.Print(err)
		return
	}
	c.JSON(http.StatusOK, body)
}

func deleteCategory(c *gin.Context) {
	id := c.Param("id")
	if err := categoryentity.Delete(id); err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		log.Print(err)
		return
	}
	c.JSON(http.StatusOK, id)
}

func getCategoryFromBody(c *gin.Context) (categoryentity.Category, error) {
	reqBody, err := c.GetRawData()
	if err != nil {
		return categoryentity.Category{}, err
	}
	var returnValue categoryentity.Category
	if err = json.Unmarshal(reqBody, &returnValue); err != nil {
		return categoryentity.Category{}, err
	}
	return returnValue, nil
}
