package vocabularyservice

import (
	"log"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/afrima/japanese_learning_helper/src/backend/entity/vocabularyentity"
)

type GenerateTestRequest struct {
	ListIDs          []primitive.ObjectID `json:"listIds"`
	Limit            int8                 `json:"limit"`
	FirstValueField  string               `json:"firstValueField"`
	SecondValueField string               `json:"secondValueField"`
}

type UserDBVocabs struct {
	ID         primitive.ObjectID     `json:"id"`
	UserFirst  vocabularyentity.Value `json:"userFirst"`
	UserSecond vocabularyentity.Value `json:"userSecond"`
	DBFirst    vocabularyentity.Value `json:"dbFirst"`
	DBSecond   vocabularyentity.Value `json:"dbSecond"`
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
			secondValue.Value = ""
			newValue := make([]vocabularyentity.Value, 0, 2)
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

func CheckTest(correctVocabs []vocabularyentity.Vocabulary, checkRequestBody CheckTestRequest) TestResult {
	userDBVocabs := make([]UserDBVocabs, 0, len(correctVocabs))
	correct := int8(0)
	for _, correctVocab := range correctVocabs {
		for _, vocab := range checkRequestBody.Vocabularies {
			if correctVocab.ID == vocab.ID {
				userFirstValue := vocab.GetValueByKey(checkRequestBody.FirstValueField)
				dbFirstValue := correctVocab.GetValueByKey(checkRequestBody.FirstValueField)
				userSecondValue := vocab.GetValueByKey(checkRequestBody.SecondValueField)
				dbSecondValue := correctVocab.GetValueByKey(checkRequestBody.SecondValueField)
				userDBVocabs = append(userDBVocabs, UserDBVocabs{ID: correctVocab.ID,
					DBFirst:    *dbFirstValue,
					DBSecond:   *dbSecondValue,
					UserFirst:  *userFirstValue,
					UserSecond: *userSecondValue})
				if userSecondValue.Value == dbSecondValue.Value {
					correct++
				}
				break
			}
		}
	}
	correction := TestResult{Vocabs: userDBVocabs, Correct: correct}
	return correction
}
