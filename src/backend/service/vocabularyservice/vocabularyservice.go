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
		if secondValue != nil {
			firstValue := vocab.GetValueByKey(testReqBody.FirstValueField)
			secondValue.Values = nil
			newValue := make([]vocabularyentity.Values, 0, 2)
			newValue = append(newValue, *firstValue)
			newValue = append(newValue, *secondValue)
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

func CheckTest(correctVocabs []vocabularyentity.Vocabulary, checkRequestBody CheckTestRequest) (TestResult, error) {
	userDBVocabs := make([]UserDBVocabs, 0, len(correctVocabs))
	correct := int8(0)
	for _, correctVocab := range correctVocabs {
		for _, vocab := range checkRequestBody.Vocabularies {
			if correctVocab.ID == vocab.ID {
				userFirstValue := vocab.GetValueByKey(checkRequestBody.FirstValueField)
				dbFirstValue := correctVocab.GetValueByKey(checkRequestBody.FirstValueField)
				userSecondValue := vocab.GetValueByKey(checkRequestBody.SecondValueField)
				dbSecondValue := correctVocab.GetValueByKey(checkRequestBody.SecondValueField)
				if userFirstValue == nil || dbFirstValue == nil || userSecondValue == nil || dbSecondValue == nil {
					return TestResult{}, errors.New("one field does not exist")
				}
				userDBVocabs = append(userDBVocabs, UserDBVocabs{ID: correctVocab.ID,
					DBFirst:    *dbFirstValue,
					DBSecond:   *dbSecondValue,
					UserFirst:  *userFirstValue,
					UserSecond: *userSecondValue})
				valueCorrect := true
				for _, userValue := range userSecondValue.Values {
					if valueCorrect = checkIfVocabEquals(userValue, dbSecondValue.Values); !valueCorrect {
						break
					}
				}
				if valueCorrect {
					correct++
				}
				break
			}
		}
	}
	correction := TestResult{Vocabs: userDBVocabs, Correct: correct}
	return correction, nil
}
