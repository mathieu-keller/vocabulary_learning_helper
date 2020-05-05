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

func InitVocabularyResource(r *mux.Router) {
	r.Handle("/vocab", isAuthorized(insertVocab, "")).Methods(http.MethodPost)
	r.Handle("/vocab", isAuthorized(getVocab, "")).Methods(http.MethodGet)
	r.Handle("/vocab", isAuthorized(deleteVocab, "")).Methods(http.MethodDelete)
}

func insertVocab(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	var vocab vocabulary.Vocab
	if err = json.Unmarshal(reqBody, &vocab); err != nil {
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
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err = json.NewEncoder(w).Encode(vocab); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
}

func getVocab(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	vocabs, err := vocabulary.GetVocabs()
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
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	var vocab vocabulary.Vocab
	if err = json.Unmarshal(reqBody, &vocab); err != nil || vocab.Id.IsZero() {
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
	w.Header().Set("Content-Type", "application/text")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(vocab.Id); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
}
