package vocabularyservice_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/Afrima/vocabulary_learning_helper/src/backend/entity/vocabularyentity"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/service/vocabularyservice"
)

//Test CheckTest
func TestCheckTestAllVocabulariesAreCorrect(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies("apple", "hello", "apple")
	checkTestRequest := vocabularyservice.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := vocabularyservice.CheckTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(2), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

func TestCheckTestOneVocabularyIsIncorrect(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies("apple", "hello", "aple")
	checkTestRequest := vocabularyservice.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := vocabularyservice.CheckTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(1), "The amount of correct vocabulary is not correct. Expected 1 is %d", result.Correct)
}

func TestCheckTestIgnoreSpace(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies(" apple ", " hello ", "apple")
	checkTestRequest := vocabularyservice.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := vocabularyservice.CheckTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(2), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

func TestCheckTestIgnoreCaseSensitive(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies("apple", "HeLlO", "ApPlE")
	checkTestRequest := vocabularyservice.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := vocabularyservice.CheckTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(2), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

func TestCheckTestWithIncorrectField(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies("apple", "HeLlO", "ApPlE")
	checkTestRequest := vocabularyservice.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "NotFound",
		Vocabularies:     userVocabs}
	_, err := vocabularyservice.CheckTest(correctVocabs, checkTestRequest)
	assert.NotNilf(t, err, "No error should be thrown: %s", err)
}

func getTestVocabularies(secondCorrect string,
	firstUser string,
	secondUser string) ([]vocabularyentity.Vocabulary, []vocabularyentity.Vocabulary) {
	id1, _ := primitive.ObjectIDFromHex("5ec80d44d924e9da35ecb4d2")
	id2, _ := primitive.ObjectIDFromHex("5ec80d44d924e9da35ecb4d3")
	correctVocabs := make([]vocabularyentity.Vocabulary, 0, 2)
	correctVocabs = append(correctVocabs, vocabularyentity.Vocabulary{
		ID: id1,
		Values: []vocabularyentity.Value{
			{Key: "German", Value: "Hallo"},
			{Key: "English", Value: "hello"},
		},
	})
	correctVocabs = append(correctVocabs, vocabularyentity.Vocabulary{
		ID: id2,
		Values: []vocabularyentity.Value{
			{Key: "German", Value: "Apfel"},
			{Key: "English", Value: secondCorrect},
		},
	})
	userVocabs := make([]vocabularyentity.Vocabulary, 0, 2)
	userVocabs = append(userVocabs, vocabularyentity.Vocabulary{
		ID: id1,
		Values: []vocabularyentity.Value{
			{Key: "German", Value: "Hallo"},
			{Key: "English", Value: firstUser},
		},
	})
	userVocabs = append(userVocabs, vocabularyentity.Vocabulary{
		ID: id2,
		Values: []vocabularyentity.Value{
			{Key: "German", Value: "Apfel"},
			{Key: "English", Value: secondUser},
		},
	})
	return correctVocabs, userVocabs
}
