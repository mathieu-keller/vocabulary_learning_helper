package main

import (
	"flag"
	"github.com/afrima/japanese_learning_helper/src/backend/resource"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func main() {
	var dir string
	flag.StringVar(&dir, "dir", "./dist", "the directory to serve files from. Defaults to the current dir")
	flag.Parse()
	r := mux.NewRouter()
	resource.InitVocabularyResource(r)
	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir(dir))))
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		log.Fatal(err)
	}
}
