package category

import (
	"encoding/json"
	"github.com/afrima/vocabulary_learning_helper/src/backend/authorized"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strings"
)

func Init(c *gin.Engine) {
	const path = "/category"
	c.GET(path, authorized.IsAuthorized(get))
	c.GET(path+"/:id", authorized.IsAuthorized(getByID))
	c.POST(path, authorized.IsAuthorized(insert))
	c.DELETE(path+"/:id", authorized.IsAuthorized(deleteCategory))
}

func getByID(c *gin.Context) {
	id := c.Param("id")
	categoryList, err := GetCategoryByID(id)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		log.Print(err)
		return
	}
	c.JSON(http.StatusOK, categoryList)
}

func get(c *gin.Context) {
	claims, _ := authorized.GetTokenClaims(c)
	userName := claims["userName"].(string)
	categoryList, err := GetCategory(userName)
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
	claims, _ := authorized.GetTokenClaims(c)
	body.Owner = strings.ToLower(claims["userName"].(string))
	if err = body.Insert(); err != nil {
		switch err.(type) {
		case Error:
			c.String(http.StatusBadRequest, err.Error())
		default:
			c.String(http.StatusInternalServerError, err.Error())
		}
		log.Print(err)
		return
	}
	c.JSON(http.StatusCreated, body)
}

func deleteCategory(c *gin.Context) {
	id := c.Param("id")
	if err := Delete(id); err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		log.Print(err)
		return
	}
	c.JSON(http.StatusOK, id)
}

func getCategoryFromBody(c *gin.Context) (Category, error) {
	reqBody, err := c.GetRawData()
	if err != nil {
		return Category{}, err
	}
	var returnValue Category
	if err = json.Unmarshal(reqBody, &returnValue); err != nil {
		return Category{}, err
	}
	return returnValue, nil
}
