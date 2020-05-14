package resource

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/afrima/japanese_learning_helper/src/backend/entity/vocabulary"
)

const (
	ContentType     = "Content-Type"
	ContentTypeJSON = "application/json"
)

func InitVocabularyResource(r *mux.Router) {
	const path = "/vocabulary"
	r.Handle(path, isAuthorized(insertVocab)).Methods(http.MethodPost)
	r.Handle(path+"/{id}", isAuthorized(getVocab)).Methods(http.MethodGet)
	r.Handle(path, isAuthorized(deleteVocab)).Methods(http.MethodDelete)
	r.HandleFunc("/generate-test", generateTest).Methods(http.MethodPost)
	r.HandleFunc("/check-test", checkTest).Methods(http.MethodPost)
}

type TestRequestBody struct {
	ListIDs []primitive.ObjectID `json:"listIds"`
	Limit   int8                 `json:"limit"`
}

type UserDBVocabs struct {
	ID           primitive.ObjectID `json:"id"`
	UserJapanese string             `json:"userJapanese"`
	UserGerman   string             `json:"userGerman"`
	DBJapanese   string             `json:"dbJapanese"`
	DBGerman     string             `json:"dbGerman"`
}

type CorrectTest struct {
	Vocabs  []UserDBVocabs `json:"vocabs"`
	Correct int8           `json:"correct"`
}

func checkTest(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		return
	}
	var vocabs []vocabulary.Vocab
	if err = json.Unmarshal(reqBody, &vocabs); err != nil {
		log.Println(err)
		return
	}
	vocabularyIds := make([]primitive.ObjectID, 0, len(vocabs))
	for _, vocab := range vocabs {
		vocabularyIds = append(vocabularyIds, vocab.ID)
	}
	correctVocabs, err := vocabulary.GetVocabularyByIDs(vocabularyIds)
	if err != nil {
		log.Println(err)
		return
	}
	userDBVocabs := make([]UserDBVocabs, 0, len(correctVocabs))
	correct := int8(0)
correct:
	for _, correctVocab := range correctVocabs {
		for _, vocab := range vocabs {
			if correctVocab.ID == vocab.ID {
				userDBVocabs = append(userDBVocabs, UserDBVocabs{ID: correctVocab.ID, DBGerman: correctVocab.German, DBJapanese: correctVocab.Japanese, UserGerman: vocab.German, UserJapanese: vocab.Japanese})
				if correctVocab.Japanese == vocab.Japanese {
					correct++
				}
				continue correct
			}
		}
	}
	correction := CorrectTest{Vocabs: userDBVocabs, Correct: correct}
	w.Header().Set(ContentType, ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(correction); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
	}
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
	vocabs, err := vocabulary.GetRandomVocabularyByListIds(testReqBody.ListIDs, testReqBody.Limit)
	vocabs2 := make([]vocabulary.Vocab, 0, len(vocabs))
	for _, vocab := range vocabs {
		vocab.Japanese = ""
		vocabs2 = append(vocabs2, vocab)
	}
	if err != nil {
		log.Println(err)
		return
	}
	sendVocabularies(w, vocabs2)
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
		case vocabulary.VocabErrors:
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
	vocabs, err := vocabulary.GetVocabularyByListID(id)
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

func getVocabFromBody(r *http.Request) (vocabulary.Vocab, error) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return vocabulary.Vocab{}, err
	}
	var vocab vocabulary.Vocab
	if err = json.Unmarshal(reqBody, &vocab); err != nil {
		return vocabulary.Vocab{}, err
	}
	return vocab, nil
}

func sendVocabularies(w http.ResponseWriter, vocabs []vocabulary.Vocab) {
	w.Header().Set(ContentType, ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(vocabs); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
	}
}

func sendVocabulary(w http.ResponseWriter, vocabs vocabulary.Vocab, statusCode int) {
	w.Header().Set(ContentType, ContentTypeJSON)
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(vocabs); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
	}
}
