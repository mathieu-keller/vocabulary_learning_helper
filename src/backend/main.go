package main

import (
	"log"
	"os"

	"github.com/gin-gonic/contrib/gzip"
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
	r.Use(gzip.Gzip(gzip.BestCompression))
	resource.Init(r)
	loginresource.Init(r)
	categoryresource.Init(r)
	vocabularyresource.Init(r)
	vocabularylistresource.Init(r)
	r.Use(static.Serve("/", static.LocalFile("./dist", true)))
	if err := r.Run(":"+os.Getenv("port")); err != nil {
		log.Println(err)
	}
}

#!/bin/env python3
# Created by atbswp (https://github.com/rmpr/atbswp)
# on 29 Jun 2020
import pyautogui
import time
pyautogui.FAILSAFE = False

