package resource

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/afrima/japanese_learning_helper/src/backend/entity/vocabulary"
	"github.com/afrima/japanese_learning_helper/src/backend/entity/vocabularylist"
)

func InitVocabularyListResource(r *mux.Router) {
	const path = "/vocabulary-list"
	r.HandleFunc(path, getVocabularyList).Methods(http.MethodGet)
	r.Handle(path, isAuthorized(insertVocabularyList)).Methods(http.MethodPost)
	r.Handle(path, isAuthorized(deleteVocabularyList)).Methods(http.MethodDelete)
}

func getVocabularyList(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set(ContentType, ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	vocabularyList, err := vocabularylist.GetVocabularyList()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	if err = json.NewEncoder(w).Encode(vocabularyList); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
	}
}

func insertVocabularyList(w http.ResponseWriter, r *http.Request) {
	vocabularyList, err := getVocabularyListFromBody(r)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	if err = vocabularyList.Insert(); err != nil {
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

	w.Header().Set(ContentType, ContentTypeJSON)
	w.WriteHeader(http.StatusCreated)
	if err = json.NewEncoder(w).Encode(vocabularyList); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
}

func deleteVocabularyList(w http.ResponseWriter, r *http.Request) {
	vocabularyList, err := getVocabularyListFromBody(r)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	if err = vocabularyList.Delete(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	w.Header().Set(ContentType, ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(vocabularyList); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
}

func getVocabularyListFromBody(r *http.Request) (vocabularylist.VocabularyList, error) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return vocabularylist.VocabularyList{}, err
	}
	var vocab vocabularylist.VocabularyList
	if err = json.Unmarshal(reqBody, &vocab); err != nil {
		return vocabularylist.VocabularyList{}, err
	}
	return vocab, nil
}
