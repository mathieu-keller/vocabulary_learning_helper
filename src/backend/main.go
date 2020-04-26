package main

import (
	"encoding/json"
	"flag"
	"fmt"
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
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	var vocab entity.Vocab
	if err = json.Unmarshal(reqBody, &vocab); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
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
	if err := json.NewEncoder(w).Encode(entity.GetVocabs()); err != nil {
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
	var vocab entity.Vocab
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

func main() {
	var dir string
	flag.StringVar(&dir, "dir", "./dist", "the directory to serve files from. Defaults to the current dir")
	flag.Parse()
	r := mux.NewRouter()
	r.HandleFunc("/vocab", insertVocab).Methods(http.MethodPost)
	r.HandleFunc("/vocab", getVocab).Methods(http.MethodGet)
	r.HandleFunc("/vocab", deleteVocab).Methods(http.MethodDelete)
	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir(dir))))
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		log.Fatal(err)
	}
}
