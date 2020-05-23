package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource/categoryresource"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource/loginresource"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource/vocabularylistresource"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource/vocabularyresource"
)

func main() {
	var dir string
	flag.StringVar(&dir, "dir", "./dist", "the directory to serve files from. Defaults to the current dir")
	flag.Parse()
	r := mux.NewRouter()
	resource.Init(r)
	loginresource.Init(r)
	categoryresource.Init(r)
	vocabularyresource.Init(r)
	vocabularylistresource.Init(r)
	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir(dir))))
	err := http.ListenAndServe(":8080", handlers.CompressHandler(r))
	if err != nil {
		log.Fatal(err)
	}
}
