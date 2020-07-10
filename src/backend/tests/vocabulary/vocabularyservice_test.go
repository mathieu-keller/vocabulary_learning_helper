package vocabulary_test

import (
	"github.com/afrima/vocabulary_learning_helper/src/backend/vocabulary"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//Test CheckTest
func TestCheckTestAllVocabulariesAreCorrect(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple"}, []string{"hello"}, []string{"apple"})
	checkTestRequest := vocabulary.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := vocabulary.CheckTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(2), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

//Test CheckTest
func TestCheckTestAllVocabulariesAreIncorrectBecauseTheyAreEmpty(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple"}, []string{}, []string{})
	checkTestRequest := vocabulary.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := vocabulary.CheckTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(0), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

func TestCheckTestOneVocabularyIsIncorrect(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple"}, []string{"hello"}, []string{"aple"})
	checkTestRequest := vocabulary.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := vocabulary.CheckTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(1), "The amount of correct vocabulary is not correct. Expected 1 is %d", result.Correct)
}

func TestCheckTestIgnoreSpace(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{" apple "}, []string{" hello "}, []string{"apple"})
	checkTestRequest := vocabulary.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := vocabulary.CheckTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(2), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

func TestCheckTestIgnoreCaseSensitive(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple"}, []string{"HeLlO"}, []string{"ApPlE"})
	checkTestRequest := vocabulary.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := vocabulary.CheckTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(2), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

func TestCheckTestWithIncorrectField(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple"}, []string{"HeLlO"}, []string{"ApPlE"})
	checkTestRequest := vocabulary.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "NotFound",
		Vocabularies:     userVocabs}
	_, err := vocabulary.CheckTest(correctVocabs, checkTestRequest)
	assert.NotNilf(t, err, "No error should be thrown: %s", err)
}

func TestCheckTestWithMoreFieldAndAllCorrect(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple", "burger"}, []string{"hello"}, []string{"burger", "apple"})
	checkTestRequest := vocabulary.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := vocabulary.CheckTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(2), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

func TestCheckTestWithMoreFieldAndOneIsIncorrect(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple", "burger"}, []string{"hello"}, []string{"hotdog", "apple"})
	checkTestRequest := vocabulary.CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := vocabulary.CheckTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(1), "The amount of correct vocabulary is not correct. Expected 1 is %d", result.Correct)
}

func getTestVocabularies(secondCorrect []string,
	firstUser []string,
	secondUser []string) ([]vocabulary.Vocabulary, []vocabulary.Vocabulary) {
	id1, _ := primitive.ObjectIDFromHex("5ec80d44d924e9da35ecb4d2")
	id2, _ := primitive.ObjectIDFromHex("5ec80d44d924e9da35ecb4d3")
	correctVocabs := make([]vocabulary.Vocabulary, 0, 2)
	correctVocabs = append(correctVocabs, vocabulary.Vocabulary{
		ID: id1,
		Values: []vocabulary.Values{
			{Key: "German", Values: []string{"Hallo"}},
			{Key: "English", Values: []string{"hello"}},
		},
	})
	correctVocabs = append(correctVocabs, vocabulary.Vocabulary{
		ID: id2,
		Values: []vocabulary.Values{
			{Key: "German", Values: []string{"Apfel"}},
			{Key: "English", Values: secondCorrect},
		},
	})
	userVocabs := make([]vocabulary.Vocabulary, 0, 2)
	userVocabs = append(userVocabs, vocabulary.Vocabulary{
		ID: id1,
		Values: []vocabulary.Values{
			{Key: "German", Values: []string{"Hallo"}},
			{Key: "English", Values: firstUser},
		},
	})
	userVocabs = append(userVocabs, vocabulary.Vocabulary{
		ID: id2,
		Values: []vocabulary.Values{
			{Key: "German", Values: []string{"Apfel"}},
			{Key: "English", Values: secondUser},
		},
	})
	return correctVocabs, userVocabs
}
