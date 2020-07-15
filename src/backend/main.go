package main

import (
	"github.com/afrima/vocabulary_learning_helper/src/backend/authorized"
	"github.com/afrima/vocabulary_learning_helper/src/backend/category"
	"github.com/afrima/vocabulary_learning_helper/src/backend/importer"
	"github.com/afrima/vocabulary_learning_helper/src/backend/vocabulary"
	"github.com/afrima/vocabulary_learning_helper/src/backend/vocabulary/vocabularylist"
	"log"
	"os"

	"github.com/gin-gonic/contrib/gzip"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(gzip.Gzip(gzip.BestCompression))
	authorized.Init(r)
	importer.Init(r)
	category.Init(r)
	vocabulary.Init(r)
	vocabularylist.Init(r)
	r.Use(static.Serve("/", static.LocalFile("./dist", true)))
	if err := r.Run(":" + os.Getenv("port")); err != nil {
		log.Println(err)
	}
}
