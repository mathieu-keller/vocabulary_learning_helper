package vocabulary

import (
	"encoding/json"
	"github.com/afrima/vocabulary_learning_helper/src/backend/authorized"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func Init(r *gin.Engine) {
	const path = "/vocabulary"
	r.POST(path, authorized.IsAuthorized(insertVocab))
	r.GET(path+"/:id", authorized.IsAuthorized(getVocab))
	r.DELETE(path, authorized.IsAuthorized(deleteVocab))
	r.POST("/generate-test", authorized.IsAuthorized(generateTest))
	r.POST("/check-test", authorized.IsAuthorized(checkTest))
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
	correction, err := CheckTest(correctVocabs, checkRequestBody)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, correction)
}

func getCheckRequestFromBody(c *gin.Context) (CheckTestRequest, error) {
	reqBody, err := c.GetRawData()
	if err != nil {
		return CheckTestRequest{}, err
	}
	var checkRequestBody CheckTestRequest
	err = json.Unmarshal(reqBody, &checkRequestBody)
	return checkRequestBody, err
}

func getVocabulariesFromDB(checkRequestBody CheckTestRequest) ([]Vocabulary, error) {
	vocabularyIds := make([]primitive.ObjectID, 0, len(checkRequestBody.Vocabularies))
	for _, vocab := range checkRequestBody.Vocabularies {
		vocabularyIds = append(vocabularyIds, vocab.ID)
	}
	correctVocabs, err := GetVocabularyByIDs(vocabularyIds)
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
	var testReqBody GenerateTestRequest
	if err = json.Unmarshal(reqBody, &testReqBody); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	responseVocabularies, err := GenerateTest(testReqBody)
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
		case Error:
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
	vocabs, err := GetVocabularyByListID(id)
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

func getVocabFromBody(c *gin.Context) (Vocabulary, error) {
	reqBody, err := c.GetRawData()
	if err != nil {
		return Vocabulary{}, err
	}
	var vocab Vocabulary
	if err = json.Unmarshal(reqBody, &vocab); err != nil {
		return Vocabulary{}, err
	}
	return vocab, nil
}
