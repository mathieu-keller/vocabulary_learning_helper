db.Category.createIndex( { "name": 1, "owner": 1 }, { unique: true } )
db.VocabularyList.createIndex( { "name": 1, "categoryID": 1 }, { unique: true } )
db.VocabularyList.createIndex( { "categoryID": 1 }, { unique: false } )
db.Vocabulary.createIndex( { "listID": 1 }, { unique: false } )