package importer

import (
	"github.com/afrima/vocabulary_learning_helper/src/backend/authorized"
	"github.com/gin-gonic/gin"
)

func Init(c *gin.Engine) {
	c.POST("/import", authorized.IsAuthorized(insert))
}

func insert(c *gin.Context) {
	rFile, err := c.FormFile("file")
	rListID, _ := c.GetPostForm("listID")
	rCategoryID, _ := c.GetPostForm("categoryID")
	listName, _ := c.GetPostForm("listName")
	if err != nil {
		c.String(400, "file format error")
		return
	}
	if rCategoryID == "" || (rListID == "" && listName == "") {
		c.String(400, "list id or list name is needed and an category id is needed too")
		return
	}
	claims, valid := authorized.GetTokenClaims(c)
	if !valid {
		c.String(403, "token is not valid!")
		return
	}
	if err = importCsv(rCategoryID, rListID, listName, rFile, claims["userName"].(string)); err != nil {
		c.String(400, err.Error())
	}
	c.String(201, "all imported")
}
