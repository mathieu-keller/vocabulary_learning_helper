package vocabulary

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//Test checkTest
func TestCheckTestAllVocabulariesAreCorrect(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple"}, []string{"hello"}, []string{"apple"})
	checkTestRequest := CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := checkTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(2), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

//Test checkTest
func TestCheckTestAllVocabulariesAreIncorrectBecauseTheyAreEmpty(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple"}, []string{}, []string{})
	checkTestRequest := CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := checkTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(0), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

func TestCheckTestOneVocabularyIsIncorrect(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple"}, []string{"hello"}, []string{"aple"})
	checkTestRequest := CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := checkTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(1), "The amount of correct vocabulary is not correct. Expected 1 is %d", result.Correct)
}

func TestCheckTestIgnoreSpace(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{" apple "}, []string{" hello "}, []string{"apple"})
	checkTestRequest := CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := checkTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(2), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

func TestCheckTestIgnoreCaseSensitive(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple"}, []string{"HeLlO"}, []string{"ApPlE"})
	checkTestRequest := CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := checkTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(2), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

func TestCheckTestWithIncorrectField(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple"}, []string{"HeLlO"}, []string{"ApPlE"})
	checkTestRequest := CheckTestRequest{FirstValueField: "German",
		SecondValueField: "NotFound",
		Vocabularies:     userVocabs}
	_, err := checkTest(correctVocabs, checkTestRequest)
	assert.NotNilf(t, err, "No error should be thrown: %s", err)
}

func TestCheckTestWithMoreFieldAndAllCorrect(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple", "burger"}, []string{"hello"}, []string{"burger", "apple"})
	checkTestRequest := CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := checkTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(2), "The amount of correct vocabulary is not correct. Expected 2 is %d", result.Correct)
}

func TestCheckTestWithMoreFieldAndOneIsIncorrect(t *testing.T) {
	correctVocabs, userVocabs := getTestVocabularies([]string{"apple", "burger"}, []string{"hello"}, []string{"hotdog", "apple"})
	checkTestRequest := CheckTestRequest{FirstValueField: "German",
		SecondValueField: "English",
		Vocabularies:     userVocabs}
	result, err := checkTest(correctVocabs, checkTestRequest)
	assert.Nilf(t, err, "No error should be thrown: %s", err)
	assert.Equalf(t, result.Correct, int8(1), "The amount of correct vocabulary is not correct. Expected 1 is %d", result.Correct)
}

func getTestVocabularies(secondCorrect []string,
	firstUser []string,
	secondUser []string) ([]Vocabulary, []Vocabulary) {
	id1, _ := primitive.ObjectIDFromHex("5ec80d44d924e9da35ecb4d2")
	id2, _ := primitive.ObjectIDFromHex("5ec80d44d924e9da35ecb4d3")
	correctVocabs := make([]Vocabulary, 0, 2)
	correctVocabs = append(correctVocabs, Vocabulary{
		ID: id1,
		Values: []Values{
			{Key: "German", Values: []string{"Hallo"}},
			{Key: "English", Values: []string{"hello"}},
		},
	})
	correctVocabs = append(correctVocabs, Vocabulary{
		ID: id2,
		Values: []Values{
			{Key: "German", Values: []string{"Apfel"}},
			{Key: "English", Values: secondCorrect},
		},
	})
	userVocabs := make([]Vocabulary, 0, 2)
	userVocabs = append(userVocabs, Vocabulary{
		ID: id1,
		Values: []Values{
			{Key: "German", Values: []string{"Hallo"}},
			{Key: "English", Values: firstUser},
		},
	})
	userVocabs = append(userVocabs, Vocabulary{
		ID: id2,
		Values: []Values{
			{Key: "German", Values: []string{"Apfel"}},
			{Key: "English", Values: secondUser},
		},
	})
	return correctVocabs, userVocabs
}

func TestBuildTestResponse(t *testing.T) {
	vocabs := []Vocabulary{
		{
			ID:     primitive.NewObjectID(),
			ListID: primitive.NewObjectID(),
			Values: []Values{{
				Key:    "field 1",
				Values: []string{"value 1"},
			}, {
				Key:    "field 2",
				Values: []string{"value 2"},
			}},
		},
	}
	response := buildTestResponse(vocabs, "field 1", "field 2")
	assert.Equalf(t, 1, len(response), "Must be one because only one vocab was given")
	assert.Equalf(t, 2, len(response[0].Values), "Must be two because one question + one answer")
	assert.Equalf(t, "field 1", response[0].Values[0].Key, "Must be field 1 because that is the name of the question")
	assert.Equalf(t, []string{"value 1"}, response[0].Values[0].Values, "Must be array with on value \"value1\"")
	assert.Equalf(t, "field 2", response[0].Values[1].Key, "Must be field 2 because that is the name of the question")
	assert.Equalf(t, 0, len(response[0].Values[1].Values), "Must must be zero because the answer must be filled from the user")

}
