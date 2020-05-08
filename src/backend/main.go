package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"github.com/afrima/japanese_learning_helper/src/backend/resource"
)

func main() {
	var dir string
	flag.StringVar(&dir, "dir", "./dist", "the directory to serve files from. Defaults to the current dir")
	flag.Parse()
	r := mux.NewRouter()
	resource.InitAuthorized(r)
	resource.InitLogin(r)
	resource.InitVocabularyResource(r)
	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir(dir))))
	err := http.ListenAndServe(":8080", handlers.CompressHandler(r))
	if err != nil {
		log.Fatal(err)
	}
}
