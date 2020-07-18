package authorized

import (
	"encoding/json"
	"errors"
	"github.com/afrima/vocabulary_learning_helper/src/backend/user"
	"github.com/afrima/vocabulary_learning_helper/src/backend/utility"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/securecookie"
	"golang.org/x/crypto/bcrypt"
)

type authError struct {
	errorText string
}

func (autError authError) Error() string {
	return autError.errorText
}

type LoginDto struct {
	Login bool `json:"login"`
}

type LoginData struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

var cookieKey = []byte(os.Getenv("cookieKey"))
var tokenKey = []byte(os.Getenv("tokenKey"))
var s = securecookie.New(cookieKey, nil)

func Init(r *gin.Engine) {
	r.GET("/refresh-token", refreshToken)
	r.POST("/login", login)
	r.POST("/logout", logout)
	r.POST("/registration", registration)
	r.GET("/check-login", checkLogin)
}

func refreshToken(c *gin.Context) {
	if claims, valid := GetTokenClaims(c); valid {
		SetHTTPOnlyToken(c, claims["userName"].(string))
	} else {
		c.JSON(http.StatusOK, LoginDto{Login: false})
	}
}

func IsAuthorized(endpoint func(c *gin.Context)) func(c *gin.Context) {
	return func(c *gin.Context) {
		if _, valid := GetTokenClaims(c); valid {
			endpoint(c)
			return
		}
		c.String(http.StatusUnauthorized, "Not Authorized")
	}
}

func GetTokenClaims(c *gin.Context) (jwt.MapClaims, bool) {
	if cryptToken, err := c.Cookie("token"); err == nil && cryptToken != "" {
		var jwtToken string
		err := s.Decode("token", cryptToken, &jwtToken)
		if err != nil {
			log.Println(err)
			return nil, false
		}
		token, err := getToken(jwtToken)
		if err != nil {
			log.Println(err)
			return nil, false
		}
		if token == nil {
			return nil, false
		}
		return token.Claims.(jwt.MapClaims), token.Valid
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

func SetHTTPOnlyToken(c *gin.Context, userName string) {
	token, err := GenerateJWT(userName)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		log.Print(err)
		return
	}
	tokenValue, err := s.Encode("token", token)
	if err == nil {
		const exp = 30 * 60
		c.SetCookie("token", tokenValue, exp, "/", os.Getenv("host"), os.Getenv("secure") == "true", true)
	}
}

func checkLogin(c *gin.Context) {
	if _, valid := GetTokenClaims(c); valid {
		c.Header(utility.ContentType, utility.ContentTypeJSON)
		c.JSON(http.StatusOK, LoginDto{Login: true})
	} else {
		c.JSON(http.StatusOK, LoginDto{Login: false})
	}
}

func logout(c *gin.Context) {
	c.SetCookie("token", "", -1, "/", os.Getenv("host"), os.Getenv("secure") == "true", true)
	c.JSON(http.StatusOK, LoginDto{Login: false})
}

func login(c *gin.Context) {
	loginData, err := getLoginData(c)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		log.Print(err)
		return
	}
	loginData.Username = strings.ToLower(loginData.Username)
	dbUser, err := user.GetUser(loginData.Username)
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
	SetHTTPOnlyToken(c, loginData.Username)
	c.JSON(http.StatusOK, LoginDto{Login: true})
}

func checkUserCredentials(dbUser *user.User, loginData LoginData) error {
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
	userInDB, err := user.GetUser(loginData.Username)
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
	SetHTTPOnlyToken(c, loginData.Username)
	c.JSON(http.StatusOK, LoginDto{Login: true})
}

func saveNewUser(loginData LoginData) error {
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(loginData.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	userToRegister := user.User{UserName: loginData.Username, Password: string(passwordHash)}
	if err = userToRegister.Insert(); err != nil {
		return err
	}
	return nil
}
