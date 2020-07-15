package importer

import (
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"testing"
)

//Test checkColumns
func TestCheckColumnsTheCategoryColumnsHaveADifferentLengthThenTheCsvColumns(t *testing.T) {
	err := checkColumns([]string{"test1"}, []string{"test1", "test2"})
	assert.NotNilf(t, err, "error must be thrown")
}

//Test checkColumns
func Test_CheckColumns_the_category_columns_have_one_different_column_then_the_csv_columns(t *testing.T) {
	err := checkColumns([]string{"test1", "test2", "test3", "test4"}, []string{"test1", "test2", "test3", "test5"})
	assert.NotNilf(t, err, "error must be thrown")
}

//Test checkColumns
func Test_CheckColumns_the_category_columns_and_the_csv_columns_are_the_same(t *testing.T) {
	err := checkColumns([]string{"test1", "test2", "test3", "test4"}, []string{"test1", "test2", "test3", "test4"})
	assert.Nilf(t, err, "No error should be thrown: %s", err)
}

//Test generateVocabularies
func Test_generateVocabularies(t *testing.T) {
	csvData := [][]string{
		{"header1", "header2"},
		{"vocab1,vocab2", "meaning1,meaning2,meaning3"},
	}
	columns := csvData[0]
	listID := primitive.NewObjectID()
	vocabularies := generateVocabularies(csvData, columns, listID)
	assert.Equalf(t, len(vocabularies), 1, "length must be one")
	assert.NotNilf(t, vocabularies[0].ID, "vocabulary id must be set")
	assert.Equalf(t, vocabularies[0].ListID, listID, "list id must be the given list id")
	assert.Equalf(t, len(vocabularies[0].Values), 2, "must be 2 because we have 2 columns")
	assert.Equalf(t, vocabularies[0].Values[0].Key, "header1", "key must be header1 because that is the name of the first column")
	assert.Equalf(t, vocabularies[0].Values[0].Values, []string{"vocab1", "vocab2"}, "the values must be vocab1 and vocab2 as array")
	assert.Equalf(t, vocabularies[0].Values[1].Key, "header2", "key must be header2 because that is the name of the second column")
	assert.Equalf(t, vocabularies[0].Values[1].Values, []string{"meaning1", "meaning2", "meaning3"}, "the values must be meaning1, meaning2 and meaning3 as array")
}
