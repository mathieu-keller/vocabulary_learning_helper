package loginresource

import (
	"encoding/json"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/Afrima/vocabulary_learning_helper/src/backend/entity/userentity"
	"github.com/Afrima/vocabulary_learning_helper/src/backend/resource"
)

func Init(r *gin.Engine) {
	r.POST("/login", login)
	r.POST("/logout", logout)
	r.POST("/registration", registration)
}

type LoginData struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func logout(c *gin.Context) {
	c.SetCookie("token", "", -1, "/", os.Getenv("host"), os.Getenv("secure") == "true", true)
	c.JSON(http.StatusOK, resource.LoginDto{Login: false})
}

func login(c *gin.Context) {
	loginData, err := getLoginData(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		log.Print(err)
		return
	}
	loginData.Username = strings.ToLower(loginData.Username)
	dbUser, err := userentity.GetUser(loginData.Username)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		log.Print(err)
		return
	}
	if err = checkUserCredentials(dbUser, loginData); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		log.Print(err)
		return
	}
	resource.SetHTTPOnlyToken(c, loginData.Username)
	c.JSON(http.StatusOK, resource.LoginDto{Login: true})
}

func checkUserCredentials(dbUser *userentity.User, loginData LoginData) error {
	if dbUser == nil {
		return errors.New("credentials wrong")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(loginData.Password)); err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return errors.New("credentials wrong")
		}
		return err
	}
	return nil
}

func getLoginData(c *gin.Context) (LoginData, error) {
	reqBody, err := c.GetRawData()
	if err != nil {
		return LoginData{}, err
	}
	var loginData LoginData
	if err = json.Unmarshal(reqBody, &loginData); err != nil {
		return LoginData{}, err
	}
	loginData.Username = strings.Title(strings.ToLower(loginData.Username))
	return loginData, nil
}

func registration(c *gin.Context) {
	loginData, err := getLoginData(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		log.Print(err)
		return
	}
	loginData.Username = strings.ToLower(loginData.Username)
	userInDB, err := userentity.GetUser(loginData.Username)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		log.Print(err)
		return
	}
	if userInDB != nil {
		c.String(http.StatusBadRequest, "Username is already taken!")
		return
	}
	if err = saveNewUser(loginData); err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		log.Print(err)
		return
	}
	resource.SetHTTPOnlyToken(c, loginData.Username)
	c.JSON(http.StatusOK, resource.LoginDto{Login: true})
}

func saveNewUser(loginData LoginData) error {
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(loginData.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	userToRegister := userentity.User{UserName: loginData.Username, Password: string(passwordHash)}
	if err = userToRegister.Insert(); err != nil {
		return err
	}
	return nil
}
