package utility

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

//Test RemoveArrayElement
func Test_RemoveArrayElement_first_index(t *testing.T) {
	array := RemoveArrayElement([]string{"test1", "test2", "test3"}, 0)
	assert.Equal(t, array, []string{"test3", "test2"})
}

//Test RemoveArrayElement
func Test_RemoveArrayElement_last_index(t *testing.T) {
	array := RemoveArrayElement([]string{"test1", "test2", "test3"}, 2)
	assert.Equal(t, array, []string{"test1", "test2"})
}

//Test RemoveArrayElement
func Test_RemoveArrayElement_middle_index(t *testing.T) {
	array := RemoveArrayElement([]string{"test1", "test2", "test3"}, 1)
	assert.Equal(t, array, []string{"test1", "test3"})
}
