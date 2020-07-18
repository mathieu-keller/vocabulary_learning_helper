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

func importCsv(rCategoryID string, rListID string, listName string, rFile *multipart.FileHeader, userName string, columnSeparator string, vocabSeparator string) error {
	category, err := category.GetCategoryByID(rCategoryID)
	if err != nil {
		log.Print(err.Error())
		return err
	}
	listID, err := createOrGetVocabularyListId(rListID, category, listName, userName)
	if err != nil {
		return err
	}
	csvData, err := getCsvData(rFile, columnSeparator)
	if err != nil {
		return err
	}
	columns := csvData[0]
	if err = checkColumns(columns, category.Columns); err != nil {
		return err
	}
	vocabularies := generateVocabularies(csvData, columns, listID, vocabSeparator)
	vocabulary.InsertVocabularies(vocabularies)
	return nil
}

func generateVocabularies(csvData [][]string, columns []string, listID primitive.ObjectID, separator string) []vocabulary.Vocabulary {
	vocabularies := make([]vocabulary.Vocabulary, 0, len(csvData)-1)
	for _, data := range csvData[1:] {
		values := make([]vocabulary.Values, len(columns))
		for i, column := range columns {
			if separator == "" {
				values[i] = vocabulary.Values{Key: column, Values: []string{data[i]}}
				continue
			}
			values[i] = vocabulary.Values{Key: column, Values: strings.Split(data[i], separator)}
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

func getCsvData(rFile *multipart.FileHeader, separator string) ([][]string, error) {
	if len(separator) > 1 {
		return nil, Error{ErrorText: "only on char separator is allowed"}
	}
	file, err := rFile.Open()
	if err != nil {
		return nil, Error{ErrorText: "file format error"}
	}
	defer file.Close()
	reader := csv.NewReader(bufio.NewReader(file))
	if separator != "" {
		reader.Comma = rune(separator[0])
	}
	csvData, err := reader.ReadAll()
	return csvData, nil
}

func createOrGetVocabularyListId(rListID string, category category.Category, listName string, userName string) (primitive.ObjectID, error) {
	var listID primitive.ObjectID
	var err error
	if rListID == "" {
		list := vocabularylist.VocabularyList{ID: primitive.NewObjectID(), CategoryID: category.ID, Name: listName, Owner: strings.ToLower(userName)}
		if err = list.Insert(); err != nil {
			return [12]byte{}, err
		}
		listID = list.ID
	} else {
		listID, err = primitive.ObjectIDFromHex(rListID)
	}
	return listID, err
}
