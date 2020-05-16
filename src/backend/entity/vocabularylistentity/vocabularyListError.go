package vocabularylistentity

type Error struct {
	ErrorText string
}

func (error Error) Error() string {
	return error.ErrorText
}
