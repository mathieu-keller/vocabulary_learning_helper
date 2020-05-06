package resource

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"

	"github.com/afrima/japanese_learning_helper/src/backend/entity/user"
)

type authError struct {
	errorText string
}

func (autError authError) Error() string {
	return autError.errorText
}
func isAuthorized(endpoint func(http.ResponseWriter, *http.Request)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header["Token"] != nil {
			token, err := getToken(r)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, "%s", err.Error())
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

func getToken(r *http.Request) (*jwt.Token, error) {
	token, err := jwt.Parse(r.Header["Token"][0], func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, authError{"there was an error"}
		}
		return []byte(os.Getenv("auth_key")), nil
	})
	return token, err
}

func GenerateJWT(userName string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	const expTime = time.Minute * 30
	claims["StandardClaims"] = jwt.StandardClaims{ExpiresAt: time.Now().Add(expTime).Unix()}
	claims["authorized"] = true
	claims["client"] = userName

	// Create the JWT string
	tokenString, err := token.SignedString([]byte(os.Getenv("auth_key")))

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func InitAuthorize(r *mux.Router) {
	r.HandleFunc("/login", login).Methods(http.MethodPost)
	r.HandleFunc("/registration", registration).Methods(http.MethodPost)
}

type LoginData struct {
	UserName string `json:"userName"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token    string `json:"token"`
	UserName string `json:"userName"`
}

func login(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	var loginData LoginData
	if err = json.Unmarshal(reqBody, &loginData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	dbUser, err := user.GetUser(loginData.UserName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	if err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(loginData.Password)); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	token, err := GenerateJWT(dbUser.UserName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	res := LoginResponse{token, dbUser.UserName}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(res); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
}

func registration(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	var loginData LoginData
	if err = json.Unmarshal(reqBody, &loginData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	userInDB, err := user.GetUser(loginData.UserName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	if userInDB != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "Username is already taken!")
		return
	}
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(loginData.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	userToRegister := user.User{UserName: loginData.UserName, Password: string(passwordHash)}

	if err = userToRegister.Insert(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print(err)
		fmt.Fprint(w, err)
		return
	}
	token, err := GenerateJWT(loginData.UserName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err = json.NewEncoder(w).Encode(LoginResponse{token, loginData.UserName}); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
}
