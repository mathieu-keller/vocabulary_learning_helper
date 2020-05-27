package vocabularyresource

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/Afrima/vocabulary_learning_helper/src/backend/entity/vocabularyentity"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/service/vocabularyservice"
)

func Init(r *gin.Engine) {
	const path = "/vocabulary"
	r.POST(path, resource.IsAuthorized(insertVocab))
	r.GET(path+"/:id", resource.IsAuthorized(getVocab))
	r.DELETE(path, resource.IsAuthorized(deleteVocab))
	r.POST("/generate-test", resource.IsAuthorized(generateTest))
	r.POST("/check-test", resource.IsAuthorized(checkTest))
}

func checkTest(c *gin.Context) {
	checkRequestBody, err := getCheckRequestFromBody(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	correctVocabs, err := getVocabulariesFromDB(checkRequestBody)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		return
	}
	correction, err := vocabularyservice.CheckTest(correctVocabs, checkRequestBody)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, correction)
}

func getCheckRequestFromBody(c *gin.Context) (vocabularyservice.CheckTestRequest, error) {
	reqBody, err := c.GetRawData()
	if err != nil {
		return vocabularyservice.CheckTestRequest{}, err
	}
	var checkRequestBody vocabularyservice.CheckTestRequest
	err = json.Unmarshal(reqBody, &checkRequestBody)
	return checkRequestBody, err
}

func getVocabulariesFromDB(checkRequestBody vocabularyservice.CheckTestRequest) ([]vocabularyentity.Vocabulary, error) {
	vocabularyIds := make([]primitive.ObjectID, 0, len(checkRequestBody.Vocabularies))
	for _, vocab := range checkRequestBody.Vocabularies {
		vocabularyIds = append(vocabularyIds, vocab.ID)
	}
	correctVocabs, err := vocabularyentity.GetVocabularyByIDs(vocabularyIds)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return correctVocabs, nil
}

func generateTest(c *gin.Context) {
	reqBody, err := c.GetRawData()
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	var testReqBody vocabularyservice.GenerateTestRequest
	if err = json.Unmarshal(reqBody, &testReqBody); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	responseVocabularies, err := vocabularyservice.GenerateTest(testReqBody)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, responseVocabularies)
}

func insertVocab(c *gin.Context) {
	vocab, err := getVocabFromBody(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		log.Print(err)
		return
	}
	if err = vocab.InsertVocab(); err != nil {
		switch err.(type) {
		case vocabularyentity.Error:
			c.String(http.StatusBadRequest, err.Error())
		default:
			c.String(http.StatusInternalServerError, err.Error())
		}
		log.Print(err)
		return
	}
	c.JSON(http.StatusCreated, vocab)
}

func getVocab(c *gin.Context) {
	id := c.Param("id")
	vocabs, err := vocabularyentity.GetVocabularyByListID(id)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, vocabs)
}

func deleteVocab(c *gin.Context) {
	vocab, err := getVocabFromBody(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	if err = vocab.Delete(); err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, vocab)
}

func getVocabFromBody(c *gin.Context) (vocabularyentity.Vocabulary, error) {
	reqBody, err := c.GetRawData()
	if err != nil {
		return vocabularyentity.Vocabulary{}, err
	}
	var vocab vocabularyentity.Vocabulary
	if err = json.Unmarshal(reqBody, &vocab); err != nil {
		return vocabularyentity.Vocabulary{}, err
	}
	return vocab, nil
}
