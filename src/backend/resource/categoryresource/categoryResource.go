package categoryresource

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/afrima/japanese_learning_helper/src/backend/entity/categoryentity"
	"github.com/afrima/japanese_learning_helper/src/backend/resource"
	"github.com/afrima/japanese_learning_helper/src/backend/utility"
)

func Init(r *mux.Router) {
	const path = "/category"
	r.HandleFunc(path, get).Methods(http.MethodGet)
	r.HandleFunc(path, insert).Methods(http.MethodPost)
	r.Handle(path, resource.IsAuthorized(deleteCategory)).Methods(http.MethodDelete)
}

func get(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set(utility.ContentType, utility.ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	vocabularyList, err := categoryentity.GetCategory()
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

func insert(w http.ResponseWriter, r *http.Request) {
	body, err := getCategoryFromBody(r)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	if err = body.Insert(); err != nil {
		switch err.(type) {
		case categoryentity.Error:
			w.WriteHeader(http.StatusBadRequest)
		default:
			w.WriteHeader(http.StatusInternalServerError)
		}
		log.Print(err)
		fmt.Fprint(w, err)
		return
	}

	w.Header().Set(utility.ContentType, utility.ContentTypeJSON)
	w.WriteHeader(http.StatusCreated)
	if err = json.NewEncoder(w).Encode(body); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
}

func deleteCategory(w http.ResponseWriter, r *http.Request) {
	body, err := getCategoryFromBody(r)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	if err = body.Delete(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	w.Header().Set(utility.ContentType, utility.ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(body); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
}

func getCategoryFromBody(r *http.Request) (categoryentity.Category, error) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return categoryentity.Category{}, err
	}
	var returnValue categoryentity.Category
	if err = json.Unmarshal(reqBody, &returnValue); err != nil {
		return categoryentity.Category{}, err
	}
	return returnValue, nil
}
