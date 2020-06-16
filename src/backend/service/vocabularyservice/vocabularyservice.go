package vocabularyservice

import (
	"errors"
	"log"
	"strings"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/Afrima/vocabulary_learning_helper/src/backend/entity/vocabularyentity"
)

type GenerateTestRequest struct {
	ListIDs          []primitive.ObjectID `json:"listIds"`
	Limit            int8                 `json:"limit"`
	FirstValueField  string               `json:"firstValueField"`
	SecondValueField string               `json:"secondValueField"`
}

type UserDBVocabs struct {
	ID         primitive.ObjectID      `json:"id"`
	UserFirst  vocabularyentity.Values `json:"userFirst"`
	UserSecond vocabularyentity.Values `json:"userSecond"`
	DBFirst    vocabularyentity.Values `json:"dbFirst"`
	DBSecond   vocabularyentity.Values `json:"dbSecond"`
}

type TestResult struct {
	Vocabs  []UserDBVocabs `json:"vocabs"`
	Correct int8           `json:"correct"`
}

type CheckTestRequest struct {
	Vocabularies     []vocabularyentity.Vocabulary `json:"vocabularies"`
	FirstValueField  string                        `json:"firstValueField"`
	SecondValueField string                        `json:"secondValueField"`
}

func GenerateTest(testReqBody GenerateTestRequest) ([]vocabularyentity.Vocabulary, error) {
	vocabs, err := vocabularyentity.GetRandomVocabularyByListIds(testReqBody.ListIDs, testReqBody.Limit)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	responseVocabularies := make([]vocabularyentity.Vocabulary, 0, len(vocabs))
	for _, vocab := range vocabs {
		secondValue := vocab.GetValueByKey(testReqBody.SecondValueField)
		if secondValue.Key != "" {
			firstValue := vocab.GetValueByKey(testReqBody.FirstValueField)
			secondValue.Values = nil
			newValue := make([]vocabularyentity.Values, 0, 2)
			newValue = append(newValue, firstValue)
			newValue = append(newValue, secondValue)
			responseVocabularies = append(responseVocabularies,
				vocabularyentity.Vocabulary{ID: vocab.ID,
					ListID: vocab.ListID,
					Values: newValue})
		}
	}
	return responseVocabularies, nil
}

func checkIfVocabEquals(vocab string, values []string) bool {
	for _, dbValue := range values {
		if strings.EqualFold(strings.TrimSpace(vocab), strings.TrimSpace(dbValue)) {
			return true
		}
	}
	return false
}

func getUserDBVocab(firstValueKey string, secondValueKey string, userVocab vocabularyentity.Vocabulary,
	dbVocab vocabularyentity.Vocabulary) (UserDBVocabs, error) {
	userDBVocab := UserDBVocabs{ID: dbVocab.ID,
		DBFirst:    dbVocab.GetValueByKey(firstValueKey),
		DBSecond:   dbVocab.GetValueByKey(secondValueKey),
		UserFirst:  userVocab.GetValueByKey(firstValueKey),
		UserSecond: userVocab.GetValueByKey(secondValueKey)}
	if userDBVocab.UserSecond.Key == "" || userDBVocab.DBSecond.Key == "" || userDBVocab.DBFirst.Key == "" || userDBVocab.UserFirst.Key == "" {
		return UserDBVocabs{}, errors.New("one field does not exist")
	}
	return userDBVocab, nil
}

func CheckTest(correctVocabs []vocabularyentity.Vocabulary, checkRequestBody CheckTestRequest) (TestResult, error) {
	correct := int8(0)
	correctVocabMap := make(map[primitive.ObjectID]vocabularyentity.Vocabulary, len(correctVocabs))
	for _, correctVocab := range correctVocabs {
		correctVocabMap[correctVocab.ID] = correctVocab
	}
	userDBVocabs := make([]UserDBVocabs, 0, len(correctVocabs))
	for _, vocab := range checkRequestBody.Vocabularies {
		correctVocab := correctVocabMap[vocab.ID]
		userDBVocab, err := getUserDBVocab(checkRequestBody.FirstValueField, checkRequestBody.SecondValueField, vocab, correctVocab)
		if err != nil {
			return TestResult{}, err
		}
		valueCorrect := false
		for _, userValue := range userDBVocab.UserSecond.Values {
			if valueCorrect = checkIfVocabEquals(userValue, userDBVocab.DBSecond.Values); !valueCorrect {
				break
			}
		}
		if valueCorrect {
			correct++
		}
		userDBVocabs = append(userDBVocabs, userDBVocab)
	}
	correction := TestResult{Vocabs: userDBVocabs, Correct: correct}
	return correction, nil
}
