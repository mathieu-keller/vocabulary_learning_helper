package vocabularylist

import (
	"encoding/json"
	"github.com/afrima/vocabulary_learning_helper/src/backend/authorized"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strings"
)

func Init(c *gin.Engine) {
	const path = "/vocabulary-list"
	c.GET(path+"/:id", authorized.IsAuthorized(getVocabularyList))
	c.POST(path, authorized.IsAuthorized(insertVocabularyList))
	c.DELETE(path+"/:id", authorized.IsAuthorized(deleteVocabularyList))
}

func getVocabularyList(c *gin.Context) {
	id := c.Param("id")
	vocabularyList, err := GetVocabularyList(id)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		log.Print(err)
		return
	}
	c.JSON(http.StatusOK, vocabularyList)
}

func insertVocabularyList(c *gin.Context) {
	vocabularyList, err := getVocabularyListFromBody(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		log.Print(err)
		return
	}
	claims, _ := authorized.GetTokenClaims(c)
	vocabularyList.Owner = strings.ToLower(claims["userName"].(string))
	if err = vocabularyList.Insert(); err != nil {
		switch err.(type) {
		case Error:
			c.String(http.StatusBadRequest, err.Error())
		default:
			c.String(http.StatusInternalServerError, err.Error())
		}
		log.Print(err)
		return
	}

	c.JSON(http.StatusCreated, vocabularyList)
}

func deleteVocabularyList(c *gin.Context) {
	id := c.Param("id")
	if err := Delete(id); err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		log.Print(err)
		return
	}
	c.JSON(http.StatusOK, id)
}

func getVocabularyListFromBody(c *gin.Context) (VocabularyList, error) {
	reqBody, err := c.GetRawData()
	if err != nil {
		return VocabularyList{}, err
	}
	var vocab VocabularyList
	if err = json.Unmarshal(reqBody, &vocab); err != nil {
		return VocabularyList{}, err
	}
	return vocab, nil
}
