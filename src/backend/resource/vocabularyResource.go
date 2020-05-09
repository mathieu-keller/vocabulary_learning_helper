package resource

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"

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

	w.Header().Set(ContentType, ContentTypeJSON)
	w.WriteHeader(http.StatusCreated)
	if err = json.NewEncoder(w).Encode(vocab); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
}

func getVocab(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	w.Header().Set(ContentType, ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	vocabs, err := vocabulary.GetVocabs(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	if err = json.NewEncoder(w).Encode(vocabs); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
	}
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
	w.Header().Set(ContentType, ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(vocab); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
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
