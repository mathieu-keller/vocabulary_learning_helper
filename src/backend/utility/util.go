package utility

/**
remove one element from string array on position i
*/
func RemoveArrayElement(s []string, i int) []string {
	s[len(s)-1], s[i] = s[i], s[len(s)-1]
	return s[:len(s)-1]
}
