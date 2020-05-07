package resource

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/gorilla/securecookie"
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

func InitAuthorized(r *mux.Router) {
	r.Handle("/refresh-token", isAuthorized(refreshToken)).Methods(http.MethodGet)
}

func refreshToken(w http.ResponseWriter, _ *http.Request) {
	setHTTPOnlyToken(w)
}

func isAuthorized(endpoint func(http.ResponseWriter, *http.Request)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if cryptToken, err := r.Cookie("token"); err == nil && cryptToken != nil {
			var jwtToken string
			err := s.Decode("token", cryptToken.Value, &jwtToken)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, "%s", err.Error())
			}
			token, err := getToken(jwtToken)
			if err != nil {
				getTokenError(w, err)
				return
			}
			if token != nil && token.Valid {
				endpoint(w, r)
				return
			}
		}
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "Not Authorized")
	})
}

func getTokenError(w http.ResponseWriter, err error) {
	switch switchErr := err.(type) {
	case *jwt.ValidationError:
		{
			if switchErr.Errors == jwt.ValidationErrorExpired {
				w.WriteHeader(http.StatusUnauthorized)
				fmt.Fprintf(w, "Not Authorized")
			} else {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, "%s", err.Error())
			}
		}
	default:
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "%s", err.Error())
	}
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
