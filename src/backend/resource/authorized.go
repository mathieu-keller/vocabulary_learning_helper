package resource

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/securecookie"

	"github.com/Afrima/vocabulary_learning_helper/src/backend/utility"
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

func Init(r *gin.Engine) {
	r.GET("/refresh-token", refreshToken)
	r.GET("/check-login", checkLogin)
}

type LoginDto struct {
	Login bool `json:"login"`
}

func refreshToken(c *gin.Context) {
	if claims, valid := GetTokenClaims(c); valid {
		SetHTTPOnlyToken(c, claims["userName"].(string))
	} else {
		c.JSON(http.StatusOK, LoginDto{Login: false})
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
		c.Status(http.StatusInternalServerError)
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
