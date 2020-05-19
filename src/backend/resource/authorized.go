package resource

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/gorilla/securecookie"

	"github.com/afrima/vocabulary_learning_helper/src/backend/utility"
)

type authError struct {
	errorText string
}

func (autError authError) Error() string {
	return autError.errorText
}

var cookieKey = []byte(os.Getenv("cookieKey"))
var tokenKey = []byte(os.Getenv("tokenKey"))
var s = securecookie.New(cookieKey, nil)

func Init(r *mux.Router) {
	r.Handle("/refresh-token", IsAuthorized(refreshToken)).Methods(http.MethodGet)
	r.HandleFunc("/check-login", checkLogin).Methods(http.MethodGet)
}

func refreshToken(w http.ResponseWriter, _ *http.Request) {
	SetHTTPOnlyToken(w)
}

func checkLogin(w http.ResponseWriter, r *http.Request) {
	if isTokenValid(r) {
		w.Header().Set(utility.ContentType, utility.ContentTypeJSON)
		SetHTTPOnlyToken(w)
		fmt.Fprint(w, "{\"login\":true}")
	} else {
		fmt.Fprint(w, "{\"login\":false}")
	}
}

func IsAuthorized(endpoint func(http.ResponseWriter, *http.Request)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if isTokenValid(r) {
			endpoint(w, r)
			return
		}
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "Not Authorized")
	})
}

func isTokenValid(r *http.Request) bool {
	if cryptToken, err := r.Cookie("token"); err == nil && cryptToken != nil {
		var jwtToken string
		err := s.Decode("token", cryptToken.Value, &jwtToken)
		if err != nil {
			log.Println(err)
			return false
		}
		token, err := getToken(jwtToken)
		if err != nil {
			log.Println(err)
			return false
		}
		return token != nil && token.Valid
	}
	return false
}

func getToken(jwtToken string) (*jwt.Token, error) {
	token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, authError{"there was an error"}
		}
		return tokenKey, nil
	})
	return token, err
}

func GenerateJWT() (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	const expTime = time.Minute * 30
	claims["exp"] = time.Now().Add(expTime).Unix()

	// Create the JWT string
	tokenString, err := token.SignedString(tokenKey)

	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func SetHTTPOnlyToken(w http.ResponseWriter) {
	token, err := GenerateJWT()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	tokenValue, err := s.Encode("token", token)
	if err == nil {
		const exp = 30 * time.Minute
		expiration := time.Now().Add(exp)
		cookie := http.Cookie{
			Name:    "token",
			Value:   tokenValue,
			Expires: expiration,
		}
		http.SetCookie(w, &cookie)
	}
}

func SendError(statusCode int, w http.ResponseWriter, err error) {
	w.WriteHeader(statusCode)
	log.Println(err)
	fmt.Fprint(w, err)
}
