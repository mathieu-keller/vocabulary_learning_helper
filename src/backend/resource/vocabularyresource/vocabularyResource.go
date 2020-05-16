package vocabularyresource

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/afrima/japanese_learning_helper/src/backend/entity/vocabularyentity"
	"github.com/afrima/japanese_learning_helper/src/backend/resource"
	"github.com/afrima/japanese_learning_helper/src/backend/utility"
)

func Init(r *mux.Router) {
	const path = "/vocabulary"
	r.HandleFunc(path, insertVocab).Methods(http.MethodPost)
	r.Handle(path+"/{id}", resource.IsAuthorized(getVocab)).Methods(http.MethodGet)
	r.Handle(path, resource.IsAuthorized(deleteVocab)).Methods(http.MethodDelete)
	r.HandleFunc("/generate-test", generateTest).Methods(http.MethodPost)
	r.HandleFunc("/check-test", checkTest).Methods(http.MethodPost)
}

type TestRequestBody struct {
	ListIDs          []primitive.ObjectID `json:"listIds"`
	Limit            int8                 `json:"limit"`
	FirstValueField  string               `json:"firstValueField"`
	SecondValueField string               `json:"secondValueField"`
}

type CheckRequestBody struct {
	Vocabularies     []vocabularyentity.Vocabulary `json:"vocabularies"`
	FirstValueField  string                        `json:"firstValueField"`
	SecondValueField string                        `json:"secondValueField"`
}

type UserDBVocabs struct {
	ID         primitive.ObjectID     `json:"id"`
	UserFirst  vocabularyentity.Value `json:"userFirst"`
	UserSecond vocabularyentity.Value `json:"userSecond"`
	DBFirst    vocabularyentity.Value `json:"dbFirst"`
	DBSecond   vocabularyentity.Value `json:"dbSecond"`
}

type CorrectTest struct {
	Vocabs  []UserDBVocabs `json:"vocabs"`
	Correct int8           `json:"correct"`
}

func checkTest(w http.ResponseWriter, r *http.Request) {
	checkRequestBody, err := getCheckRequestFromBody(r)
	if err != nil {
		log.Println(err)
		return
	}
	correctVocabs, err := getVocabulariesFromDB(checkRequestBody)
	if err != nil {
		log.Println(err)
		return
	}
	correction := checkVocabularies(correctVocabs, checkRequestBody)
	w.Header().Set(utility.ContentType, utility.ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(correction); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
	}
}

func checkVocabularies(correctVocabs []vocabularyentity.Vocabulary, checkRequestBody CheckRequestBody) CorrectTest {
	userDBVocabs := make([]UserDBVocabs, 0, len(correctVocabs))
	correct := int8(0)
	for _, correctVocab := range correctVocabs {
		for _, vocab := range checkRequestBody.Vocabularies {
			if correctVocab.ID == vocab.ID {
				userFirstValue := vocab.GetValueByKey(checkRequestBody.SecondValueField)
				dbFirstValue := correctVocab.GetValueByKey(checkRequestBody.SecondValueField)
				userSecondValue := vocab.GetValueByKey(checkRequestBody.SecondValueField)
				dbSecondValue := correctVocab.GetValueByKey(checkRequestBody.SecondValueField)
				userDBVocabs = append(userDBVocabs, UserDBVocabs{ID: correctVocab.ID,
					DBFirst:    *dbFirstValue,
					DBSecond:   *dbSecondValue,
					UserFirst:  *userFirstValue,
					UserSecond: *userSecondValue})
				if userSecondValue.Value == dbSecondValue.Value {
					correct++
				}
				break
			}
		}
	}
	correction := CorrectTest{Vocabs: userDBVocabs, Correct: correct}
	return correction
}

func getCheckRequestFromBody(r *http.Request) (CheckRequestBody, error) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return CheckRequestBody{}, err
	}
	var checkRequestBody CheckRequestBody
	err = json.Unmarshal(reqBody, &checkRequestBody)
	return checkRequestBody, err
}

func getVocabulariesFromDB(checkRequestBody CheckRequestBody) ([]vocabularyentity.Vocabulary, error) {
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
		return
	}
	var testReqBody TestRequestBody
	if err = json.Unmarshal(reqBody, &testReqBody); err != nil {
		return
	}
	vocabs, err := vocabularyentity.GetRandomVocabularyByListIds(testReqBody.ListIDs, testReqBody.Limit)
	responseVocabularies := make([]vocabularyentity.Vocabulary, 0, len(vocabs))
	for _, vocab := range vocabs {
		secondValue := vocab.GetValueByKey(testReqBody.SecondValueField)
		if secondValue != nil {
			firstValue := vocab.GetValueByKey(testReqBody.FirstValueField)
			secondValue.Value = ""
			newValue := make([]vocabularyentity.Value, 0, 2)
			newValue = append(newValue, *firstValue)
			newValue = append(newValue, *secondValue)
			responseVocabularies = append(responseVocabularies,
				vocabularyentity.Vocabulary{ID: vocab.ID,
					ListID: vocab.ListID,
					Values: newValue})
		}
	}
	if err != nil {
		log.Println(err)
		return
	}
	sendVocabularies(w, responseVocabularies)
}

func insertVocab(w http.ResponseWriter, r *http.Request) {
	vocab, err := getVocabFromBody(r)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	if err = vocab.InsertVocab(); err != nil {
		switch err.(type) {
		case vocabularyentity.Error:
			w.WriteHeader(http.StatusBadRequest)
		default:
			w.WriteHeader(http.StatusInternalServerError)
		}
		log.Print(err)
		fmt.Fprint(w, err)
		return
	}
	sendVocabulary(w, vocab, http.StatusCreated)
}

func getVocab(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	vocabs, err := vocabularyentity.GetVocabularyByListID(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	sendVocabularies(w, vocabs)
}

func deleteVocab(w http.ResponseWriter, r *http.Request) {
	vocab, err := getVocabFromBody(r)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	if err = vocab.Delete(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
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
