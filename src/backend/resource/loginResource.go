package resource

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"

	"github.com/afrima/japanese_learning_helper/src/backend/entity/user"
)

func InitLogin(r *mux.Router) {
	r.HandleFunc("/login", login).Methods(http.MethodPost)
	r.HandleFunc("/logout", logout).Methods(http.MethodPost)
	r.HandleFunc("/registration", registration).Methods(http.MethodPost)
}

type LoginData struct {
	UserName string `json:"userName"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func logout(w http.ResponseWriter, _ *http.Request) {
	c := http.Cookie{
		Name:    "token",
		Value:   "",
		Expires: time.Unix(0, 0),
	}
	http.SetCookie(w, &c)
}

func login(w http.ResponseWriter, r *http.Request) {
	loginData, err := getLoginData(r)
	if err != nil {
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
	if err = checkUserCredentials(dbUser, loginData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	setHTTPOnlyToken(w, loginData)
}

func checkUserCredentials(dbUser *user.User, loginData LoginData) error {
	if dbUser == nil {
		return errors.New("unauthorized")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(loginData.Password)); err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return errors.New("unauthorized")
		}
		return err
	}
	return nil
}

func getLoginData(r *http.Request) (LoginData, error) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return LoginData{}, err
	}
	var loginData LoginData
	if err = json.Unmarshal(reqBody, &loginData); err != nil {
		return LoginData{}, err
	}
	loginData.UserName = strings.Title(strings.ToLower(loginData.UserName))
	return loginData, nil
}

func registration(w http.ResponseWriter, r *http.Request) {
	loginData, err := getLoginData(r)
	if err != nil {
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
	if err = saveNewUser(loginData); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		log.Print(err)
		return
	}
	setHTTPOnlyToken(w, loginData)
}

func saveNewUser(loginData LoginData) error {
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(loginData.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	userToRegister := user.User{UserName: loginData.UserName, Password: string(passwordHash)}
	if err = userToRegister.Insert(); err != nil {
		return err
	}
	return nil
}

func setHTTPOnlyToken(w http.ResponseWriter, loginData LoginData) {
	token, err := GenerateJWT(loginData.UserName)
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
