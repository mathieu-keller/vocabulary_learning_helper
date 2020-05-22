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
	r.HandleFunc("/refresh-token", checkLogin).Methods(http.MethodGet)
	r.HandleFunc("/check-login", checkLogin).Methods(http.MethodGet)
}

func checkLogin(w http.ResponseWriter, r *http.Request) {
	if claims, valid := GetTokenClaims(r); valid {
		w.Header().Set(utility.ContentType, utility.ContentTypeJSON)
		SetHTTPOnlyToken(w, claims["userName"].(string))
		fmt.Fprint(w, "{\"login\":true}")
	} else {
		fmt.Fprint(w, "{\"login\":false}")
	}
}

func IsAuthorized(endpoint func(http.ResponseWriter, *http.Request)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if _, valid := GetTokenClaims(r); valid {
			endpoint(w, r)
			return
		}
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "Not Authorized")
	})
}

func GetTokenClaims(r *http.Request) (jwt.MapClaims, bool) {
	if cryptToken, err := r.Cookie("token"); err == nil && cryptToken != nil {
		var jwtToken string
		err := s.Decode("token", cryptToken.Value, &jwtToken)
		if err != nil {
			log.Println(err)
			return nil, false
		}
		token, err := getToken(jwtToken)
		if err != nil {
			log.Println(err)
			return nil, false
		}
		return token.Claims.(jwt.MapClaims), token != nil && token.Valid
	}
	return nil, false
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

func GenerateJWT(userName string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	const expTime = time.Minute * 30
	claims["exp"] = time.Now().Add(expTime).Unix()
	claims["userName"] = userName

	// Create the JWT string
	tokenString, err := token.SignedString(tokenKey)

	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func SetHTTPOnlyToken(w http.ResponseWriter, userName string) {
	token, err := GenerateJWT(userName)
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
