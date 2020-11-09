# Vocabulary trainer

This app tests your vocabulary with a vocabulary test.
This app will also store and manage all your vocabulary.

[live demo](https://mathieukeller.de)

* user: testuser
* password: start

### How is the container executed?

Pull the Docker image or create one.

For docker pull: docker pull afrima/vocabulary_trainer

Run the Docker image with the following environment variables:

| variables | for what?                                                     |
|-----------|---------------------------------------------------------------|
| GIN_MODE  | set to release                                                |
| dbUser    | dbUser                                                        |
| dbPassword| dbPassword                                                    |
| dbAddress | mongo DB url                                                  |
| tokenKey  | key for the JWT signature                                     |
| cookieKey | Secret key to enter/decode the cookie                         |
| host      | for which host is the cookie?                                 |
| secure    | says if the cookie should only be used for a secure connection|
| port      | on which port it is running                                   |

