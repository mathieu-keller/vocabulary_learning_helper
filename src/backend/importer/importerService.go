package importer

import (
	"bufio"
	"encoding/csv"
	"github.com/afrima/vocabulary_learning_helper/src/backend/category"
	"github.com/afrima/vocabulary_learning_helper/src/backend/utility"
	"github.com/afrima/vocabulary_learning_helper/src/backend/vocabulary"
	"github.com/afrima/vocabulary_learning_helper/src/backend/vocabulary/vocabularylist"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"log"
	"mime/multipart"
	"strings"
)

type Error struct {
	ErrorText string
}

func (error Error) Error() string {
	return error.ErrorText
}

func importCsv(rCategoryID string,rListID string, listName string, rFile *multipart.FileHeader, userName string) error {
	category, err := category.GetCategoryByID(rCategoryID)
	if err != nil {
		log.Print(err.Error())
		return err
	}
	listID := createOrGetVocabularyListId(rListID, category, listName, userName)
	csvData, err := getCsvData(rFile)
	if err != nil {
		return err
	}
	columns := csvData[0]
	if err = checkColumns(columns, category.Columns); err != nil {
		return err
	}
	vocabularies := generateVocabularies(csvData, columns, listID)
	vocabulary.InsertVocabularies(vocabularies)
	return nil
}

func generateVocabularies(csvData [][]string, columns []string, listID primitive.ObjectID) []vocabulary.Vocabulary {
	vocabularies := make([]vocabulary.Vocabulary, 0, len(csvData)-1)
	for _, data := range csvData[1:] {
		values := make([]vocabulary.Values, len(columns))
		for i, column := range columns {
			values[i] = vocabulary.Values{Key: column, Values: strings.Split(data[i], ",")}
		}
		vocabularies = append(vocabularies, vocabulary.Vocabulary{
			ID:     primitive.NewObjectID(),
			ListID: listID,
			Values: values,
		})
	}
	return vocabularies
}

func checkColumns(columns []string, categoryColumns []string) error {
	if len(columns) != len(categoryColumns) {
		return Error{ErrorText: "csv columns and category columns are not equal"}
	}
	columnsToCheck := make([]string, len(columns))
	copy(columnsToCheck, columns)
	for _, catColumn := range categoryColumns {
		for i, column := range columnsToCheck {
			if column == catColumn {
				columnsToCheck = utility.RemoveArrayElement(columnsToCheck, i)
				break
			}
		}
	}
	if len(columnsToCheck) != 0 {
		return Error{ErrorText: "csv columns and category columns are not equal"}
	}
	return nil
}

func getCsvData(rFile *multipart.FileHeader) ([][]string, error) {
	file, err := rFile.Open()
	if err != nil {
		return nil, Error{ErrorText: "file format error"}
	}
	defer file.Close()
	reader := csv.NewReader(bufio.NewReader(file))
	reader.Comma = ';'
	csvData, err := reader.ReadAll()
	return csvData, nil
}

func createOrGetVocabularyListId(rListID string, category category.Category, listName string, userName string) primitive.ObjectID {
	var listID primitive.ObjectID
	if rListID == "" {
		list := vocabularylist.VocabularyList{ID: primitive.NewObjectID(), CategoryID: category.ID, Name: listName, Owner: strings.ToLower(userName)}
		list.Insert()
		listID = list.ID
	} else {
		listID, _ = primitive.ObjectIDFromHex(rListID)
	}
	return listID
}
