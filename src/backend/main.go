package main

import (
	"log"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"

	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource/categoryresource"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource/loginresource"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource/vocabularylistresource"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource/vocabularyresource"
)

func main() {
	r := gin.Default()
	resource.Init(r)
	loginresource.Init(r)
	categoryresource.Init(r)
	vocabularyresource.Init(r)
	vocabularylistresource.Init(r)
	r.Use(static.Serve("/", static.LocalFile("./dist", true)))
	if err := r.Run(":8080"); err != nil {
		log.Println(err)
	}
}
