package main

import (
	"encoding/json"
	"github.com/afrima/japanese_learning_helper/src/backend/entity"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"net/http"
)

func insertVocab(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Print(err)
		return
	}
	var vocab entity.Vocab
	if err = json.Unmarshal(reqBody, &vocab); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Print(err)
		return
	}
	if err = vocab.InsertVocab(); err != nil {
		switch err.(type) {
		case entity.VocabErrors:
			w.WriteHeader(http.StatusBadRequest)
		default:
			w.WriteHeader(http.StatusInternalServerError)
		}
		log.Print(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err = json.NewEncoder(w).Encode(vocab); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print(err)
		return
	}
}

func getVocab(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(entity.GetVocabs()); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print(err)
	}
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/add", insertVocab).Methods(http.MethodPost)
	r.HandleFunc("/", getVocab).Methods(http.MethodGet)
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		log.Fatal(err)
	}
}
