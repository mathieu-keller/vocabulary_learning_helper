package vocabularyresource

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/afrima/vocabulary_learning_helper/src/backend/entity/vocabularyentity"
	"github.com/afrima/vocabulary_learning_helper/src/backend/resource"
	"github.com/afrima/vocabulary_learning_helper/src/backend/service/vocabularyservice"
	"github.com/afrima/vocabulary_learning_helper/src/backend/utility"
)

func Init(r *mux.Router) {
	const path = "/vocabulary"
	r.Handle(path, resource.IsAuthorized(insertVocab)).Methods(http.MethodPost)
	r.Handle(path+"/{id}", resource.IsAuthorized(getVocab)).Methods(http.MethodGet)
	r.Handle(path, resource.IsAuthorized(deleteVocab)).Methods(http.MethodDelete)
	r.Handle("/generate-test", resource.IsAuthorized(generateTest)).Methods(http.MethodPost)
	r.Handle("/check-test", resource.IsAuthorized(checkTest)).Methods(http.MethodPost)
}

func checkTest(w http.ResponseWriter, r *http.Request) {
	checkRequestBody, err := getCheckRequestFromBody(r)
	if err != nil {
		resource.SendError(http.StatusBadRequest, w, err)
		return
	}
	correctVocabs, err := getVocabulariesFromDB(checkRequestBody)
	if err != nil {
		resource.SendError(http.StatusInternalServerError, w, err)
		return
	}
	correction, err := vocabularyservice.CheckTest(correctVocabs, checkRequestBody)
	if err != nil {
		resource.SendError(http.StatusBadRequest, w, err)
		return
	}
	w.Header().Set(utility.ContentType, utility.ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(correction); err != nil {
		resource.SendError(http.StatusInternalServerError, w, err)
	}
}

func getCheckRequestFromBody(r *http.Request) (vocabularyservice.CheckTestRequest, error) {
	reqBody, err := ioutil.ReadAll(r.Body)
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

func generateTest(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		resource.SendError(http.StatusBadRequest, w, err)
		return
	}
	var testReqBody vocabularyservice.GenerateTestRequest
	if err = json.Unmarshal(reqBody, &testReqBody); err != nil {
		resource.SendError(http.StatusBadRequest, w, err)
		return
	}
	responseVocabularies, err := vocabularyservice.GenerateTest(testReqBody)
	if err != nil {
		resource.SendError(http.StatusInternalServerError, w, err)
		return
	}
	sendVocabularies(w, responseVocabularies)
}

func insertVocab(w http.ResponseWriter, r *http.Request) {
	vocab, err := getVocabFromBody(r)
	if err != nil {
		resource.SendError(http.StatusBadRequest, w, err)
		return
	}
	if err = vocab.InsertVocab(); err != nil {
		switch err.(type) {
		case vocabularyentity.Error:
			resource.SendError(http.StatusBadRequest, w, err)
		default:
			resource.SendError(http.StatusInternalServerError, w, err)
		}
		return
	}
	sendVocabulary(w, vocab, http.StatusCreated)
}

func getVocab(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	vocabs, err := vocabularyentity.GetVocabularyByListID(id)
	if err != nil {
		resource.SendError(http.StatusInternalServerError, w, err)
		return
	}
	sendVocabularies(w, vocabs)
}

func deleteVocab(w http.ResponseWriter, r *http.Request) {
	vocab, err := getVocabFromBody(r)
	if err != nil {
		resource.SendError(http.StatusBadRequest, w, err)
		return
	}
	if err = vocab.Delete(); err != nil {
		resource.SendError(http.StatusInternalServerError, w, err)
		return
	}
	sendVocabulary(w, vocab, http.StatusOK)
}

func getVocabFromBody(r *http.Request) (vocabularyentity.Vocabulary, error) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return vocabularyentity.Vocabulary{}, err
	}
	var vocab vocabularyentity.Vocabulary
	if err = json.Unmarshal(reqBody, &vocab); err != nil {
		return vocabularyentity.Vocabulary{}, err
	}
	return vocab, nil
}

func sendVocabularies(w http.ResponseWriter, vocabs []vocabularyentity.Vocabulary) {
	w.Header().Set(utility.ContentType, utility.ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(vocabs); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
	}
}

func sendVocabulary(w http.ResponseWriter, vocabs vocabularyentity.Vocabulary, statusCode int) {
	w.Header().Set(utility.ContentType, utility.ContentTypeJSON)
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(vocabs); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
	}
}
