package vocabularylistresource

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"

	"github.com/afrima/vocabulary_learning_helper/src/backend/entity/vocabularylistentity"
	"github.com/afrima/vocabulary_learning_helper/src/backend/resource"
	"github.com/afrima/vocabulary_learning_helper/src/backend/utility"
)

func Init(r *mux.Router) {
	const path = "/vocabulary-list"
	r.HandleFunc(path+"/{id}", getVocabularyList).Methods(http.MethodGet)
	r.HandleFunc(path, insertVocabularyList).Methods(http.MethodPost)
	r.Handle(path+"/{id}", resource.IsAuthorized(deleteVocabularyList)).Methods(http.MethodDelete)
}

func getVocabularyList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set(utility.ContentType, utility.ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	id := mux.Vars(r)["id"]
	vocabularyList, err := vocabularylistentity.GetVocabularyList(id)
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
	claims, _ := resource.GetTokenClaims(r)
	vocabularyList.Owner = strings.ToLower(claims["userName"].(string))
	if err = vocabularyList.Insert(); err != nil {
		switch err.(type) {
		case vocabularylistentity.Error:
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
	if err = json.NewEncoder(w).Encode(vocabularyList); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
}

func deleteVocabularyList(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	if err := vocabularylistentity.Delete(id); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	w.Header().Set(utility.ContentType, utility.ContentTypeJSON)
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(id); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
}

func getVocabularyListFromBody(r *http.Request) (vocabularylistentity.VocabularyList, error) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return vocabularylistentity.VocabularyList{}, err
	}
	var vocab vocabularylistentity.VocabularyList
	if err = json.Unmarshal(reqBody, &vocab); err != nil {
		return vocabularylistentity.VocabularyList{}, err
	}
	return vocab, nil
}
