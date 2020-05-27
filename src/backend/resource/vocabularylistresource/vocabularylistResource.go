package vocabularylistresource

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strings"

	"github.com/Afrima/vocabulary_learning_helper/src/backend/entity/vocabularylistentity"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource"
)

func Init(c *gin.Engine) {
	const path = "/vocabulary-list"
	c.GET(path+"/:id", resource.IsAuthorized(getVocabularyList))
	c.POST(path, resource.IsAuthorized(insertVocabularyList))
	c.DELETE(path+"/:id", resource.IsAuthorized(deleteVocabularyList))
}

func getVocabularyList(c *gin.Context) {
	id := c.Param("id")
	vocabularyList, err := vocabularylistentity.GetVocabularyList(id)
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
	claims, _ := resource.GetTokenClaims(c)
	vocabularyList.Owner = strings.ToLower(claims["userName"].(string))
	if err = vocabularyList.Insert(); err != nil {
		switch err.(type) {
		case vocabularylistentity.Error:
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
	if err := vocabularylistentity.Delete(id); err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		log.Print(err)
		return
	}
	c.JSON(http.StatusOK, id)
}

func getVocabularyListFromBody(c *gin.Context) (vocabularylistentity.VocabularyList, error) {
	reqBody, err := c.GetRawData()
	if err != nil {
		return vocabularylistentity.VocabularyList{}, err
	}
	var vocab vocabularylistentity.VocabularyList
	if err = json.Unmarshal(reqBody, &vocab); err != nil {
		return vocabularylistentity.VocabularyList{}, err
	}
	return vocab, nil
}
